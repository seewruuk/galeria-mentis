#!/usr/bin/env node
/**
 * Przeniesienie danych prywatnych (zamówienia, użytkownicy) pod ukryte ID "private.<typ>.<id>".
 * Dokumenty z kropką w ID nie są dostępne publicznie, także w publicznym datasecie Sanity.
 *
 * Etapy (uruchamiane osobno, w katalogu projektu):
 *   node scripts/migrate-private-ids.mjs              – podgląd (nic nie zmienia)
 *   node scripts/migrate-private-ids.mjs --copy       – kopia zapasowa + utworzenie kopii pod nowymi ID
 *   node scripts/migrate-private-ids.mjs --delete-old – usunięcie starych, publicznych dokumentów
 *                                                       (tylko tych, których kopia istnieje i jest zgodna)
 *
 * Używa tokenu z istniejącego pliku .env (SANITY_API_WRITE_TOKEN albo NEXT_PUBLIC_SANITY_API_TOKEN).
 */
import fs from "node:fs";
import path from "node:path";
import {createClient} from "next-sanity";

try {
    process.loadEnvFile(".env");
} catch {
    console.error("Nie znaleziono pliku .env w bieżącym katalogu");
}

const TYPES = ["order", "user"];
const privateId = (type, id) => `private.${type}.${id}`;
const isPublicId = (id) => !id.includes(".");

const mode = process.argv.includes("--copy") ? "copy" : process.argv.includes("--delete-old") ? "delete" : "dry";

const token = process.env.SANITY_API_WRITE_TOKEN || process.env.NEXT_PUBLIC_SANITY_API_TOKEN;
if (!token) {
    console.error("Brak tokenu Sanity w .env");
    process.exit(1);
}

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "q8e63jpz",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    apiVersion: "2024-06-08",
    useCdn: false,
    token,
    perspective: "raw",
});

const SYSTEM_FIELDS = new Set(["_id", "_rev", "_updatedAt"]);

function remapReferences(value, idMap) {
    if (Array.isArray(value)) return value.map((v) => remapReferences(v, idMap));
    if (value && typeof value === "object") {
        const out = {};
        for (const [key, v] of Object.entries(value)) {
            if (key === "_ref" && typeof v === "string" && idMap.has(v)) out[key] = idMap.get(v);
            else out[key] = remapReferences(v, idMap);
        }
        return out;
    }
    return value;
}

async function commitInBatches(mutations, label) {
    const size = 50;
    for (let i = 0; i < mutations.length; i += size) {
        const tx = client.transaction();
        for (const m of mutations.slice(i, i + size)) m(tx);
        await tx.commit({visibility: "async"});
        process.stdout.write(`\r${label}: ${Math.min(i + size, mutations.length)}/${mutations.length}`);
    }
    if (mutations.length) process.stdout.write("\n");
}

const all = await client.fetch(`*[_type in $types]`, {types: TYPES});
const published = all.filter((d) => isPublicId(d._id));
const drafts = all.filter((d) => d._id.startsWith("drafts.") && isPublicId(d._id.slice(7)));
const migrated = new Set(all.filter((d) => d._id.startsWith("private.")).map((d) => d._id));

const idMap = new Map();
for (const doc of published) idMap.set(doc._id, privateId(doc._type, doc._id));

console.log(`Tryb: ${mode}`);
for (const type of TYPES) {
    const pub = published.filter((d) => d._type === type).length;
    const priv = all.filter((d) => d._type === type && d._id.startsWith("private.")).length;
    console.log(`  ${type.padEnd(6)} publicznych: ${String(pub).padStart(5)}   ukrytych: ${String(priv).padStart(5)}`);
}
if (drafts.length) console.log(`  szkice (drafts) prywatnych typów do usunięcia: ${drafts.length}`);

// Dokumenty innych typów, które wskazują na migrowane dokumenty (np. opinie w produktach)
const externalRefs = await client.fetch(
    `*[!(_type in $types) && references($ids)]{_id, _type}`,
    {types: TYPES, ids: [...idMap.keys()].slice(0, 5000)}
);
if (externalRefs.length) {
    console.log(`  Uwaga: ${externalRefs.length} dokumentów innych typów ma referencje do migrowanych danych – zostaną zaktualizowane.`);
}

if (mode === "dry") {
    console.log("\nPodgląd zakończony. Nic nie zostało zmienione.");
    process.exit(0);
}

if (mode === "copy") {
    const backupDir = path.resolve("backups");
    fs.mkdirSync(backupDir, {recursive: true});
    const file = path.join(backupDir, `sanity-private-${new Date().toISOString().replace(/[:.]/g, "-")}.ndjson`);
    fs.writeFileSync(file, all.map((d) => JSON.stringify(d)).join("\n") + "\n");
    console.log(`Kopia zapasowa: ${file} (${all.length} dokumentów) – folder backups/ jest w .gitignore (zawiera dane osobowe, nie wysyłaj go nigdzie).`);

    const creates = [];
    for (const type of TYPES) {
        for (const doc of published.filter((d) => d._type === type)) {
            const newId = idMap.get(doc._id);
            if (migrated.has(newId)) continue;
            const copy = {};
            for (const [key, value] of Object.entries(doc)) {
                if (!SYSTEM_FIELDS.has(key)) copy[key] = value;
            }
            const remapped = remapReferences(copy, idMap);
            creates.push((tx) => tx.createIfNotExists({...remapped, _id: newId}));
        }
    }
    await commitInBatches(creates, "Tworzenie kopii");

    const patches = [];
    for (const ref of externalRefs) {
        const {_rev, _updatedAt, ...doc} = await client.getDocument(ref._id);
        const updated = remapReferences(doc, idMap);
        patches.push((tx) => tx.createOrReplace(updated));
    }
    await commitInBatches(patches, "Aktualizacja referencji");

    console.log("\nGotowe. Stare dokumenty NIE zostały usunięte. Sprawdź panel zamówień, potem uruchom z --delete-old.");
    process.exit(0);
}

if (mode === "delete") {
    const deletions = [];
    const missing = [];
        const ordered = [...TYPES].reverse().flatMap((type) => published.filter((d) => d._type === type));
    for (const draft of drafts) deletions.push((tx) => tx.delete(draft._id));
    for (const doc of ordered) {
        const newId = idMap.get(doc._id);
        const copy = all.find((d) => d._id === newId);
        const sameType = copy && copy._type === doc._type;
        const sameKey = doc._type !== "order" || copy?.orderNumber === doc.orderNumber;
        if (!copy || !sameType || !sameKey) {
            missing.push(doc._id);
            continue;
        }
        deletions.push((tx) => tx.delete(doc._id));
    }

    if (missing.length) {
        console.log(`Pomijam ${missing.length} dokumentów bez poprawnej kopii (uruchom najpierw --copy).`);
    }
    await commitInBatches(deletions, "Usuwanie starych dokumentów");

    const leftover = await client.fetch(`count(*[_type in $types && !(_id in path("private.**")) && !(_id in path("drafts.**"))])`, {types: TYPES});
    console.log(`\nPozostało publicznych dokumentów prywatnych typów: ${leftover}`);
    process.exit(0);
}

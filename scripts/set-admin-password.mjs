#!/usr/bin/env node
/**
 * Ustawienie nowego hasła dla konta w panelu (/dashboard).
 *
 * Użycie (w katalogu projektu):
 *   node scripts/set-admin-password.mjs
 *
 * Skrypt zapyta o e-mail i nowe hasło (hasło nie jest wyświetlane), zapisze w Sanity hash scrypt
 * i tym samym unieważni wszystkie dotychczasowe sesje tego konta.
 * Używa tokenu z istniejącego pliku .env (SANITY_API_WRITE_TOKEN albo NEXT_PUBLIC_SANITY_API_TOKEN).
 */
import crypto from "node:crypto";
import {promisify} from "node:util";
import readline from "node:readline";
import {createClient} from "next-sanity";

try {
    process.loadEnvFile(".env");
} catch {
    console.error("Nie znaleziono pliku .env w bieżącym katalogu");
}

const scrypt = promisify(crypto.scrypt);

function ask(question, {hidden = false} = {}) {
    return new Promise((resolve) => {
        const rl = readline.createInterface({input: process.stdin, output: process.stdout, terminal: true});
        if (hidden) {
            rl._writeToOutput = (text) => {
                if (text.includes(question)) rl.output.write(text);
                else rl.output.write("*");
            };
        }
        rl.question(question, (answer) => {
            rl.close();
            if (hidden) process.stdout.write("\n");
            resolve(answer);
        });
    });
}

async function hashPassword(password) {
    const N = 16384, r = 8, p = 1, keylen = 64;
    const salt = crypto.randomBytes(16);
    const derived = await scrypt(password, salt, keylen, {N, r, p, maxmem: 64 * 1024 * 1024});
    return `scrypt$${N}$${r}$${p}$${salt.toString("base64")}$${derived.toString("base64")}`;
}

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
});

const email = (await ask("E-mail konta: ")).trim();
// także stara (publiczna) kopia konta, jeśli migracja nie została jeszcze dokończona
const users = await client.fetch(`*[_type == "user" && lower(userInfo.email) == lower($email) && !(_id in path("drafts.**"))]{_id}`, {email});
if (!users.length) {
    console.error("Nie znaleziono konta o tym adresie e-mail.");
    process.exit(1);
}

const password = await ask("Nowe hasło (min. 12 znaków): ", {hidden: true});
if (password.length < 12) {
    console.error("Hasło musi mieć co najmniej 12 znaków.");
    process.exit(1);
}
const repeat = await ask("Powtórz hasło: ", {hidden: true});
if (password !== repeat) {
    console.error("Hasła nie są takie same.");
    process.exit(1);
}

const hash = await hashPassword(password);
for (const user of users) {
    await client.patch(user._id).set({"userInfo.hashPassword": hash}).commit();
}
console.log("Hasło zostało zmienione. Wszystkie poprzednie sesje tego konta są nieważne.");

import "server-only";
import crypto from "node:crypto";
import {promisify} from "node:util";
import {cookies} from "next/headers";
import groq from "groq";
import {fetchFresh, writeClient} from "@/lib/server/sanity";
import {createRateLimiter} from "@/lib/server/http";
import {getSessionSecret, safeEqual} from "@/lib/server/secrets";

const scrypt = promisify(crypto.scrypt);

export const SESSION_COOKIE = "gm_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 godzin

const SCRYPT_PARAMS = {N: 16384, r: 8, p: 1, keylen: 64};
const SCRYPT_MAXMEM = 64 * 1024 * 1024;

export function getAdminRoleCode() {
    return process.env.ADMIN_ROLE_CODE || process.env.NEXT_PUBLIC_ADMIN_ROLE_CODE || null;
}

/* ---------------- Hasła ---------------- */

export async function hashPassword(password) {
    const salt = crypto.randomBytes(16);
    const {N, r, p, keylen} = SCRYPT_PARAMS;
    const derived = await scrypt(password, salt, keylen, {N, r, p, maxmem: SCRYPT_MAXMEM});
    return `scrypt$${N}$${r}$${p}$${salt.toString("base64")}$${derived.toString("base64")}`;
}

// Stały "fałszywy" hash – przy nieistniejącym koncie i tak liczymy scrypt (brak różnicy w czasie odpowiedzi)
const DUMMY_HASH = "scrypt$16384$8$1$AAAAAAAAAAAAAAAAAAAAAA==$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==";

// Stary format (SHA-256 z hasła + "10", liczony dawniej w przeglądarce)
function legacyHash(password) {
    return crypto.createHash("sha256").update(password + "10").digest("hex");
}

/**
 * Weryfikacja hasła. Zwraca {valid, needsUpgrade}.
 * Stare hashe SHA-256 są akceptowane jednorazowo – po udanym logowaniu zamieniamy je na scrypt.
 */
export async function verifyPassword(password, storedHash) {
    if (typeof password !== "string") return {valid: false, needsUpgrade: false};

    if (typeof storedHash === "string" && /^[a-f0-9]{64}$/i.test(storedHash)) {
        // wyrównanie czasu z gałęzią scrypt
        await scrypt(password, "legacy-timing", 64, {...SCRYPT_PARAMS, maxmem: SCRYPT_MAXMEM}).catch(() => null);
        const valid = safeEqual(legacyHash(password), storedHash.toLowerCase());
        return {valid, needsUpgrade: valid};
    }

    const hash = typeof storedHash === "string" && storedHash.startsWith("scrypt$") ? storedHash : DUMMY_HASH;
    try {
        const [, N, r, p, saltB64, hashB64] = hash.split("$");
        const expected = Buffer.from(hashB64, "base64");
        const derived = await scrypt(password, Buffer.from(saltB64, "base64"), expected.length, {
            N: Number(N), r: Number(r), p: Number(p), maxmem: SCRYPT_MAXMEM,
        });
        return {valid: hash !== DUMMY_HASH && crypto.timingSafeEqual(derived, expected), needsUpgrade: false};
    } catch {
        return {valid: false, needsUpgrade: false};
    }
}

export async function upgradePasswordHash(user, password) {
    const newHash = await hashPassword(password);
    await writeClient.patch(user._id).set({"userInfo.hashPassword": newHash}).commit();
    return {...user, userInfo: {...user.userInfo, hashPassword: newHash}};
}

/* ---------------- Sesja ---------------- */

function sign(value) {
    return crypto.createHmac("sha256", getSessionSecret()).update(`session:${value}`).digest("base64url");
}

// Krótki odcisk hasha hasła – zmiana hasła unieważnia wszystkie istniejące sesje
function passwordFingerprint(storedHash) {
    return crypto.createHash("sha256").update(String(storedHash)).digest("base64url").slice(0, 16);
}

function createSessionToken(user) {
    const payload = {
        uid: user._id,
        pwf: passwordFingerprint(user.userInfo?.hashPassword),
        exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
    };
    const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
    return `${encoded}.${sign(encoded)}`;
}

function readSessionToken(token) {
    if (typeof token !== "string" || !token.includes(".")) return null;
    const [encoded, signature] = token.split(".");
    let expected;
    try {
        expected = sign(encoded);
    } catch {
        return null;
    }
    if (!safeEqual(signature, expected)) return null;
    try {
        const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
        if (!payload?.uid || !payload?.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
        return payload;
    } catch {
        return null;
    }
}

const cookieOptions = (maxAge) => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
});

export function setSessionCookie(response, user) {
    response.cookies.set(SESSION_COOKIE, createSessionToken(user), cookieOptions(SESSION_TTL_SECONDS));
}

export function clearSessionCookie(response) {
    response.cookies.set(SESSION_COOKIE, "", cookieOptions(0));
}

/* ---------------- Użytkownicy ---------------- */

export async function getUserByEmail(email) {
    if (typeof email !== "string" || !email.trim()) return null;
    return fetchFresh(groq`*[_type == "user" && lower(userInfo.email) == lower($email)] | order(length(_id) desc)[0]{
        _id,
        userInfo,
        role,
    }`, {email: email.trim()});
}

async function getUserById(id) {
    return fetchFresh(groq`*[_type == "user" && _id == $id][0]{
        _id,
        userInfo,
        role,
    }`, {id});
}

export function isAdmin(user) {
    const adminRole = getAdminRoleCode();
    return !!user && !!adminRole && user.role === adminRole;
}

/** Dane użytkownika bezpieczne do wysłania do przeglądarki (bez hasha i bez kodu roli). */
export function publicUser(user) {
    return {
        _id: user._id,
        name: user.userInfo?.name || "",
        lastname: user.userInfo?.lastname || "",
        email: user.userInfo?.email || "",
        isAdmin: isAdmin(user),
    };
}

/** Zwraca zalogowanego użytkownika (dane z Sanity, zweryfikowane) albo null. */
export async function getSessionUser() {
    const token = (await cookies()).get(SESSION_COOKIE)?.value;
    const payload = readSessionToken(token);
    if (!payload) return null;

    const user = await getUserById(payload.uid);
    if (!user) return null;
    if (passwordFingerprint(user.userInfo?.hashPassword) !== payload.pwf) return null;

    return user;
}

export async function getAdminUser() {
    const user = await getSessionUser();
    return isAdmin(user) ? user : null;
}

/* ---------------- Ograniczanie prób ---------------- */
// Pamięć procesu – na Vercelu per instancja (best effort).
export const loginIpLimiter = createRateLimiter({windowMs: 15 * 60 * 1000, max: 10});
export const loginEmailLimiter = createRateLimiter({windowMs: 15 * 60 * 1000, max: 30});
export const registerIpLimiter = createRateLimiter({windowMs: 60 * 60 * 1000, max: 5});

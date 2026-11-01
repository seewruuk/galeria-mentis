import "server-only";
import crypto from "node:crypto";

/**
 * Sekret do podpisywania ciasteczek (sesja panelu, odblokowanie przerwy technicznej).
 * Jeśli nie ustawiono SESSION_SECRET, wyprowadzamy go z istniejącego sekretu serwerowego (token Sanity / klucz Stripe),
 * dzięki czemu nie trzeba dodawać nowych zmiennych środowiskowych.
 */
let cached = null;

export function getSessionSecret() {
    if (cached) return cached;
    if (process.env.SESSION_SECRET && process.env.SESSION_SECRET.length >= 32) {
        cached = process.env.SESSION_SECRET;
        return cached;
    }
    const base = process.env.SANITY_API_WRITE_TOKEN || process.env.NEXT_PUBLIC_SANITY_API_TOKEN || process.env.STRIPE_SECRET_KEY;
    if (!base) throw new Error("Brak sekretu serwerowego do podpisywania sesji");
    cached = crypto.createHmac("sha256", base).update("galeria-mentis/session/v1").digest("base64url");
    return cached;
}

export function hmac(value) {
    return crypto.createHmac("sha256", getSessionSecret()).update(String(value)).digest("base64url");
}

export function safeEqual(a, b) {
    const bufA = Buffer.from(String(a));
    const bufB = Buffer.from(String(b));
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
}

import "server-only";

export function getClientIp(request) {
    const realIp = request.headers.get("x-real-ip");
    if (realIp) return realIp.trim();
    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded) {
        const parts = forwarded.split(",").map((p) => p.trim()).filter(Boolean);
        return parts[parts.length - 1] || "unknown";
    }
    return "unknown";
}

function allowedHosts(request) {
    const hosts = new Set();
    const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
    if (host) hosts.add(host);
    try {
        if (process.env.NEXT_PUBLIC_BASE_URL) hosts.add(new URL(process.env.NEXT_PUBLIC_BASE_URL).host);
    } catch {
    }
    return hosts;
}

/** Ochrona CSRF: żądanie zmieniające stan musi pochodzić z tej samej domeny. */
export function isSameOrigin(request) {
    const origin = request.headers.get("origin");
    if (!origin) return false;
    try {
        return allowedHosts(request).has(new URL(origin).host);
    } catch {
        return false;
    }
}

/** Prosty limiter w pamięci procesu (okno przesuwne, best effort). */
export function createRateLimiter({windowMs, max, maxKeys = 10000}) {
    const hits = new Map();
    function prune(now) {
        for (const [key, list] of hits) {
            const fresh = list.filter((t) => now - t < windowMs);
            if (fresh.length) hits.set(key, fresh);
            else hits.delete(key);
        }
    }
    return {
        hit(key) {
            const now = Date.now();
            if (hits.size > maxKeys) prune(now);
            const list = (hits.get(key) || []).filter((t) => now - t < windowMs);
            list.push(now);
            hits.set(key, list);
            return list.length > max;
        },
        isLimited(key) {
            const now = Date.now();
            return (hits.get(key) || []).filter((t) => now - t < windowMs).length >= max;
        },
        reset(key) {
            hits.delete(key);
        },
    };
}

export async function readJson(request) {
    try {
        const body = await request.json();
        return body && typeof body === "object" ? body : null;
    } catch {
        return null;
    }
}

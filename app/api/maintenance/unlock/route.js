import {NextResponse} from "next/server";
import {getMaintenanceMode} from "@/sanity/getSanity/getMaintenanceMode";
import {isMaintenanceUnlocked, MAINTENANCE_COOKIE, unlockToken} from "@/lib/server/maintenance";
import {safeEqual} from "@/lib/server/secrets";
import {createRateLimiter, getClientIp, isSameOrigin, readJson} from "@/lib/server/http";

export const dynamic = "force-dynamic";

const limiter = createRateLimiter({windowMs: 15 * 60 * 1000, max: 10});

// Stan odblokowania dla bieżącej przeglądarki (ciasteczko httpOnly jest czytelne tylko na serwerze)
export async function GET() {
    const maintenance = await getMaintenanceMode().catch(() => null);
    const unlocked = await isMaintenanceUnlocked(maintenance);
    return NextResponse.json({unlocked}, {headers: {"Cache-Control": "no-store"}});
}

export async function POST(request) {
    if (!isSameOrigin(request)) {
        return NextResponse.json({status: "error"}, {status: 403});
    }
    if (limiter.hit(`ip:${getClientIp(request)}`)) {
        return NextResponse.json({status: "error", message: "Too many attempts. Try again later."}, {status: 429});
    }

    const body = await readJson(request);
    const password = typeof body?.password === "string" ? body.password : "";
    const maintenance = await getMaintenanceMode().catch(() => null);

    if (!maintenance?.isActive || !maintenance.password || !password || !safeEqual(password, maintenance.password)) {
        return NextResponse.json({status: "error", message: "Incorrect password"}, {status: 401});
    }

    const response = NextResponse.json({status: "ok"});
    response.cookies.set(MAINTENANCE_COOKIE, unlockToken(maintenance.password), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
    });
    return response;
}

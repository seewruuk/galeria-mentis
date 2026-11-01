import {NextResponse} from "next/server";
import {
    getUserByEmail,
    loginEmailLimiter,
    loginIpLimiter,
    publicUser,
    setSessionCookie,
    upgradePasswordHash,
    verifyPassword,
} from "@/lib/server/auth";
import {getClientIp, isSameOrigin, readJson} from "@/lib/server/http";

export const dynamic = "force-dynamic";

const GENERIC_ERROR = "Niepoprawne dane logowania";

export async function POST(request) {
    if (!isSameOrigin(request)) {
        return NextResponse.json({status: "error", message: "Forbidden"}, {status: 403});
    }

    const body = await readJson(request);
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!email || !password || email.length > 200 || password.length > 200) {
        return NextResponse.json({status: "error", message: GENERIC_ERROR}, {status: 400});
    }

    const ipKey = `ip:${getClientIp(request)}`;
    const emailKey = `email:${email}`;
    if (loginIpLimiter.isLimited(ipKey) || loginEmailLimiter.isLimited(emailKey)) {
        return NextResponse.json({status: "error", message: "Zbyt wiele prób logowania. Spróbuj ponownie za kilka minut."}, {status: 429});
    }

    try {
        let user = await getUserByEmail(email);
        const {valid, needsUpgrade} = await verifyPassword(password, user?.userInfo?.hashPassword);

        if (!user || !valid) {
            loginIpLimiter.hit(ipKey);
            loginEmailLimiter.hit(emailKey);
            return NextResponse.json({status: "error", message: GENERIC_ERROR}, {status: 401});
        }

        loginIpLimiter.reset(ipKey);

        if (needsUpgrade) {
            try {
                user = await upgradePasswordHash(user, password);
            } catch (e) {
                console.error("[auth] Nie udało się zaktualizować hasha hasła:", e.message);
            }
        }

        const response = NextResponse.json({status: "ok", user: publicUser(user)});
        setSessionCookie(response, user);
        return response;
    } catch (e) {
        console.error("[auth] Błąd logowania:", e.message);
        return NextResponse.json({status: "error", message: "Wystąpił błąd podczas logowania"}, {status: 500});
    }
}

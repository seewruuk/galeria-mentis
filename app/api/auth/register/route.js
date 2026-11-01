import crypto from "node:crypto";
import {NextResponse} from "next/server";
import {getUserByEmail, hashPassword, publicUser, registerIpLimiter, setSessionCookie} from "@/lib/server/auth";
import {getClientIp, isSameOrigin, readJson} from "@/lib/server/http";
import {writeClient} from "@/lib/server/sanity";
import {privateId} from "@/sanity/privateIds";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clean = (value, max = 100) => (typeof value === "string" ? value.trim().slice(0, max) : "");

export async function POST(request) {
    if (!isSameOrigin(request)) {
        return NextResponse.json({status: "error", message: "Forbidden"}, {status: 403});
    }
    if (registerIpLimiter.hit(`ip:${getClientIp(request)}`)) {
        return NextResponse.json({status: "error", message: "Zbyt wiele prób. Spróbuj ponownie później."}, {status: 429});
    }

    const body = await readJson(request);
    const name = clean(body?.name);
    const lastname = clean(body?.lastname);
    const email = clean(body?.email, 200).toLowerCase();
    const password = typeof body?.password === "string" ? body.password : "";

    if (!name || !lastname || !EMAIL_RE.test(email)) {
        return NextResponse.json({status: "error", message: "Uzupełnij poprawnie wszystkie pola"}, {status: 400});
    }
    if (password.length < 8 || password.length > 200) {
        return NextResponse.json({status: "error", message: "Hasło musi mieć co najmniej 8 znaków"}, {status: 400});
    }

    try {
        const existing = await getUserByEmail(email);
        if (existing) {
            return NextResponse.json({status: "error", message: "Konto z tym adresem e-mail już istnieje"}, {status: 409});
        }

        const user = await writeClient.create({
            _id: privateId("user", crypto.randomUUID()),
            _type: "user",
            userInfo: {name, lastname, email, hashPassword: await hashPassword(password)},
            role: "user",
        });

        const response = NextResponse.json({status: "ok", user: publicUser(user)});
        setSessionCookie(response, user);
        return response;
    } catch (e) {
        console.error("[auth] Błąd rejestracji:", e.message);
        return NextResponse.json({status: "error", message: "Wystąpił błąd podczas tworzenia konta"}, {status: 500});
    }
}

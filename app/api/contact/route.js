import {NextResponse} from "next/server";
import {createRateLimiter, getClientIp, isSameOrigin, readJson} from "@/lib/server/http";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const limiter = createRateLimiter({windowMs: 60 * 60 * 1000, max: 5});
const str = (value, max) => (typeof value === "string" ? value.trim().slice(0, max) : "");

// Szablon formularza kontaktowego w EmailJS (inny niż szablon maili z zamówieniami)
const CONTACT_TEMPLATE_ID = process.env.EMAILJS_CONTACT_TEMPLATE_ID || "template_772xy2q";

// Formularz kontaktowy – klucze EmailJS są tylko na serwerze (wcześniej były w kodzie przeglądarki)
export async function POST(request) {
    if (!isSameOrigin(request)) {
        return NextResponse.json({status: "error"}, {status: 403});
    }

    const body = await readJson(request);
    // pole-pułapka na boty (niewidoczne dla ludzi)
    if (body?.website) return NextResponse.json({status: "ok"});

    const name = str(body?.name, 100);
    const email = str(body?.email, 200);
    const subject = str(body?.subject, 200);
    const message = str(body?.message, 5000);

    if (!name || !subject || !message || !EMAIL_RE.test(email)) {
        return NextResponse.json({status: "error", message: "Please fill in all fields."}, {status: 400});
    }
    if (limiter.hit(`ip:${getClientIp(request)}`)) {
        return NextResponse.json({status: "error", message: "Too many messages. Please try again later."}, {status: 429});
    }

    try {
        const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                service_id: process.env.EMAILJS_SERVICE_ID,
                template_id: CONTACT_TEMPLATE_ID,
                user_id: process.env.EMAILJS_PUBLISH_KEY,
                template_params: {
                    name,
                    desc: subject + " " + new Date().toISOString(),
                    message,
                    customer_email: email,
                },
                accessToken: process.env.EMAILJS_PRIVATE_KEY,
            }),
            cache: "no-store",
        });
        const text = await response.text();
        if (text.trim() !== "OK") {
            console.error("[contact] EmailJS:", response.status, text.slice(0, 200));
            return NextResponse.json({status: "error", message: "There was an error sending the message. Please try again later."}, {status: 502});
        }
        return NextResponse.json({status: "ok"});
    } catch (error) {
        console.error("[contact]", error.message);
        return NextResponse.json({status: "error", message: "There was an error sending the message. Please try again later."}, {status: 500});
    }
}

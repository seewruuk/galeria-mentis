import {NextResponse} from "next/server";
import {createRateLimiter, getClientIp, isSameOrigin, readJson} from "@/lib/server/http";
import {subscribeToNewsletter} from "@/lib/server/newsletter";

export const dynamic = "force-dynamic";

const limiter = createRateLimiter({windowMs: 60 * 60 * 1000, max: 10});

export async function POST(request) {
    if (!isSameOrigin(request)) {
        return NextResponse.json({status: "error", message: "Forbidden"}, {status: 403});
    }
    if (limiter.hit(`ip:${getClientIp(request)}`)) {
        return NextResponse.json({status: "error", message: "Too many requests"}, {status: 429});
    }

    const body = await readJson(request);
    // zgodność wstecz: dawniej {dataToSend: {email}}
    const email = body?.email ?? body?.dataToSend?.email;

    try {
        const result = await subscribeToNewsletter(email);
        if (result.ok) {
            return NextResponse.json({status: "success", message: "Dodano do newslettera"});
        }
        return NextResponse.json({status: "error", message: "Wystąpił błąd podczas dodawania do newslettera"}, {status: result.reason === "invalid" ? 400 : 502});
    } catch (error) {
        console.error("[newsletter]", error.message);
        return NextResponse.json({status: "error", message: "Wystąpił błąd podczas dodawania do newslettera"}, {status: 500});
    }
}

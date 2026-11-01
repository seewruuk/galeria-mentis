import {NextResponse} from "next/server";
import {createRateLimiter, getClientIp, isSameOrigin, readJson} from "@/lib/server/http";
import {CheckoutError, createCheckout, sanitizeInvoice, validatePerson} from "@/lib/server/checkout";

export const dynamic = "force-dynamic";

const limiter = createRateLimiter({windowMs: 10 * 60 * 1000, max: 15});

export async function POST(request) {
    if (!isSameOrigin(request)) {
        return NextResponse.json({status: "error", message: "Forbidden"}, {status: 403});
    }
    if (limiter.hit(`ip:${getClientIp(request)}`)) {
        return NextResponse.json({status: "error", message: "Too many attempts. Please try again later."}, {status: 429});
    }

    const body = await readJson(request);

    try {
        const person = validatePerson(body?.person);
        const result = await createCheckout({
            items: body?.items,
            person,
            invoice: sanitizeInvoice(body?.invoice),
            newsletter: body?.newsletter === true,
            expectedTotal: body?.expectedTotal,
        });
        return NextResponse.json({status: "ok", url: result.url, orderNumber: result.orderNumber});
    } catch (error) {
        if (error instanceof CheckoutError) {
            return NextResponse.json({status: "error", code: error.code, message: error.message, ...error.extra}, {status: error.status});
        }
        console.error("[checkout]", error.message);
        return NextResponse.json({status: "error", message: "There was an error processing your order. Please try again later."}, {status: 500});
    }
}

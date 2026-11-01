import {NextResponse} from "next/server";
import {getStripe} from "@/lib/server/checkout";
import {fulfillCheckoutSession} from "@/lib/server/fulfillment";

export const dynamic = "force-dynamic";

const HANDLED_EVENTS = new Set(["checkout.session.completed", "checkout.session.async_payment_succeeded"]);

/**
 * Webhook Stripe. Nie ufamy treści żądania: identyfikator sesji pobieramy z API Stripe
 * (kluczem tajnym) i dopiero na tej podstawie oznaczamy zamówienie jako opłacone.
 * Jeśli ustawiono STRIPE_WEBHOOK_SECRET, dodatkowo weryfikujemy podpis.
 */
export async function POST(request) {
    const rawBody = await request.text();
    const stripe = getStripe();

    let event;
    try {
        if (process.env.STRIPE_WEBHOOK_SECRET) {
            event = stripe.webhooks.constructEvent(rawBody, request.headers.get("stripe-signature") || "", process.env.STRIPE_WEBHOOK_SECRET);
        } else {
            event = JSON.parse(rawBody);
        }
    } catch {
        return NextResponse.json({message: "Invalid payload"}, {status: 400});
    }

    if (!HANDLED_EVENTS.has(event?.type)) {
        return NextResponse.json({received: true});
    }

    const sessionId = event?.data?.object?.id;
    if (typeof sessionId !== "string" || !sessionId.startsWith("cs_")) {
        return NextResponse.json({message: "Missing session"}, {status: 400});
    }

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        const result = await fulfillCheckoutSession(session);
        return NextResponse.json({received: true, result: result.status});
    } catch (error) {
        console.error("[webhook]", error.message);
        // 500 → Stripe ponowi próbę
        return NextResponse.json({message: "Webhook processing failed"}, {status: 500});
    }
}

import {NextResponse} from "next/server";
import { buffer } from 'micro';
import Stripe from 'stripe';




export async function POST(req, res) {
    const sig = req.headers['stripe-signature'];
    let event;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const body = await req.json();


    try {
        // Odczytanie bufora w sposób kompatybilny z Next.js
        // const buf = await buffer(req);
        // const rawBody = buf.toString(); // Konwertuj na string dla Stripe
        // event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
        return NextResponse.json({ status: 200, message: "Webhook received", body: body});
    } catch (err) {
        // console.error(`Error verifying webhook: ${err.message}`);
        // return NextResponse.json({ status: 'error', message: `Webhook Error: ${err.message}` });
        return NextResponse.json({ status: 400, message: "Webhook not received", error: err.message});

    }

    // Logowanie poprawnie zbudowanego zdarzenia
    // console.log('Webhook event:', event);
    //
    // if (event.type === 'checkout.session.completed') {
    //     const session = event.data.object;
    //
    //     const sessionId = session.id;
    //     const clientReferenceId = session.client_reference_id;
    //
    //     console.log(`Płatność zakończona: ${sessionId}`);
    //     console.log(`Client Reference ID: ${clientReferenceId}`);
    //
    //     try {
    //         const updateOrder = await fetch(`https://galeria-mentis.vercel.app/api/updateOrder`, {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify({ orderId: clientReferenceId, orderStatus: "paid" }),
    //         });
    //
    //         const sanityData = await updateOrder.json();
    //         if (sanityData.status === "ok") {
    //             return NextResponse.json({ status: 200, message: "Order status updated" });
    //         } else {
    //             return NextResponse.json({ status: 500, message: "Order status not updated" });
    //         }
    //     } catch (updateError) {
    //         console.error("Error updating order:", updateError);
    //         return NextResponse.json({ status: 500, message: "Order status not updated" });
    //     }
    // }

}
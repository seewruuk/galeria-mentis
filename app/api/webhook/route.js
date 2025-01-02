import {NextResponse} from "next/server";
import { buffer } from 'micro';
import Stripe from 'stripe';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(req, res) {

    const sig = req.headers['stripe-signature'];
    let event;

    try {
        const buf = await buffer(req);
        event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return NextResponse.json({status: 'error', message: `Webhook Error: ${err.message}`});
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        // Identyfikacja płatności
        const sessionId = session.id; // Unikalny ID sesji Stripe
        const clientReferenceId = session.client_reference_id; // Twój własny identyfikator zamówienia

        console.log(`Płatność zakończona: ${sessionId}`);
        console.log(`Client Reference ID: ${clientReferenceId}`);


        const updateOrder = await fetch(`https://galeria-mentis.vercel.app/api/updateOrder`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({orderId : clientReferenceId, orderStatus: "paid"})
        });

        const sanityData = await updateOrder.json();
        if (sanityData.status === "ok") {
           return NextResponse.json({status: 200, message: "Sanity order status updated"});
        } else {
            return NextResponse.json({status: 500, message: "Sanity order status not updated"});
        }

    }

    return NextResponse.json({status: 'ok'});
}

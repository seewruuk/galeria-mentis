import {NextResponse} from "next/server";
import { buffer } from 'micro';
import Stripe from 'stripe';


export async function POST(req, res) {
    const body = await req.json();
    const {data} = await body;

    try {

        const orderId = data.object.client_reference_id
        const payment_status = data.object.payment_status
        const stripeSessionId = data.object.id;


        const checkPaymentStatusRequest = await fetch(`https://galeria-mentis.vercel.app/api/checkPaymentStatus`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({sessionId: stripeSessionId}),
        })


        const checkPaymentStatus = await checkPaymentStatusRequest.json();
        if(checkPaymentStatus.payment_status !== "paid"){
            return NextResponse.json({status: 500, message: "Payment status not checked"});
        }

        const updateOrder = await fetch(`https://galeria-mentis.vercel.app/api/updateOrder`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({orderId: orderId, orderStatus: "paid"}),
        });

        const sanityData = await updateOrder.json();
        if (sanityData.status === "ok") {
            return NextResponse.json({status: 200, message: "Order status updated"});
        } else {
            return NextResponse.json({status: 500, message: "Order status not updated"});
        }

    } catch (err) {

        return NextResponse.json({ status: 400, message: "Webhook not received", error: err.message});

    }
}
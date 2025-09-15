// /app/api/webhook/route.js
import {NextResponse} from "next/server";
import {buffer} from 'micro';
import Stripe from 'stripe';
import {getOrder} from "@/sanity/getSanity/getOrder";
import {sendEmailToCustomer} from "@/utils/emailService";
import {decreaseQty} from "@/utils/decreaseQty";

export async function POST(req) {
    const body = await req.json();
    const { data } = await body;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.toString();

    try {
        const orderId = data?.object?.client_reference_id;
        // const stripeSessionId = data?.object?.id;
        //
        // if (!orderId || !stripeSessionId) {
        //     return NextResponse.json({ status: 400, message: "Missing orderId or sessionId" });
        // }

        // const checkPaymentStatusRequest = await fetch(`${baseUrl}/api/checkPaymentStatus`, {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({ sessionId: stripeSessionId }),
        // });
        //
        // const checkPaymentStatus = await checkPaymentStatusRequest.json();
        // if (checkPaymentStatus.payment_status !== "paid") {
        //     return NextResponse.json({ status: 500, message: "Payment status not checked" });
        // }

        // const updateOrder = await fetch(`${baseUrl}/api/updateOrder`, {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({ orderId, orderStatus: "paid" }),
        // });

        // const sanityData = await updateOrder.json();
        // if (sanityData.status === "ok") {
            const orderInfo = await getOrder(orderId);
            if (!orderInfo) {
                return NextResponse.json({ status: 500, message: "Order not found" });
            }

            // Ustawienie ilości na 0 dla wszystkich produktów z zamówienia
            // const decreaseQtyResult = await decreaseQty(orderInfo);

            const updateProductQty = await fetch(`${baseUrl}/api/updateProductQty`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderInfo),
            });
            const x = await updateProductQty.json();

            // (opcjonalnie) wysyłka maila
            // const emailResponse = await sendEmailToCustomer(orderInfo);
            // if (emailResponse.status !== 200) {
            //     return NextResponse.json({ status: 500, message: "Error sending email" });
            // }

            return NextResponse.json(updateProductQty);
        // } else {
        //     return NextResponse.json({ status: 500, message: "Order status not updated" });
        // }
    } catch (err) {
        return NextResponse.json({ status: 400, message: "Webhook not received", error: err?.message });
    }
}

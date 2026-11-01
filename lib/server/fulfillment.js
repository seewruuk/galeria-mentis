import "server-only";
import groq from "groq";
import {fetchFresh, writeClient} from "@/lib/server/sanity";
import {getOrder} from "@/sanity/getSanity/getOrder";
import {sendEmailToCustomer} from "@/utils/emailService";

/** Zmniejsza stany magazynowe zamówionych prac (nie schodzi poniżej 0). */
async function decreaseStock(order) {
    const wanted = new Map();
    for (const item of order.products || []) {
        const qty = Number(item?.qty) || 0;
        if (item?.id && qty > 0) wanted.set(item.id, (wanted.get(item.id) || 0) + qty);
    }
    if (wanted.size === 0) return;

    const current = await fetchFresh(groq`*[_type == "product" && _id in $ids]{_id, _rev, quantity}`, {ids: [...wanted.keys()]});
    const tx = writeClient.transaction();
    let changes = 0;
    for (const doc of current || []) {
        const next = Math.max(0, (Number(doc.quantity) || 0) - wanted.get(doc._id));
        if (next !== Number(doc.quantity)) {
            tx.patch(doc._id, (p) => p.set({quantity: next}));
            changes++;
        }
    }
    if (changes) await tx.commit();
}

/**
 * Oznacza zamówienie jako opłacone na podstawie sesji Stripe pobranej z API Stripe (dane zaufane).
 * Idempotentne: ponowne wywołanie dla opłaconego zamówienia nic nie robi.
 */
export async function fulfillCheckoutSession(session) {
    if (!session || session.payment_status !== "paid") return {status: "not_paid"};

    const orderNumber = session.client_reference_id || session.metadata?.orderNumber;
    if (!orderNumber) return {status: "no_reference"};

    const order = await getOrder(orderNumber);
    if (!order?._id) return {status: "order_not_found"};

    if (order.stripeSessionId && order.stripeSessionId !== session.id) return {status: "session_mismatch"};

    const expectedAmount = Math.round(Number(order.totalPrice) * 100);
    if (!Number.isFinite(expectedAmount) || session.amount_total !== expectedAmount || (session.currency && session.currency !== "gbp")) {
        console.error("[webhook] Kwota sesji nie zgadza się z zamówieniem", order._id);
        return {status: "amount_mismatch"};
    }

    if (order.orderStatus !== "new") return {status: "already_processed"};

    try {
        // ifRevisionId – jeśli dwa webhooki przyjdą równocześnie, tylko jeden przejdzie dalej
        await writeClient.patch(order._id).ifRevisionId(order._rev).set({orderStatus: "paid", amountTotal: session.amount_total}).commit();
    } catch (error) {
        if (error?.statusCode === 409) return {status: "already_processed"};
        throw error;
    }

    const paidOrder = {...order, orderStatus: "paid"};

    try {
        await decreaseStock(paidOrder);
    } catch (error) {
        console.error("[webhook] Błąd aktualizacji stanów:", error.message);
    }

    try {
        const email = await sendEmailToCustomer(paidOrder);
        if (email.status !== 200) console.error("[webhook] Nie wysłano maila do klienta", order._id);
    } catch (error) {
        console.error("[webhook] Błąd wysyłki maila:", error.message);
    }

    return {status: "paid"};
}

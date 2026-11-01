import "server-only";
import {writeClient} from "@/lib/server/sanity";
import {getOrder} from "@/sanity/getSanity/getOrder";

export const ORDER_STATUSES = ["new", "paid", "done", "cancelled"];

/** Zmiana statusu istniejącego zamówienia (szuka też ukrytego ID private.order.*). */
export async function setOrderStatus(orderId, orderStatus) {
    if (!ORDER_STATUSES.includes(orderStatus)) throw new Error("Invalid status");
    const order = await getOrder(orderId);
    if (!order?._id) return null;
    return writeClient.patch(order._id).set({orderStatus}).commit();
}

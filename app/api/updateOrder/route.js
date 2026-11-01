import {NextResponse} from "next/server";
import {requireAdmin} from "@/lib/server/adminGuard";
import {readJson} from "@/lib/server/http";
import {ORDER_STATUSES, setOrderStatus} from "@/lib/server/orders";

export const dynamic = "force-dynamic";

// Zmiana statusu zamówienia – tylko administrator
export async function POST(request) {
    const {response} = await requireAdmin(request, {mutating: true});
    if (response) return response;

    const body = await readJson(request);
    const orderId = typeof body?.orderId === "string" ? body.orderId : "";
    const orderStatus = body?.orderStatus;

    if (!orderId || !ORDER_STATUSES.includes(orderStatus)) {
        return NextResponse.json({status: "error", message: "Invalid data"}, {status: 400});
    }

    try {
        const result = await setOrderStatus(orderId, orderStatus);
        if (!result) return NextResponse.json({status: "error", message: "Order not found"}, {status: 404});
        return NextResponse.json({status: "ok", message: "Order updated"});
    } catch (err) {
        console.error("[updateOrder]", err.message);
        return NextResponse.json({status: "error", message: "Order not updated"}, {status: 500});
    }
}

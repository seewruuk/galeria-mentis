import {NextResponse} from "next/server";
import {sendEmailToCustomer} from "@/utils/emailService";
import {getOrder} from "@/sanity/getSanity/getOrder";
import {requireAdmin} from "@/lib/server/adminGuard";
import {readJson} from "@/lib/server/http";

export const dynamic = "force-dynamic";

// Ponowna wysyłka potwierdzenia zamówienia – tylko administrator.
// Treść maila budujemy z danych zamówienia w Sanity, nie z danych przesłanych przez przeglądarkę.
export async function POST(request) {
    const {response} = await requireAdmin(request, {mutating: true});
    if (response) return response;

    try {
        const body = await readJson(request);
        const orderId = body?.orderId || body?.order?._id || body?.order?.orderNumber;
        const order = typeof orderId === "string" ? await getOrder(orderId) : null;

        if (!order) {
            return NextResponse.json({status: 404, message: "Order not found"});
        }

        const emailResponse = await sendEmailToCustomer(order);

        if (emailResponse.status !== 200) {
            return NextResponse.json({status: 500, message: "Error sending email"});
        }

        return NextResponse.json({status: 200, message: "Email sent successfully"});
    } catch (error) {
        console.error("[sendEmailToCustomer]", error.message);
        return NextResponse.json({status: 500, message: "Error sending email"});
    }
}

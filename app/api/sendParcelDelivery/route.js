import {NextResponse} from "next/server";
import {sendParcelDeliveryEmail} from "@/utils/emailService";
import {getOrder} from "@/sanity/getSanity/getOrder";
import {requireAdmin} from "@/lib/server/adminGuard";
import {readJson} from "@/lib/server/http";
import {writeClient} from "@/lib/server/sanity";

export const dynamic = "force-dynamic";

const str = (value, max = 200) => (typeof value === "string" ? value.trim().slice(0, max) : "");

// Zapis danych wysyłki + e-mail do klienta – tylko administrator
export async function POST(request) {
    const {response} = await requireAdmin(request, {mutating: true});
    if (response) return response;

    const body = await readJson(request);
    const orderId = str(body?.orderId);
    const carrier = str(body?.carrier);
    const trackingNumber = str(body?.trackingNumber);
    const shipmentDate = str(body?.shipmentDate, 40);

    if (!orderId || !carrier || !shipmentDate) {
        return NextResponse.json({
            status: 400,
            message: "Missing required fields: orderId, carrier, and shipmentDate are required"
        });
    }

    try {
        const existing = await getOrder(orderId);
        if (!existing?._id) {
            return NextResponse.json({status: 404, message: "Order not found"});
        }

        await writeClient.patch(existing._id).set({
            parcelDelivery: {
                carrier,
                trackingNumber,
                shipmentDate,
                parcelDeliverySentAt: new Date().toISOString(),
            },
        }).commit();

        const order = await getOrder(existing._id);

        const emailResult = await sendParcelDeliveryEmail(order, {carrier, trackingNumber, shipmentDate});

        if (emailResult.status !== 200) {
            return NextResponse.json({
                status: 500,
                message: "Parcel delivery data saved but email failed to send",
            });
        }

        return NextResponse.json({
            status: 200,
            message: "Parcel delivery data saved and email sent successfully",
        });

    } catch (err) {
        console.error("[sendParcelDelivery]", err.message);
        return NextResponse.json({status: 500, message: "Error processing parcel delivery"});
    }
}

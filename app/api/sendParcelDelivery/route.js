import {NextResponse} from "next/server";
import {sendParcelDeliveryEmail} from "@/utils/emailService";
import {getOrder} from "@/sanity/getSanity/getOrder";

export async function POST(req, res) {
    const body = await req.json();
    const {orderId, carrier, trackingNumber, shipmentDate} = body;

    if (!orderId || !carrier || !shipmentDate) {
        return NextResponse.json({
            status: 400,
            message: "Missing required fields: orderId, carrier, and shipmentDate are required"
        });
    }

    const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID.toString();
    const sanityDataSet = process.env.NEXT_PUBLIC_SANITY_DATASET.toString();
    const sanityApiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION.toString();
    const token = process.env.NEXT_PUBLIC_SANITY_API_TOKEN.toString();

    const url = `https://${sanityProjectId}.api.sanity.io/v${sanityApiVersion}/data/mutate/${sanityDataSet}`;

    try {
        // Get current date and time for sentAt
        const sentAt = new Date().toISOString();
        
        // Save parcel delivery data to order
        const mutations = [{
            patch: {
                id: orderId,
                set: {
                    "parcelDelivery": {
                        carrier: carrier,
                        trackingNumber: trackingNumber || "",
                        shipmentDate: shipmentDate,
                        parcelDeliverySentAt: sentAt,
                    }
                }
            }
        }];

        const sanityResponse = await fetch(url, {
            method: 'post',
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({mutations})
        });

        const result = await sanityResponse.json();

        if (!sanityResponse.ok) {
            return NextResponse.json({
                status: 500,
                message: "Error saving parcel delivery data",
                data: result
            });
        }

        // Get full order data to send email
        const order = await getOrder(orderId);
        
        if (!order) {
            return NextResponse.json({
                status: 404,
                message: "Order not found"
            });
        }

        // Send email
        const emailResult = await sendParcelDeliveryEmail(order, {
            carrier,
            trackingNumber,
            shipmentDate,
        });

        if (emailResult.status !== 200) {
            return NextResponse.json({
                status: 500,
                message: "Parcel delivery data saved but email failed to send",
                emailError: emailResult
            });
        }

        return NextResponse.json({
            status: 200,
            message: "Parcel delivery data saved and email sent successfully",
            data: result
        });

    } catch (err) {
        console.error(err);
        return NextResponse.json({
            status: 500,
            message: "Error processing parcel delivery",
            error: err.message
        });
    }
}


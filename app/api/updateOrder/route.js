import {NextResponse} from "next/server";

export async function POST(req, res) {

    const body = await req.json();
    const {orderId, orderStatus} = await body;

    const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID.toString();
    const sanityDataSet = process.env.NEXT_PUBLIC_SANITY_DATASET.toString();
    const sanityApiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION.toString();
    const token = process.env.NEXT_PUBLIC_SANITY_API_TOKEN.toString();

    const url = `https://${sanityProjectId}.api.sanity.io/v${sanityApiVersion}/data/mutate/${sanityDataSet}`;

    try {
        const mutations = [{
            patch: {
                id: orderId,
                set: {
                    "orderStatus": orderStatus
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

        return NextResponse.json({
            status: "ok",
            message: "Order updated",
            data: result
        });

    } catch (err) {
        console.error(err);
        return NextResponse.json({status: "error", message: "Order not updated"});
    }
}

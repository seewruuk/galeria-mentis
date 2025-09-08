import { NextResponse } from "next/server";

export async function POST(req) {
    // Bezpieczne parsowanie body
    let orderInfo;
    try {
        const raw = await req.text();
        if (!raw?.trim()) {
            return NextResponse.json({ status: "error", message: "Empty body" });
        }
        const parsed = JSON.parse(raw);
        orderInfo = parsed?.orderInfo;
    } catch {
        return NextResponse.json({ status: "error", message: "Invalid JSON" });
    }

    if (!orderInfo?.products || !Array.isArray(orderInfo.products)) {
        return NextResponse.json({
            status: "error",
            message: "Missing products array in orderInfo",
        });
    }

    const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.toString();
    const sanityDataSet = process.env.NEXT_PUBLIC_SANITY_DATASET?.toString();
    const sanityApiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION?.toString();
    const token = process.env.NEXT_PUBLIC_SANITY_API_TOKEN?.toString();

    if (!sanityProjectId || !sanityDataSet || !sanityApiVersion || !token) {
        return NextResponse.json({
            status: "error",
            message:
                "Missing Sanity env variables (PROJECT_ID, DATASET, API_VERSION, API_TOKEN).",
        });
    }

    const url = `https://${sanityProjectId}.api.sanity.io/v${sanityApiVersion}/data/mutate/${sanityDataSet}`;

    try {
        // Zbieramy unikalne _id produktów z zamówienia
        const uniqueIds = [
            ...new Set(
                orderInfo.products
                    .map((p) => p?.id)
                    .filter((id) => typeof id === "string" && id.trim().length > 0)
            ),
        ];

        if (uniqueIds.length === 0) {
            return NextResponse.json({
                status: "ok",
                message: "No valid product ids to update",
                updated: 0,
            });
        }

        // Mutations w wymaganym formacie: patch → set → quantity: 0
        const mutations = uniqueIds.map((id) => ({
            patch: {
                id: id,
                set: { quantity: 0 },
            },
        }));

        // const response = await fetch(url, {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //         Authorization: `Bearer ${token}`,
        //     },
        //     body: JSON.stringify({ mutations }),
        // });
        //
        // // Odczyt wyniku bez ryzyka "Unexpected end of JSON input"
        // const text = await response.text();
        // let data = {};
        // try {
        //     if (text?.trim()) data = JSON.parse(text);
        // } catch {
        //     // jeśli Sanity zwróci coś nie-JSON, przekażemy surowy tekst
        //     data = { raw: text };
        // }
        //
        // const updated = Array.isArray(data?.results) ? data.results.length : 0;

        return NextResponse.json({
            smutations
        });
    } catch (err) {
        return NextResponse.json({
            status: "error",
            message: "Order not updated",
            error: err?.message || "Unknown",
        });
    }
}

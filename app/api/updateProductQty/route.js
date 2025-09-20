
import { NextResponse } from "next/server";
export async function POST(req) {
    const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.toString();
    const sanityDataSet = process.env.NEXT_PUBLIC_SANITY_DATASET?.toString();
    const sanityApiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION?.toString();
    const token = process.env.NEXT_PUBLIC_SANITY_API_TOKEN?.toString();

    if (!sanityProjectId || !sanityDataSet || !sanityApiVersion || !token) {
        return NextResponse.json(
            {
                status: "error",
                message:
                    "Missing Sanity env vars: NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET / NEXT_PUBLIC_SANITY_API_VERSION / NEXT_PUBLIC_SANITY_API_TOKEN",
            },
            { status: 500 }
        );
    }

    try {
        const body = await req.json();
        const { products } = await body;

        if (!products) {
            return NextResponse.json(
                { status: "error", message: "Missing 'products' in request body" },
                { status: 400 }
            );
        }

        if (products.length === 0) {
            return NextResponse.json(
                {
                    status: "ok",
                    message: "No products to update (empty products array).",
                    updatedCount: 0,
                    updatedIds: [],
                },
                { status: 200 }
            );
        }

        const uniqueIds = [...new Set(products.map((p) => p?.id).filter(Boolean))];

        if (uniqueIds.length === 0) {
            return NextResponse.json(
                { status: "error", message: "No valid product IDs found to update." },
                { status: 400 }
            );
        }

        const mutations = products.map((item) => ({
            patch: {
                id: item.id,
                set: { quantity: 0 },
            },
        }));


        const url = `https://${sanityProjectId}.api.sanity.io/v${sanityApiVersion}/data/mutate/${sanityDataSet}`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({mutations}),
        });

        if (!response.ok) {
            const text = await response.text().catch(() => "");
            return NextResponse.json(
                {
                    status: "error",
                    message: "Sanity mutate request failed",
                    httpStatus: response.status,
                    details: text || "No details",
                },
                { status: 500 }
            );
        }

        const data = await response.json();

        return NextResponse.json({
            status: "ok",
            message: "Products quantity set to 0.",
            sanity: data,
        });
    } catch (err) {
        return NextResponse.json(
            {
                status: "error",
                message: "Failed to update product quantities",
                error: err?.message || "Unknown",
            },
            { status: 500 }
        );
    }
}

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
        const { products } = body || {};

        if (!products) {
            return NextResponse.json(
                { status: "error", message: "Missing 'products' in request body" },
                { status: 400 }
            );
        }

        if (!Array.isArray(products) || products.length === 0) {
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

        // 1) Zgrupuj po ID i zsumuj zamówione ilości
        const wantedById = new Map();
        for (const p of products) {
            const id = p?.id;
            if (!id) continue;
            const ordered =
                Number(p?.quantity ?? p?.qty ?? p?.count ?? 0);

            if (!Number.isFinite(ordered) || ordered <= 0) continue;
            wantedById.set(id, (wantedById.get(id) ?? 0) + ordered);
        }

        const ids = Array.from(wantedById.keys());
        if (ids.length === 0) {
            return NextResponse.json(
                { status: "error", message: "No valid product IDs / quantities to update." },
                { status: 400 }
            );
        }

        // 2) Pobierz aktualne stany quantity dla tych ID
        const query = `*[_type == "product" && _id in $ids]{_id, quantity}`;
        const queryUrl = `https://${sanityProjectId}.api.sanity.io/v${sanityApiVersion}/data/query/${sanityDataSet}`;

        const queryResp = await fetch(queryUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                query,
                params: { ids },
            }),
        });

        if (!queryResp.ok) {
            const text = await queryResp.text().catch(() => "");
            return NextResponse.json(
                {
                    status: "error",
                    message: "Sanity query request failed",
                    httpStatus: queryResp.status,
                    details: text || "No details",
                },
                { status: 500 }
            );
        }

        const queryData = await queryResp.json();
        const currentDocs = (queryData?.result ?? []).reduce((acc, doc) => {
            acc.set(doc._id, Number(doc.quantity ?? 0));
            return acc;
        }, new Map());

        // 3) Policz nowe ilości i zbuduj mutacje (clamp na 0)
        const mutations = [];
        const summary = [];

        for (const id of ids) {
            const currentQty = Number(currentDocs.get(id) ?? 0);
            const ordered = Number(wantedById.get(id) ?? 0);
            const newQty = Math.max(0, currentQty - ordered);

            // Jeśli nic się nie zmienia, pomiń
            if (!Number.isFinite(newQty) || newQty === currentQty) {
                summary.push({ id, currentQty, ordered, newQty, skipped: true });
                continue;
            }

            mutations.push({
                patch: {
                    id,
                    set: { quantity: newQty },
                },
            });

            summary.push({ id, currentQty, ordered, newQty, skipped: false });
        }

        if (mutations.length === 0) {
            return NextResponse.json(
                {
                    status: "ok",
                    message: "Nothing to update (quantities unchanged or invalid).",
                    updatedCount: 0,
                    updatedIds: [],
                    details: summary,
                },
                { status: 200 }
            );
        }

        // 4) Wyślij mutacje
        const mutateUrl = `https://${sanityProjectId}.api.sanity.io/v${sanityApiVersion}/data/mutate/${sanityDataSet}`;

        const response = await fetch(mutateUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ mutations }),
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
            message: "Products quantity decreased by ordered amounts.",
            updatedCount: mutations.length,
            updatedIds: mutations.map(m => m.patch.id),
            sanity: data,
            details: summary,
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

export async function decreaseQty(order) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.toString();

    const updateProductQty = await fetch(`${baseUrl}/api/updateProductQty`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
    });

    return await updateProductQty.json();
}

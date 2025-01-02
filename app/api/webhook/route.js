export async function POST(req, res) {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        const buf = await buffer(req);
        event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).json({ status: 'error', message: `Webhook Error: ${err.message}` });
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        const sessionId = session.id;
        const clientReferenceId = session.client_reference_id;

        console.log(`Płatność zakończona: ${sessionId}`);
        console.log(`Client Reference ID: ${clientReferenceId}`);

        try {
            const updateOrder = await fetch(`https://galeria-mentis.vercel.app/api/updateOrder`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ orderId: clientReferenceId, orderStatus: "paid" }),
            });

            const sanityData = await updateOrder.json();
            if (sanityData.status === "ok") {
                return res.status(200).json({ status: 200, message: "Sanity order status updated" });
            } else {
                return res.status(500).json({ status: 500, message: "Sanity order status not updated" });
            }
        } catch (updateError) {
            return res.status(500).json({ status: 'error', message: `Update Order Error: ${updateError.message}` });
        }
    }

    return res.status(200).json({ status: 'ok' });
}

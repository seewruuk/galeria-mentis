import {NextResponse} from "next/server";
import {Stripe} from "stripe";

export async function POST(req, res) {

    try {
        const body = await req.json();
        const {cartItems, orderNumber} = await body;
        const secretKey = process.env.STRIPE_SECRET_KEY.toString();
        const stripe = new Stripe(secretKey);
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL.toString();


        const transformedItems = cartItems.map(item => ({
            price_data: {
                currency: 'gbp',
                product_data: {
                    name: item.name,
                    // images: item.image,
                },

                unit_amount: item.price * 100, // Convert to cents
            },
            quantity: item.qty,
        }));


        const session = await stripe.checkout.sessions.create({
            client_reference_id: orderNumber,
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: transformedItems,
            success_url: `${baseUrl}/success?orderId=${orderNumber}`,
            cancel_url: `${baseUrl}/cancel?orderId=${orderNumber}`,
        });
        return NextResponse.json({status: 200, url: session.url, sessionId: session.id, session: session});
    } catch (e) {
        return NextResponse.json({status: 500, error: e.message});
    }

}
import {NextResponse} from "next/server";
import {Stripe} from "stripe";

export async function POST(req, res) {

    try{
        const body = await req.json();
        const {sessionId} = await body;
        const secretKey = process.env.STRIPE_SECRET_KEY.toString();
        const stripe = new Stripe(secretKey);


        if(!sessionId){
            return NextResponse.json({status: 400, error: "Session ID is required"});
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId);

        return NextResponse.json({status: 200, payment_status: session.payment_status});


    }catch (e){
        return NextResponse.json({status: 500, error: e.message});
    }

}
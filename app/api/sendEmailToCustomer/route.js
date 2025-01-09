import {NextResponse} from "next/server";
import {sendEmailToCustomer} from "@/utils/emailService";


export async function POST(req) {
    try {
        const body = await req.json();
        const order = body.order;

        const emailResponse = await sendEmailToCustomer(order);

        if (emailResponse.status !== 200) {
            return NextResponse.json({
                status: 500,
                message: "Error sending email",
                error: emailResponse,
            });
        }

        return NextResponse.json({
            status: 200,
            message: "Email sent successfully",
        });


    }
    catch (error) {
        return NextResponse.json({
            status: 500,
            message: "Error sending email",
            error: error.message,
        });
    }
}









import { NextResponse } from "next/server";

export async function POST(req, res) {
    const body = await req.json(); // poprawne pobranie body

    const url = "https://api.getresponse.com/v3/contacts";

    let data = JSON.stringify({
        "campaign": {
            "campaignId": "XKpP3"
        },
        "email": body.dataToSend.email // użycie email z przesłanego body
    });

    try {
        const newsletterResponse = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${body.dataToSend.token}`, // użycie token z przesłanego body
                'Content-Type': 'application/json',
            },
            body: data, // poprawne użycie body zamiast data
        });

        if(newsletterResponse.status === 202){
            return NextResponse.json({
                status: "success",
                message: "Dodano do newslettera"
            });
        }else{
            return NextResponse.json({
                status: "error",
                message: "Wystąpił błąd podczas dodawania do newslettera",
                error: newsletterResponse
            });
        }
    } catch (error) {
        return NextResponse.json({
            status: "error",
            message: "Wystąpił błąd podczas dodawania do newslettera",
            error: error.message // zwrócenie wiadomości błędu
        });
    }
}

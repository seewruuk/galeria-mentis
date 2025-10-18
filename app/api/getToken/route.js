import {NextResponse} from "next/server";



export async function POST(req, res) {


    const apiUrl = 'https://api.getresponse.com/v3/token';
    const credentials = "5f33e827-ac5b-11f0-8acb-00163e45cec4:77959697040f09915ed65266bc65d5baa5c10f4e";
    const base64Credentials = Buffer.from(credentials).toString('base64');

    try {

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${base64Credentials}`,
            },
            body: 'grant_type=client_credentials',
        });
        const data = await response.json();
        if (!data.access_token) {
            return NextResponse.json({status: "error", message: "Błąd podczas uzyskiwania tokenu"});

        }
        return NextResponse.json({status: "ok", data: data});

    }catch (error){
        // console.log(error)
        return NextResponse.json({status: "error", message: error});
    }

}
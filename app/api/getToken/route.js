import {NextResponse} from "next/server";



export async function POST(req, res) {


    const apiUrl = 'https://api.getresponse.com/v3/token';
    const credentials = "fec83ba1-600b-11f0-91bf-00163ec8ce26:98925a2a55dbfb206df6a378d6fc01217ca13ec2";
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
import {NextResponse} from "next/server";


export async function POST(req, res) {

    const body = await req.json();
    const {item} = await body;

    const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID.toString();
    const sanityDataSet = process.env.NEXT_PUBLIC_SANITY_DATASET.toString();
    const sanityApiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION.toString();

    const url = `https://` + sanityProjectId + `.api.sanity.io/v${sanityApiVersion}/data/mutate/` + sanityDataSet;

    try {
        const mutations = [{
            create: {
                _type: "user",
                userInfo: {
                    name: item.name,
                    lastname: item.lastname,
                    email: item.email,
                    hashPassword: item.hashPassword,
                },
                role: "user",
                sessionToken: item.sessionToken,
            }
        }]

        const response = await fetch(url, {
            method: "post",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_SANITY_API_TOKEN.toString()}`
            },
            body: JSON.stringify({mutations})
        })

        return NextResponse.json({status: "ok", message: "Konto zostało utworzone"});
    } catch (e) {
        return NextResponse.json({status: "error", message: "Wystąpił błąd podczas tworzenia konta"});
    }

}
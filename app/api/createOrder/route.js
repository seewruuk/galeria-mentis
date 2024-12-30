
import {NextResponse} from "next/server";
import { v4 as uuidv4 } from 'uuid';

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
                _id: item.orderNumber,
                _type: "order",
                orderStatus: "new",
                orderDate: item.fullDate,
                orderNumber: item.orderNumber,
                personData: {

                    email: item.form[0].value,
                    name: item.form[1].value,
                    lastname: item.form[2].value,
                    address: item.form[3].value,
                    apartment: item.form[4].value,
                    city: item.form[5].value,
                    country: item.form[6].value,
                    state: item.form[7].value,
                    postal: item.form[8].value,
                    phone: item.form[9].value,


                },
                orderInfo: {
                    deliveryMethod: item.deliveryMethod,
                },

                totalPrice: item.totalPrice,
                products: item.products.map((item, index) => {
                        return {
                            _key: uuidv4(),
                            name: item.name,
                            slug: item.slug,
                            price: item.price,
                            qty: item.qty,
                            category: item.category.title,
                            tax: item.tax,
                        }
                    }
                ),
                // invoice: item.invoice,
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

        return NextResponse.json({status: 200, message: "Success! Your order has been placed."});
    } catch (e) {
        return NextResponse.json({status: 500, message: "There was an error processing your order. Please try again later."});
    }

}
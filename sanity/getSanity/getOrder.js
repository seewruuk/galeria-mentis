import groq from "groq";
import {client} from "../lib/client";

export async function getOrder(id) {
    return client.fetch(
        groq`*[_type == "order" && _id == "${id}"]{
            _id,
            orderDate,
            orderNumber,
            personData,
            orderInfo,
            products[]{
                name,
                price,
                qty,
                category,
                slug,                
            },
            totalPrice,
            orderStatus,
            invoice,
        }[0]`
    )
}

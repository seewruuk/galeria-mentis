import groq from "groq";
import {client} from "../lib/client";

export async function getOrder(id) {
    return client.fetch(
        groq`*[_type == "order" && _id == "${id}"]{
            _id,
            orderDate,
            orderStatus,
            orderNumber,
            personData,
            orderInfo,
            products[]{
                name,
                author,
                authorSlug,
                slug,
                price,
                qty,
                category,             
            },
            invoice,
            totalPrice,
        }[0]`
    )
}

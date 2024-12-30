import groq from "groq";
import {client} from "../lib/client";

export async function getOrders() {
    const orders = await client.fetch(
        groq`*[_type == "order"]{
            _createdAt,
            _id,
            orderDate,
            orderNumber,
            personData,
            orderInfo,
            products[]{
                name,
                price,
                qty,
                tax,
                sku,
                category,
                quantity,
            },
            totalPrice,
            orderStatus,
            invoice,
        } | order(_createdAt desc)`
    );

    return {orders};
}
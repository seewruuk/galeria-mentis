import groq from "groq";
import "server-only";
import {fetchFresh} from "@/lib/server/sanity";

export async function getOrders() {
    const orders = await fetchFresh(
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
            parcelDelivery,
        } | order(_createdAt desc)`
    );

    return {orders};
}
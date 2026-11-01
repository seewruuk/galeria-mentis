import groq from "groq";
import {privateId} from "@/sanity/privateIds";
import "server-only";
import {fetchFresh} from "@/lib/server/sanity";

export async function getOrder(id) {
    if (typeof id !== "string" || !id || id.length > 100) return null;
    // Zamówienie może mieć stare (publiczne) albo nowe ukryte ID – preferujemy "private."
    return fetchFresh(
        groq`*[_type == "order" && (_id in [$id, $privateId] || orderNumber == $id)] | order(length(_id) desc){
            _id,
            _rev,
            orderDate,
            orderStatus,
            orderNumber,
            personData,
            orderInfo,
            products[]{
                name,
                id,
                author,
                authorSlug,
                slug,
                price,
                qty,
                category,             
            },
            invoice,
            totalPrice,
            parcelDelivery,
            stripeSessionId,
            newsletter,
        }[0]`,
        {id, privateId: privateId("order", id)}
    )
}

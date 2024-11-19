import groq from "groq";
import {client} from "../lib/client";


export async function getProductCategories() {
    return client.fetch(
        groq`*[_type == "productCategory"]{
        title,
        "slug": slug.current,
        description,
        }`
    )
}
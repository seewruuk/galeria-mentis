import groq from "groq";
import {client} from "../lib/client";


export async function getProduct(slug) {
    return client.fetch(
        groq`*[_type == "product" && slug.current == $slug]{
        _id,
        name,
        "slug": slug.current,
        "images": images[].asset->url,
        artist->{
            name,
            "slug": slug.current,
        },
        price,
        productCategory->{
            title,
            "slug": slug.current,
        },
        
        }[0]`
        , {slug}
    )
}
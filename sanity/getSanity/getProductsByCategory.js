import groq from "groq";
import {client} from "../lib/client";

export async function getProductsByCategory(slug) {
    return client.fetch(
        groq`*[_type == "product" && productCategory->slug.current == $slug]{
            _createdAt,
            name,
            slug,
            price,
            "images": images[].asset->url,
            "artistName": artist->name,
            "artistSlug": artist->slug.current,
            productCategory->{
                title,
                slug
            },
            options[]{
                optionType->{
                    name
                },
                value,
            }
            
        }`,
        { slug }
    );
}
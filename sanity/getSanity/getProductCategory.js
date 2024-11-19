import groq from "groq";
import {client} from "../lib/client";

export async function getProductCategory(slug) {
    return client.fetch(
        groq`*[_type == "productCategory" && slug.current == $slug]{
            title,
            "slug": slug.current,
            description,
            "image": image.asset->url,
            header,
            subText,
            seo,
        }[0]`,
        { slug }
    );
}

import groq from "groq";
import {client} from "../lib/client";


export async function getBlogSettings() {
    return client.fetch(
        groq`*[_type == "blogSettings"][0]{
        title,
        "image" : image.asset->url,
        header,
        seo,
        }`
    )
}
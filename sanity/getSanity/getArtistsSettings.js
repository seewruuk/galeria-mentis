import groq from "groq";
import {client} from "../lib/client";


export async function getArtistsSettings() {
    return client.fetch(
        groq`*[_type == "artistsSettings"][0]{
        title,
        "image" : image.asset->url,
        header,
        seo,
        }`
    )
}
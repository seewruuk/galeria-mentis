import groq from "groq";
import "server-only";
import {fetchPublic} from "@/lib/server/sanity";


export async function getArtistsSettings() {
    return fetchPublic(
        groq`*[_type == "artistsSettings"][0]{
        title,
        "image" : image.asset->url,
        header,
        seo{
          ...,
          "ogImage": ogImage.asset->url
        },
        }`
    )
}
import groq from "groq";
import "server-only";
import {fetchPublic} from "@/lib/server/sanity";


export async function getBlogSettings() {
    return fetchPublic(
        groq`*[_type == "blogSettings"][0]{
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
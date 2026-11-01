import groq from "groq";
import "server-only";
import {fetchPublic} from "@/lib/server/sanity";

export async function getPolicyByType(type) {
    return fetchPublic(
        groq`*[_type == "policies" && type == $type]{
           type,
           content,
           seo{
             ...,
             "ogImage": ogImage.asset->url
           }
        }[0]`,
        { type }
    );
}

import groq from "groq";
import {client} from "../lib/client";

export async function getPolicyByType(type) {
    return client.fetch(
        groq`*[_type == "policies" && type == $type]{
           type,
           content,
           seo{
             ...,
             "ogImage": seo.ogImage.asset->url
           }
        }[0]`,
        { type }
    );
}

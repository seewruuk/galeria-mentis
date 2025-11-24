import groq from "groq";
import {client} from "../lib/client";


export async function getSingleBlogPost(slug){
    return client.fetch(
        groq`*[_type == "blog" && slug.current == $slug]{
            _id,
            _createdAt,
            title,
            slug,
            "mainImage": mainImage.asset->url,
            description,
            body,
            seo{
              ...,
              "ogImage": seo.ogImage.asset->url
            },
        }[0]`,
        {slug}
    );

}

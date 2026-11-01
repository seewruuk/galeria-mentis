import groq from "groq";
import "server-only";
import {fetchPublic} from "@/lib/server/sanity";


export async function getSingleBlogPost(slug){
    return fetchPublic(
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
              "ogImage": ogImage.asset->url
            },
        }[0]`,
        {slug}
    );

}

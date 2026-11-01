
import groq from "groq";
import "server-only";
import {fetchPublic} from "@/lib/server/sanity";


export async function getBlogPosts(){
    return fetchPublic(
        groq`*[_type == "blog"]{
            _id,
            _createdAt,
            title,
            "slug": slug.current,
            description,
            "mainImage": mainImage.asset->url,
        }`
    );

}


import groq from "groq";
import {client} from "../lib/client";


export async function getBlogPosts(){
    return client.fetch(
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

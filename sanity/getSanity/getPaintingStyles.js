import groq from "groq";
import "server-only";
import {fetchPublic} from "@/lib/server/sanity";


export async function getPaintingStyles() {
    return fetchPublic(
        groq`*[_type == "paintingStyle"]{
        title,
        description,
       
        }`
    )
}
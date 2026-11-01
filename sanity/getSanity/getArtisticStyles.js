import groq from "groq";
import "server-only";
import {fetchPublic} from "@/lib/server/sanity";


export async function getArtisticStyles() {
    return fetchPublic(
        groq`*[_type == "artisticStyle"]{
        title,
        description,
       
        }`
    )
}
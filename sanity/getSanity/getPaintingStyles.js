import groq from "groq";
import {client} from "../lib/client";


export async function getPaintingStyles() {
    return client.fetch(
        groq`*[_type == "paintingStyle"]{
        title,
        description,
       
        }`
    )
}
import groq from "groq";
import {client} from "../lib/client";


export async function getArtisticStyles() {
    return client.fetch(
        groq`*[_type == "artisticStyle"]{
        title,
        description,
       
        }`
    )
}
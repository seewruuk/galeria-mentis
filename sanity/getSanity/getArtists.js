import groq from "groq";
import {client} from "../lib/client";


export async function getArtists() {
    return client.fetch(
        groq`*[_type == "artist"]{
        _id,
        _createdAt,
        "avatar": avatar.asset->url,
        name,
        "slug": slug.current,
        location,
        description,
        artisticStyle[]->{
        title,
        },
        paintingStyle[]->{ title },
        price
        }`

    )
}
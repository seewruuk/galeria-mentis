import groq from "groq";
import {client} from "../lib/client";


export async function getArtists() {
    return client.fetch(
        groq`*[_type == "artist"]{
        _createdAt,
        "avatar": avatar.asset->url,
        name,
        "slug": slug.current,
        location,
        description,
        artisticStyle[]->{
        title,
        },
        paintingStyle[]->{
        title,
        },
        artworks[]->{
        name,
        productCategory->{
            title
        },
        "slug": slug.current,
        "images": images[].asset->url,
        artist->{
            name,
            "slug": slug.current,
        },
        price,
        }
        }`
    )
}
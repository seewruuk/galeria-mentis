import groq from "groq";
import "server-only";
import {fetchPublic} from "@/lib/server/sanity";


export async function getArtists() {
    return fetchPublic(
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
        price,
        "artworks": *[_type == "product" && artist._ref == ^._id][0...3]{
            _id,
            name,
            "slug": slug.current,
            "thumbnail": thumbnail.asset->url,
            "images": images[].asset->url,
            artist->{
                name,
                "slug": slug.current,
            },
            productCategory->{
                title,
                "slug": slug.current,
            },
            price,
        },
        }`

    )
}
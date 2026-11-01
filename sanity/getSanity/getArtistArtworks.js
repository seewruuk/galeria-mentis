import groq from "groq";
import "server-only";
import {fetchPublic} from "@/lib/server/sanity";

export async function getArtistArtworks(id, prodId) {
    return fetchPublic(
        groq`*[_type == "product" && artist._ref == $id && _id != $prodId]{
            _id,
            _createdAt,
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
            
        }`,
        {id, prodId}
    );
}
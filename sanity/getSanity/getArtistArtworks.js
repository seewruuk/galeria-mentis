import groq from "groq";
import {client} from "../lib/client";

export async function getArtistArtworks(id, prodId) {
    return client.fetch(
        groq`*[_type == "product" && artist._ref == $id && _id != $prodId]{
            _id,
            name,
            "slug": slug.current,
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
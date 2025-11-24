import groq from "groq";
import {client} from "../lib/client";

export async function getArtist(slug) {
    return client.fetch(
        groq`*[_type == "artist" && slug.current == $slug]{
            _id,
            name,
            "slug": slug.current,
            "avatar": avatar.asset->url,
             location,
            description,
            "bannerImage": bannerImage.asset->url,
            bio,
            seo{
              ...,
              "ogImage": seo.ogImage.asset->url
            },
            
        }[0]`,
        {slug}
    );
}
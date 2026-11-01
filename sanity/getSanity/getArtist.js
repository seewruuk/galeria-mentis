import groq from "groq";
import "server-only";
import {fetchPublic} from "@/lib/server/sanity";

export async function getArtist(slug) {
    return fetchPublic(
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
              "ogImage": ogImage.asset->url
            },
            
        }[0]`,
        {slug}
    );
}
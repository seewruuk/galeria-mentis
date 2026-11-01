import groq from "groq";
import "server-only";
import {fetchPublic} from "@/lib/server/sanity";

export async function getProductCategory(slug) {
    return fetchPublic(
        groq`*[_type == "productCategory" && slug.current == $slug]{
            title,
            "slug": slug.current,
            description,
            "image": image.asset->url,
            header,
            subText,
            seo{
              ...,
              "ogImage": ogImage.asset->url
            },
        }[0]`,
        { slug }
    );
}

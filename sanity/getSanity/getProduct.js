import groq from "groq";
import "server-only";
import {fetchPublic} from "@/lib/server/sanity";


export async function getProduct(slug) {
    try {
        const result = await fetchPublic(
            groq`*[_type == "product" && slug.current == $slug]{
            _id,
            name,
            quantity,
            "slug": slug.current,
            "thumbnail": thumbnail.asset->url,
            "images": images[].asset->url,
            artist->{
                name,
                "slug": slug.current,
                "id": _id
            },
            price,
            labels,
            imageAspectRatio,
            productCategory->{ 
                title,
                "slug": slug.current,
            },
            additionalInfo,
            details[]{
            "productDetailsName": productDetails->name,
            content
          },
            seo{
              ...,
              "ogImage": ogImage.asset->url
            }
            }[0]`
            , {slug}
        );
        // Zwracamy null zamiast undefined jeśli produkt nie został znaleziony
        return result || null;
    } catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
}
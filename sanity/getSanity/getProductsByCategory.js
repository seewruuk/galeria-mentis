import groq from "groq";
import {client} from "../lib/client";

export async function getProductsByCategory(slug) {
    return client.fetch(groq`*[_type == "product" ${slug === "all" ? "" : "&& productCategory->slug.current == $slug"} && quantity > 0]{
      _id,
      _createdAt,
      _updatedAt,
      name,
      quantity,
      slug,
      price,
      "thumbnail": thumbnail.asset->url,
      "images": images[].asset->url,
      "artistName": artist->name,
      "artistSlug": artist->slug.current,
      productCategory->{
        title,
        slug
      },
      details[]{
        "productDetailsName": productDetails->name,
        content
      }
    }`, {slug});
}

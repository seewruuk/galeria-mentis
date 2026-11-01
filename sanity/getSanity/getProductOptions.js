import groq from "groq";
import "server-only";
import {fetchPublic} from "@/lib/server/sanity";

export async function getProductOptions() {
    return fetchPublic(
        groq`
      *[_type == "product-details" && showOnWebsite == true]{
        _id,
        name,
        "options": options[]{ value }
      }
    `
    );
}

import groq from "groq";
import { client } from "../lib/client";

export async function getProductOptions() {
    return client.fetch(
        groq`
      *[_type == "product-details" && showOnWebsite == true]{
        _id,
        name,
        "options": options[]{ value }
      }
    `
    );
}

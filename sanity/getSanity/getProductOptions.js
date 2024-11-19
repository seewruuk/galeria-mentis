import groq from "groq";
import {client} from "../lib/client";

export async function getProductOptions() {
    return client.fetch(
        groq`*[_type == "productOption"]{
            name,
            values[],
        }`
    );
}

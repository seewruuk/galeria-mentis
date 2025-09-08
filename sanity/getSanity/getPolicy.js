import groq from "groq";
import {client} from "../lib/client";

export async function getPolicyByType(type) {
    return client.fetch(
        groq`*[_type == "policies" && type == $type]{
           content
        }[0]`,
        { type }
    );
}

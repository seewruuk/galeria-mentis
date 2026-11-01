import groq from "groq";
import "server-only";
import {fetchPublic} from "@/lib/server/sanity";


export async function getProductCategories() {
    return fetchPublic(
        groq`*[_type == "productCategory"]{
        _createdAt,
        title,
        "slug": slug.current,
        description,
        }`
    )
}
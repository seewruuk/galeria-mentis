import groq from "groq";
import "server-only";
import {fetchFresh} from "@/lib/server/sanity";

export async function getUserByEmail(email) {
    if (typeof email !== "string" || !email.trim()) return null;
    return fetchFresh(
        groq`*[_type == "user" && lower(userInfo.email) == lower($email)] | order(length(_id) desc)[0]{
            _id,
            userInfo,
            role,
        }`,
        {email: email.trim()}
    )
}
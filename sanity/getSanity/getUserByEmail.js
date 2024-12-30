import groq from "groq";
import {client} from "../lib/client";

export async function getUserByEmail(email) {
    return client.fetch(
        groq`*[_type == "user" && userInfo.email == "${email}"]{
            _id,
            userInfo,
            role,
        }[0]`
    )
}
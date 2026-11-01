import groq from "groq";
import "server-only";
import {fetchPublic} from "@/lib/server/sanity";

export async function getMaintenanceMode() {
    return fetchPublic(
        groq`*[_type == "maintenanceMode"]{
            isActive,
            message,
            password,
            contactEmail
        }[0]`
    );
}


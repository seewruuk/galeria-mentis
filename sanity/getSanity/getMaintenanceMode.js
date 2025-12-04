import groq from "groq";
import {client} from "../lib/client";

export async function getMaintenanceMode() {
    return client.fetch(
        groq`*[_type == "maintenanceMode"]{
            isActive,
            message,
            password,
            contactEmail
        }[0]`
    );
}


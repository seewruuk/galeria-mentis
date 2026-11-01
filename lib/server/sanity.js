import "server-only";
import {createClient} from "next-sanity";
import {apiVersion, dataset, projectId} from "@/sanity/env";

/**
 * Klienci Sanity dostępni WYŁĄCZNIE po stronie serwera.
 * Token czytany jest z istniejącej zmiennej (NEXT_PUBLIC_SANITY_API_TOKEN) – używamy go tylko w kodzie serwera,
 * więc nie trafia do przeglądarki. Opcjonalnie można ustawić SANITY_API_READ_TOKEN / SANITY_API_WRITE_TOKEN.
 */
const writeToken = process.env.SANITY_API_WRITE_TOKEN || process.env.NEXT_PUBLIC_SANITY_API_TOKEN;
const readToken = process.env.SANITY_API_READ_TOKEN || writeToken;

export const readClient = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token: readToken,
    perspective: "published",
});

export const writeClient = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token: writeToken,
});

export const PUBLIC_REVALIDATE_SECONDS = 60;

/** Dane publiczne (treści strony) – cache Next.js z rewalidacją. */
export function fetchPublic(query, params = {}, {revalidate = PUBLIC_REVALIDATE_SECONDS} = {}) {
    return readClient.fetch(query, params, {next: {revalidate, tags: ["sanity"]}});
}

/** Dane prywatne lub wymagające świeżości (zamówienia, ceny przy zakupie, konta). */
export function fetchFresh(query, params = {}) {
    return readClient.fetch(query, params, {cache: "no-store"});
}

/**
 * Dokumenty z danymi prywatnymi przechowujemy pod ID zawierającym kropkę (np. "private.order.abc").
 * Sanity udostępnia takie dokumenty wyłącznie zapytaniom z tokenem lub zalogowanym w Studio –
 * także w publicznym datasecie. https://www.sanity.io/docs/ids
 */
export const PRIVATE_TYPES = ["order", "user"];

export const PRIVATE_PREFIX = "private.";

export function privateId(type, id) {
    if (typeof id === "string" && id.startsWith(PRIVATE_PREFIX)) return id;
    return `${PRIVATE_PREFIX}${type}.${id}`;
}

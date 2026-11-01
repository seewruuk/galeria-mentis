import "server-only";
import {cookies} from "next/headers";
import {getMaintenanceMode} from "@/sanity/getSanity/getMaintenanceMode";
import {hmac, safeEqual} from "@/lib/server/secrets";

export const MAINTENANCE_COOKIE = "gm_unlock";

export function unlockToken(password) {
    return hmac(`maintenance:${password}`);
}

/**
 * Dane przerwy technicznej do wyświetlenia albo null. Nie czyta ciasteczek, więc strony
 * mogą być cache'owane (ISR) – odblokowanie sprawdza w przeglądarce MaintenanceGate przez API.
 */
export async function getActiveMaintenance() {
    const maintenance = await getMaintenanceMode().catch(() => null);
    if (!maintenance?.isActive) return null;
    return {message: maintenance.message || "", contactEmail: maintenance.contactEmail || ""};
}

/** Czy bieżące żądanie ma ważne ciasteczko odblokowania (używane tylko w API). */
export async function isMaintenanceUnlocked(maintenance) {
    if (!maintenance?.isActive) return true;
    const cookie = (await cookies()).get(MAINTENANCE_COOKIE)?.value;
    return !!(cookie && maintenance.password && safeEqual(cookie, unlockToken(maintenance.password)));
}

import "server-only";
import {cookies} from "next/headers";
import {getMaintenanceMode} from "@/sanity/getSanity/getMaintenanceMode";
import {hmac, safeEqual} from "@/lib/server/secrets";

export const MAINTENANCE_COOKIE = "gm_unlock";

export function unlockToken(password) {
    return hmac(`maintenance:${password}`);
}

/**
 * Zwraca dane przerwy technicznej do wyświetlenia albo null, jeśli strona ma być dostępna.
 * Ciasteczko czytamy tylko gdy przerwa jest aktywna – w normalnym trybie strony mogą być cache'owane (ISR).
 */
export async function getActiveMaintenance() {
    const maintenance = await getMaintenanceMode().catch(() => null);
    if (!maintenance?.isActive) return null;

    const cookie = (await cookies()).get(MAINTENANCE_COOKIE)?.value;
    if (cookie && maintenance.password && safeEqual(cookie, unlockToken(maintenance.password))) {
        return null;
    }

    return {message: maintenance.message || "", contactEmail: maintenance.contactEmail || ""};
}

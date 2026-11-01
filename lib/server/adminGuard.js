import "server-only";
import {NextResponse} from "next/server";
import {getAdminUser} from "@/lib/server/auth";
import {isSameOrigin} from "@/lib/server/http";

/**
 * Zwraca {admin} albo {response} z błędem 401/403. Dla metod zmieniających dane wymaga tego samego Origin (CSRF).
 */
export async function requireAdmin(request, {mutating = false} = {}) {
    if (mutating && !isSameOrigin(request)) {
        return {response: NextResponse.json({status: "error", message: "Forbidden"}, {status: 403})};
    }
    const admin = await getAdminUser().catch(() => null);
    if (!admin) {
        return {response: NextResponse.json({status: "error", message: "Unauthorized"}, {status: 401})};
    }
    return {admin};
}

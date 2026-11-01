import {NextResponse} from "next/server";
import {getSessionUser, publicUser} from "@/lib/server/auth";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const user = await getSessionUser();
        return NextResponse.json(
            {user: user ? publicUser(user) : null},
            {headers: {"Cache-Control": "no-store"}}
        );
    } catch {
        return NextResponse.json({user: null}, {headers: {"Cache-Control": "no-store"}});
    }
}

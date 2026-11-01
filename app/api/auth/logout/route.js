import {NextResponse} from "next/server";
import {clearSessionCookie} from "@/lib/server/auth";
import {isSameOrigin} from "@/lib/server/http";

export async function POST(request) {
    if (!isSameOrigin(request)) {
        return NextResponse.json({status: "error"}, {status: 403});
    }
    const response = NextResponse.json({status: "ok"});
    clearSessionCookie(response);
    return response;
}

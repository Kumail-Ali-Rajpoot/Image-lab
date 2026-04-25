import { NextResponse,NextRequest } from "next/server";
import { auth } from "@/lib/auth";
export async function GET(req:NextRequest) {
    const session = await auth.api.getSession({
        headers: req.headers
    })
    NextResponse.json({session:session})
}
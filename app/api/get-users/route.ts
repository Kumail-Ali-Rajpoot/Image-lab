import { prisma } from "@/lib/prisma";  
import { NextResponse } from "next/server";

export async function GET() {
    const users = await prisma.user.findMany();
    if(!users) {
        return NextResponse.json({success: false, error: "No session"});
    }
    return NextResponse.json({success: true, users: users});
}
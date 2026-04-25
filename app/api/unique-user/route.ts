import { NextResponse,NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req:NextRequest) {
    try {
        const {email} = await req.json();
        if (!email) {
            return NextResponse.json({success: false, error: "Email is required"}, {status: 400});
        }
        const user = await prisma.user.findUnique({where: {email}});
        if(user) {
            return NextResponse.json({success: true, message: "User already exists"});
        }
        return NextResponse.json({success: false, error: "User does not exist"});
    } catch (error) {
        console.error("Error checking unique user:", error);
        return NextResponse.json({success: false, error: "Internal server error"}, {status: 500});
    }
}
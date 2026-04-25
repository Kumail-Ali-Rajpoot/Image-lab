import { NextResponse,NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
export async function POST(req: NextRequest) {
    try {
        const userData = await req.json();
        const user = await prisma.user.create({
            data: userData
        });
        await prisma.folder.create({
            data: {
                name: "Default",
                userId: user.id,
                userEmail: userData.email
            }
        })
        return NextResponse.json({success: true, user,message:"User added successfully"});
    } catch (error) {
        console.error("Error adding user:", error);
        return NextResponse.json({ success: false, error: "Failed to add user" }, { status: 500 });
    }
}
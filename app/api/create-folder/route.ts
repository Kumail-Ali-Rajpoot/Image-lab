import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { success } from "better-auth";
export async function POST(req: NextRequest) {
    const session = await auth.api.getSession({
        headers: req.headers
    })
    if(!session){
        return NextResponse.json({success:false, error: "Unauthorized" }, { status: 401 });
    }
    const user = await prisma.user.findUnique({
        where: {
            email: session?.user?.email
        }
    })
    if(!user){
        return NextResponse.json({success:false, error: "User not found" }, { status: 404 });
    }

    try {
        const { folderName } = await req.json();
        const folderExists = await prisma.folder.findFirst({
            where:{
                name:folderName,
                userId: user.id
            }
        }) 
        if(folderExists) {
            return NextResponse.json({success:false,error: "Folder is alreadt exits of this name"},{status:400})
        }
        if (!folderName || typeof folderName !== 'string' || folderName.trim() === "") {
            return NextResponse.json({success:false, error: "Folder name is required" }, { status: 400 });
        }

        await prisma.folder.create({
            data: {
                name: folderName,
                userId:user.id,
                userEmail:user.email
            }
        })
        return NextResponse.json({success:true, message: "Folder created successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error creating folder:", error);
        return NextResponse.json({success:false, error: "Internal server error" }, { status: 500 });
    }
}
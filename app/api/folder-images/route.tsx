import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
export async function GET(req: NextRequest) {
    try {
        const session = await auth.api.getSession({headers:req.headers})
        if(!session)
            throw new Error("The user is not authenticated!");
        else if(!session?.user?.email)
            throw new Error("The user email is not found!");

        const folderName = req.nextUrl.searchParams.get("folder-name");
        if(!folderName)
            throw new Error("The folder name is not found!");

        const numOfImagesString = req.nextUrl.searchParams.get("numOfImages");
        const numOfImages = numOfImagesString ? Number(numOfImagesString) : null;

        const folder = await prisma.folder.findFirst({
            where: {
                userEmail: session.user.email,
                name: folderName,
            },
            select: {
                id: true,
                name: true,
                images: numOfImages ? { take: numOfImages } : true,
            },
        });

        if(!folder) 
            throw new Error("The folder is not found!");

        return NextResponse.json({success:true, data: folder }, { status: 200 })
    } catch (error: any) {
        console.log("Error in folder-images api", error);
        return NextResponse.json({success:false, error: error.message || "Internal server error" }, { status: 500 })
    }
}
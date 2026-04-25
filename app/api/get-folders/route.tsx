import { NextRequest,NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req:NextRequest){
    const session = await auth.api.getSession({headers:req.headers as any})
    try{
        if(!session?.user?.email){
            return NextResponse.json({success:false,error:"Unauthorized"})
        }
        const folders = await prisma.folder.findMany({
            where:{
                userEmail:session.user.email
            }
        })
        if(!folders){
            throw new Error("Something went wrong while getting folders data")
        }
        return NextResponse.json({success:true,data:folders,message:"Folders fetched successfully"})
    }catch(error: any){
        console.error("Error fetching folders:", error);
        return NextResponse.json({success:false, error: error.message || "Internal server error", message:"Failed to get folders"}, {status:500})
    }
}
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET(req:NextRequest){
    try{
    const session = await auth.api.getSession({
        headers: req.headers
    })
    if(!session?.user?.email) {
        throw new Error("Unauthorized!")
    }
    const numOfImagesString = req.nextUrl.searchParams.get("numOfImages");
    const numOfImages = Number(numOfImagesString);
    if(numOfImages) {
      const images = await prisma.image.findMany({
        take:numOfImages,
        where:{
          ownerEmail: session?.user?.email as string,
        },
        select:{
          url:true,
          name:true,
          createdAt:true,
          publicId:true,
        }
      })
      if(images.length === 0){
        throw new Error("No images found!")
      }
      return NextResponse.json({success:true,data:images}, {status:200})
    }else {
      const images = await prisma.image.findMany({
        where:{
          ownerEmail: session?.user?.email as string,
        },
        select:{
          url:true,
          name:true,
          createdAt:true,
          publicId:true,
        }
      })
      if(images.length === 0){
        throw new Error("No images found!")
      }
      return NextResponse.json({success:true,data:images}, {status:200})
    }
  }catch(err:any){
    return NextResponse.json({message:err.message},{status:500})
  }
}
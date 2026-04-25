import cloudinary from "@/lib/cloudinary";
import { NextRequest,NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {auth} from "@/lib/auth";
export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers:req.headers,
        })
        if(!session){
            return NextResponse.json({success:false,error:"User not authenticated"},{status:401})
        }
        const userEmail = session?.user?.email as string;
        if(!userEmail){
            return NextResponse.json({success:false,error:"User email not found"},{status:401})
        }
        const formData = await req.formData();
        if(!formData) {
            return NextResponse.json({success:false,error:"No form data found"},{status:400})
        }
        const images = formData.getAll("images") as File[];
        const imagesArray = Array.from(images) as File[];
        const folderName = formData.get("folderName") as string;
        const folder = await prisma.folder.findFirst({
            where:{
                name:folderName,
            },
            select:{
                id:true,
            }
        })
        const folderId = folder?.id;
        const uploadPromise:any[] = imagesArray.map(async(image: File)=>{
            const buffer = Buffer.from(await image.arrayBuffer())
            const uploadResponse: any = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: "image-lab",
                        resource_type: "auto", 
                    },
                    (error:any, result:any) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                );
                uploadStream.end(buffer);
            }).then(async(res:any)=>{
                await prisma.image.create({
                    data:{
                        url:res.secure_url,
                        publicId:res.public_id,
                        folderId:folderId as string,
                        ownerEmail:userEmail
                    },
                })
            })
            console.log(uploadResponse);
            return uploadResponse
        })
        const promiseResult = await Promise.all(uploadPromise);
        console.log(promiseResult)
        return NextResponse.json({success:true,data:promiseResult,message:"Uploaded successfully"},{status:200});
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
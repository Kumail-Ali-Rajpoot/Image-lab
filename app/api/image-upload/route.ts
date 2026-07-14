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
        // const imagesArray = Array.from(images) as File[];
        const folderName = formData.get("folderName") as string;
        if(!folderName) {
            return NextResponse.json({success:false,error:"Folder name is required"},{status:400})
        }
        // BUG 1 FIX: scope folder lookup to the current user's email so images
        // never get attached to another user's folder.
        const folder = await prisma.folder.findFirst({
            where:{
                name: folderName,
                userEmail: userEmail, // ← critical: only search THIS user's folders
            },
            select:{
                id:true,
            }
        })
        if(!folder?.id) {
            return NextResponse.json({success:false,error:`Folder "${folderName}" not found for your account`},{status:404})
        }
        const folderId = folder.id;
        const uploadPromise:any[] = images.map(async(image: File)=>{
            const buffer = Buffer.from(await image.arrayBuffer())
            const imageName = image.name;
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
            }).then((res:any)=>{
                const resData = prisma.image.create({
                    data:{
                        url:res.secure_url,
                        publicId:res.public_id,
                        folderId:folderId as string,
                        ownerEmail:userEmail,
                        name:imageName,
                    },
                })
                console.log("Data added in database:",resData);
                return resData;
            })
            console.log("uploadResponse:",uploadResponse);
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
import { NextRequest,NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

export async function DELETE(req: NextRequest) {
    try {
        const formData = await req.formData()
        const publicIds = formData.getAll("publicIds") as string[];
        const session = await auth.api.getSession({headers:req.headers})
        if(!session) throw new Error("The user is not authenticated!")
        else if(!session?.user?.email) throw new Error("The user email is not found!")
        const result = await cloudinary.api.delete_resources(publicIds,{invalidate:true})
        // BUG 3 FIX: always filter by ownerEmail so a user can only
        // delete their own images, not someone else's.
        await prisma.image.deleteMany({
            where: {
                publicId: {
                    in: publicIds
                },
                ownerEmail: session.user.email, // ← security: only delete THIS user's images
            }
        });
        return NextResponse.json({success:true,message:"The images are deleted successfully!",data:result},{status:200})
    } catch (error:any) {
        console.log(error.message)
        return NextResponse.json({success:false,message:error.message || "Failed to delete the images!"},{status:500})
    }
}
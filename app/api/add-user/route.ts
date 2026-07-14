import { NextResponse,NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
    // BUG 4 FIX: verify the caller is actually authenticated before
    // creating any user record. Without this, anyone could POST to this
    // endpoint and inject arbitrary user data into the database.
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.email) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    try {
        const userData = await req.json();
        // Extra guard: make sure the email in the body matches the session,
        // so a user cannot register a different email on someone else's behalf.
        if (userData.email !== session.user.email) {
            return NextResponse.json({ success: false, error: "Email mismatch — you can only register your own account" }, { status: 403 });
        }
        const user = await prisma.user.create({
            data: userData
        });
        await prisma.folder.create({
            data: {
                name: "default",
                userId: user.id,
                userEmail: userData.email
            }
        })
        return NextResponse.json({success: true, user, message:"User added successfully"});
    } catch (error) {
        console.error("Error adding user:", error);
        return NextResponse.json({ success: false, error: "Failed to add user" }, { status: 500 });
    }
}
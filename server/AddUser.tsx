'use server'
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function AddUser(password: string) {

    const session = await auth.api.getSession({
        headers: await headers()
    });
    
    if(!session) {
        redirect("/");
    }
    try {
        const userData = await prisma.user.update({
            where: { email: session.user?.email as string },
            data: {
                password: password,
            },
        });

        return {success: true};
    }catch(err: any) {
        return {success: false, error: err.message || "An error occurred"};
    }
}


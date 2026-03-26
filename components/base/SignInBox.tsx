'use client'
import React from "react";
import { authClient } from "@/lib/auth-client";
export default function SignInBox() {
  return (
   <div className="rounded-sm bg-card/60 flex flex-col gap-2">
    <h3 className="text-xl font-bold">Welcome to Image Lab</h3>
    <p className="text-sm text-muted-foreground">Sign in to get started store images</p>
    <button 
    className="rounded-sm bg-foreground text-background px-2 py-1 cursor-pointer"
    onClick={async() => await authClient.signIn.social({
      provider: "google",
    })}>Sign In with Google</button>
   </div>
  );
}

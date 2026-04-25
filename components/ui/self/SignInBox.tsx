'use client'
import React from "react";
import { Button } from "../button";
import { authClient } from "@/lib/auth-client";
import DynamicIcon from "../../hooks/DynamicIcons";
import { toast } from "sonner";

export default function SignInBox() {
  const [isLoading, setIsLoading] = React.useState(false);
  return (
   <div className="max-w-sm z-10 text-center w-full bg-card/60 border p-2 border-border flex flex-col gap-2">
    <h3 className="text-xl font-bold">Welcome to Image Lab</h3>
    <p className="text-sm text-muted-foreground">Sign in to get started store images</p>
    <Button 
    onClick={async() => {
      setIsLoading(true);
      try {
        const { data, error } = await authClient.signIn.social({
          provider: "google", 
        });
        
        if (error) {
          toast("Login failed", {
            description: error.message || "Please try again as long as not server send request properly!",
            action: {
              label: "Contact",
              onClick: () => {
                const email:any = prompt("Enter your email here:");
                const message:any = prompt("Enter your message:");
                function resendNotification(email:any,message:any) {
                  if(email === "" && message === "") {
                    alert("Please dont send us empty strings!");
                    prompt("Enter your email here:");
                    prompt("Enter your message:");
                  }
                  else {
                    alert("Thank you for your message! We will get back to you as soon as possible.");
                  }
                }
                resendNotification(email as string,message as string);
              }
            }
          });
          
        }
      } catch(err:any) {
        console.log(err);
        toast("Login failed", {
          description: err.message || "An unexpected error occurred.",
        });
      } finally {
        setIsLoading(false);
      }
    }
    }>
      {
        isLoading ? <div className="w-4 h-4 rounded-full border-background border-2 border-dashed animate-spin" /> 
       : <img 
       className="w-4 h-4"
       src="https://th.bing.com/th/id/R.96c1a6566397efcf7de758fd2a6f116a?rik=LwK4OM1JQPW06A&pid=ImgRaw&r=0" 
       alt="Google logo" />
      }
     {isLoading ? "Please wait..." : "Sign In with Google"}
    </Button>
   </div>
  );
}

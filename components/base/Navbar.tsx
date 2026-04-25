'use client'
import React from 'react'
import InfiniteLinesWrapper from '../hooks/InfiniteLinesWrapper'
import { authClient } from "@/lib/auth-client"
import Image from 'next/image'
import DynamicIcon from '../hooks/DynamicIcons'
import { Button } from '../ui/button'
import { useRouter, usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
export default function Navbar() {
  const router = useRouter();
  // 1. Call the hook directly at the top level
  // Better Auth handles the "awaiting" for you internally
  const { data: session, isPending } = authClient.useSession();
  const pathname = usePathname();
  React.useEffect(()=>{
    if(!isPending && !session?.user && pathname !== "/") {
      router.push("/");
    }
  },[session, isPending, pathname, router])
  return (
    <motion.div className='w-full' 
    initial={{filter: "blur(2px)",opacity:0}} 
    animate={{filter: "blur(0px)",opacity:1}} 
    transition={{duration: 0.5}}>
    <InfiniteLinesWrapper childContClassName='flex justify-between items-center'>
      <Image src="/logo.png" alt="logo" width={100} height={100} className='' />
      
      <div>
        {/* 2. Check if we are still loading */}
        {isPending ? (
          <div className='sm:size-7 size-5 md:size-10 rounded-full border bg-neutral-800 animate-pulse' />
        ) : session?.user ? (
          <div className='flex items-center gap-2'>
          <Button onClick={async() => {
            try {
              await authClient.signOut();
              router.push("/");
              toast.success("Logged out successfully");
            }catch (err) {
              toast.error("Failed to logout!");
            }
          }}>
            <DynamicIcon iconName='DoorOpen' /> Logout
          </Button>
          <Image
            unoptimized={true} 
            width={40}
            height={40}
            src={session.user.image as string} 
            className='sm:size-7 size-5 md:size-10 rounded-full border object-cover'
            alt={session.user.name || "profile"} 
          />
          </div>
        ) : (
          /* 4. Fallback if user is not logged in */
          <Button onClick={async() => await authClient.signIn.social({
            provider: "google", 
          })} className="text-sm border px-3 py-1 rounded-md">
            Login
          </Button>
        )}
      </div>
    </InfiniteLinesWrapper>
    </motion.div>
  )
}
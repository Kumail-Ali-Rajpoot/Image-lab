'use client'
import React from 'react'
import InfiniteLinesWrapper from '../hooks/InfiniteLinesWrapper'
import Folder from '../ui/self/Folder'
import { motion,MotionConfig } from "framer-motion";
import Image from 'next/image'
import { Button } from '../ui/button'
import { FolderSearch } from "@/components/base/Search"
import DynamicIcon from '../hooks/DynamicIcons'
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';

async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
  const image = e.target.files?.[0];
  const pathname = usePathname();
  if (!image) return;
  const formData = new FormData();
  formData.append("image", image);
    const response = await fetch("/api/image-upload",{
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    console.log(data);
}


export default function Dashoard() {
  const [isUserAdded,setIsUserAdded] = React.useState<boolean>(false);
  const {data:session,isPending} = authClient.useSession();
  const [folders,setFolders] = React.useState<any[]>([]);
  const router = useRouter(); // Keeping this for the replace to /user-manager
  React.useEffect(() => {
    const isAddedChecker = async () => {
      if (!session?.user?.email) return;
      
      try {
        const res = await fetch("/api/unique-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: session.user.email }),
        });

        const data = await res.json().catch(() => null);

        if (!res.ok || !data) {
          console.error("Failed to check user:", data?.error || "Empty response");
          return;
        }

        setIsUserAdded(data.success);
        
        if (!data.success) {
          router.replace("/user-manager");
        }
      } catch (err) {
        console.error("Failed to check user:", err);
      }
    };
    const getFolders=async()=>{
      try {
        const res = await fetch("/api/get-folders", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        const data = await res.json().catch(() => null);
        
        if (!res.ok || !data) {
          toast(data?.error || data?.message || "Failed to fetch folders");
          return;
        }

        if(data.success){
          setFolders(data.data)
        }else {
          toast(data.error || data.message)
        }
      } catch (err:any) {
        toast(`${err.message || "Failed to get folders data!"}`)
      }
    }
    if (!isPending) {
      isAddedChecker();
      getFolders();
    }
  }, [session, isPending, router]);
  const images = Array(7).fill("https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=300&auto=format&fit=crop");
  return (
    <div className="flex flex-col w-full pb-10">
      <FolderSearch  />
      <InfiniteLinesWrapper
      childContClassName='py-12 relative overflow-hidden'
      >
        <header className='w-full items-center grid grid-cols-1 sm:grid-cols-2 gap-8'>
          <motion.section
          initial={{position:"relative",opacity:0,right:"10%"}}
          animate={{opacity:1,right:"0%"}}
          transition={{duration:1}}
          className='max-w-md w-full flex flex-col items-center p-6 gap-5'>
            <div className="flex flex-col p-2 gap-2">
              <motion.h1
              initial={{opacity:0,right:"40%"}}
              animate={{opacity:1,right:"0%"}}
              transition={{duration:1}}
              className='text-3xl sm:text-4xl font-bold tracking-tight'>Welcome to <span className='leading-relaxed text-cyan-500'>Image Lab</span> dashboard</motion.h1>
              <motion.p
              initial={{opacity:0,right:"40%"}}
              animate={{opacity:1,right:"0%"}}
              transition={{duration:1,delay:0.5}}
              className='text-base text-muted-foreground'>Manage, store, and organize your images seamlessly</motion.p>
              <motion.div 
              initial={{opacity:0,right:"40%"}}
              animate={{opacity:1,right:"0%"}}
              transition={{duration:1,delay:1}}
              className='flex gap-2'>
              <Button variant="default">Store images</Button>
              <Button variant="outline">View folders</Button>
              </motion.div>
            </div>

          </motion.section>
          <motion.div
          initial={{position:"relative",opacity:0,left:"10%"}}
          animate={{opacity:1,left:"0%"}}
          transition={{duration:1}}
          >
            <Image 
            width={10000}
            height={10000}
            src="/storage-systems.png"
            alt="image-lines"
            unoptimized
            className=''
            />
          </motion.div>
        </header>
      </InfiniteLinesWrapper>

      <InfiniteLinesWrapper childContClassName="pt-8 pb-4">
        <div className="flex justify-between items-end px-2">
          <div>
            <h1
            className='text-xl flex items-center gap-2 font-bold'>
              <DynamicIcon iconName='Image' className='size-5 text-primary' />
              Recent Images
            </h1>
            <p
            className='text-sm text-muted-foreground mt-1'>The most recent images from your folders</p>
          </div>
          <Button variant="ghost" size="sm" className="hidden sm:flex text-muted-foreground hover:text-foreground">View All</Button>
        </div>
      </InfiniteLinesWrapper>
      
      <InfiniteLinesWrapper childContClassName="pb-8">
        <main className='w-full grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-3 px-2'>
          {
          images?
          images.map((src, i) => (
            <div key={i} className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted/50 cursor-pointer shadow-sm">
              <img src={src} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110" alt="Dashboard image" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                <Button size="icon" variant="secondary" className="size-8 rounded-full shadow-md scale-50 group-hover:scale-100 transition-transform duration-300">
                  <DynamicIcon iconName="Eye" className="size-4" />
                </Button>
              </div>
            </div>
          ))
          : 
          <div className="flex items-center border justify-center">
            <p className="text-muted-foreground">No images found</p>
          </div>
        }
        </main>
      </InfiniteLinesWrapper>

      <InfiniteLinesWrapper childContClassName="pt-8 pb-4">
        <div className="flex justify-between items-end px-2">
          <div>
            <h1
            className='text-xl flex items-center gap-2 font-bold'>
              <DynamicIcon iconName='FolderOpen' className='size-5 text-primary' />
              Folders <span className="text-muted-foreground font-normal text-sm ml-1">({folders.length})</span>
            </h1>
            <p className='text-sm text-muted-foreground mt-1'>Organize your image library efficiently</p>
          </div>
          <Button onClick={()=>{router.push("/protected-dashboard/create-folder")}} variant="outline" size="sm" className="hidden sm:flex bg-background">
            <DynamicIcon iconName="Plus" className="size-4 mr-2" />
            New Folder
          </Button>
        </div>
      </InfiniteLinesWrapper>
      
      <InfiniteLinesWrapper
      childContClassName='min-h-[50vh] overflow-y-auto mb-10'
      >
        <main className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full border-t border-r border-border'>
            {
              folders && folders.length > 0 ? folders.map((folder, i) => (
                <Folder key={i} idx={i} folderName={folder.name} numImages={0} />
              )) : (
                <div className="flex items-center justify-center w-full text-center col-span-full py-20">
                  <p className="text-muted-foreground italic">No folders found. Create your first folder to get started!</p>
                </div>
              )
            }
        </main>
      </InfiniteLinesWrapper>
    </div>
  )
}

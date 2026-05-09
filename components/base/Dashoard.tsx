'use client'
import React from 'react'
import InfiniteLinesWrapper from '../hooks/InfiniteLinesWrapper'
import Folder, { FolderLoader } from '../ui/self/Folder'
import { motion,AnimatePresence, spring } from "framer-motion";
import Image from 'next/image'
import { Button } from '../ui/button'
import { FolderSearch } from "@/components/base/Search"
import DynamicIcon from '../hooks/DynamicIcons'
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';
import Loader from "@/components/ui/self/Loader"
import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import { Drawer } from "vaul"
import Link from "next/link";
import { useRef } from 'react';

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
  const router = useRouter(); // Keeping this for the replace to /user-manager
  const { data:foldersResponse, isLoading:isGetFoldersLoading,error:foldersError} = useSWR("/api/get-folders",fetcher)
  const folders = foldersResponse?.success ? foldersResponse.data : null;
  const [isOpenDrawer, setIsOpenDrawer] = React.useState(false); 
  const { data:allImagesResponse, isLoading:isGetAllImagesLoading,error:allImagesError} = useSWR("/api/get-images",fetcher)
  const allImages = allImagesResponse?.success ? allImagesResponse.data : [];
  const scrollToFolderRef = useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    if(foldersError){
      toast(foldersError?.message || "Failed to get folders!")
    }
  }, [foldersError]);
  const { data: imagesResponse, isLoading: isGetImagesLoading, error: imagesError } = useSWR("/api/get-images?numOfImages=10", fetcher);
  const recentImages = imagesResponse?.success ? imagesResponse.data : null;
  React.useEffect(() => {
    if (imagesError) {
      toast(imagesError?.message || "Failed to get recent images!");
    }
  }, [imagesError]);

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

    if (!isPending) {
      isAddedChecker();
    }
  }, [session, isPending, router]);
  return (
    <div className="flex flex-col w-full pb-10">
      <Drawer.Root open={isOpenDrawer} onOpenChange={setIsOpenDrawer}>
        <Drawer.Portal>
          <Drawer.Overlay className='fixed inset-0 bg-muted-foreground/10 z-50' />
          <Drawer.Content className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[80%] bg-background rounded-t-xl z-50 flex flex-col">
            {/* The "Handle" for the drawer (Optional but recommended for Vaul) */}
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted my-4" />
            
            {/* The actual scrollable area */}
            <div className="flex-1 scrollbar-hide overflow-y-auto p-4 md:p-6">
              <Drawer.Title className="text-lg font-bold">Your folders</Drawer.Title>
              <Drawer.Description className="text-muted-foreground mb-4">
                The folders where you store your images
              </Drawer.Description>
              <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4">
              {
                isGetAllImagesLoading ? (
                  Array.from({length:14}).map((_,i)=>(
                  <motion.div key={i}
                    animate={{opacity:[0.3,0.6,0.3,0.6]}} 
                    transition={{duration:2,repeat:Infinity,delay:i*0.05}} 
                    className="flex flex-col justify-between items-center group relative min-w-36 min-h-36 overflow-hidden rounded-lg border border-border bg-muted/50 cursor-pointer shadow-sm animate-pulse">
                      <div className="w-full h-full relative overflow-hidden">
                      <div className="w-full h-full bg-muted" />
                    </div>
                  </motion.div>
                  ))
                ) : allImagesResponse?.success ? allImagesResponse.data.map((image:any,i:number)=>(
              <motion.div key={i} initial={{opacity:0}} whileInView={{opacity:1,}} 
            viewport={{once:true}}
            exit={{opacity:0}} 
            transition={{duration:0.1,type:"spring",stiffness:100,damping:15}} 
            className="group relative min-w-36 min-h-36 overflow-hidden rounded-lg border border-border bg-muted/50 cursor-pointer shadow-sm">
              <Image src={image.url} 
              width={400}
              height={400}
              unoptimized
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110" alt="Dashboard image" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                <Button size="icon" variant="secondary" className="size-8 rounded-full shadow-md scale-50 group-hover:scale-100 transition-transform duration-300">
                  <DynamicIcon iconName="Eye" className="size-4" />
                </Button>
              </div>
            </motion.div>
                )) : (
                  <p className="text-center text-muted-foreground">No folders found!</p>
                )
              }
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
      <FolderSearch  />
      <InfiniteLinesWrapper
      childContClassName='py-12 relative overflow-hidden'
      >
        <header className='w-full items-center grid grid-cols-1 sm:grid-cols-2 gap-8'>
          <motion.section
          initial={{position:"relative",x:-10}}
          animate={{opacity:1,x:0}}
          transition={{duration:0.1}}
          className='max-w-md w-full flex flex-col items-center p-1 sm:p-3 md:p-6 gap-5'>
            <div className="flex flex-col items-center sm:items-start p-0.5 sm:p-2 gap-2">
              <motion.h1
              initial={{opacity:0,x:-40}}
              animate={{opacity:1,x:0}}
              transition={{duration:0.1,delay:0.95}}
              className='text-xl sm:text-2xl md:text-3xl font-bold tracking-tight'>Welcome to <span className='leading-relaxed text-cyan-500'>Image Lab</span> dashboard</motion.h1>
              <motion.p
              initial={{opacity:0,x:-40}}
              animate={{opacity:1,x:0}}
              transition={{duration:0.1,delay:0.94}}
              className='text-xs sm:text-base md:text-lg text-muted-foreground'>Manage, store, and organize your images seamlessly</motion.p>
              <motion.div 
              initial={{ opacity: 0, x: -40 }} // Use x instead of right
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.1, delay: 1 }} // High delay
              className='flex gap-2'>
              <Link href={"/protected-dashboard/folder/default/add"}>
                <Button variant="default">Store images</Button>
              </Link>
              <Button variant="outline" 
              onClick={()=>scrollToFolderRef?.current?.scrollIntoView({behavior:"smooth",block:"start"})}
              >View folders</Button>
              </motion.div>
            </div>

          </motion.section>
          <motion.div
          initial={{position:"relative",opacity:0,left:"10%"}}
          animate={{opacity:1,left:"0%"}}
          transition={{duration:0.1,delay:0.95}}
          >
            <Image 
            width={10000}
            height={10000}
            src="/storage-systems.png"
            alt="image-lines"
            unoptimized
            fetchPriority='high'
            className=''
            />
          </motion.div>
        </header>
      </InfiniteLinesWrapper>

      <InfiniteLinesWrapper childContClassName="pt-8 pb-4">
        <div className="flex justify-between items-end px-2">
          <div className='flex flex-col gap-2 w-full'>
            <h1
            className='text-md sm:text-lg md:text-xl flex items-center justify-between w-full gap-2 font-bold'>
              <section className='flex items-center gap-2'>
                <DynamicIcon iconName='Image' className='size-5 text-primary' />
                Recent Images
              </section>
              <Button size="sm" onClick={() => setIsOpenDrawer(drawer=>!drawer)} variant="ghost" className="flex text-muted-foreground hover:text-foreground">
                View All
              </Button>
            </h1>
            <p
            className='text-xs sm:text-sm text-muted-foreground mt-1'>The most recent images from your folders</p>
          </div>
        </div>
      </InfiniteLinesWrapper>
        {/* Recent images uploaded by user */}
      <InfiniteLinesWrapper childContClassName="pb-8">
        <main className='w-full flex scrollbar-hide overflow-x-auto gap-3 px-2'>
          <AnimatePresence mode='popLayout'>
          {
            isGetImagesLoading ?
              Array.from({length:10}).map((_,index)=>(
                <motion.div key={index} animate={{
                  opacity:[0.3,0.6,0.3,0.6]
                }}
                transition={{duration:1.8,ease:"easeInOut",repeat:Infinity,delay:index * 0.05}}
                className="group relative w-36 h-36 flex-shrink-0 flex items-start overflow-hidden rounded-lg border border-border bg-muted/50 cursor-pointer shadow-sm">
                  <div className="w-full h-full bg-muted" />
                </motion.div>
              ))
          : 
          recentImages && recentImages.length > 0 ?
          recentImages.map((image:any, i:number) => (
            <motion.div key={i} initial={{opacity:0}} whileInView={{opacity:1,}} 
            viewport={{once:true}}
            exit={{opacity:0}} 
            transition={{duration:0.1,type:"spring",stiffness:100,damping:15}} 
            className="group relative w-36 h-36 flex-shrink-0 flex items-start overflow-hidden rounded-lg border border-border bg-muted/50 cursor-pointer shadow-sm">
              <Image src={image.url} 
              width={400}
              height={400}
              unoptimized
              className="aspect-square object-cover w-full h-full transition-transform duration-500 group-hover:scale-110" alt="Dashboard image" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                <Button size="icon" variant="secondary" className="size-8 rounded-full shadow-md scale-50 group-hover:scale-100 transition-transform duration-300">
                  <DynamicIcon iconName="Eye" className="size-4" />
                </Button>
              </div>
            </motion.div>
          ))
          : 
          <motion.div initial={{opacity:0}} 
          viewport={{once:true}}
          whileInView={{opacity:1}} 
          exit={{opacity:0}} 
          transition={{duration:0.1,type:"spring",stiffness:100,damping:15}} 
          className="flex items-center border justify-center col-span-full py-10 px-2 rounded-lg">
            <p className="text-muted-foreground">No images found</p>
          </motion.div>
        }
        </AnimatePresence>
        </main>
      </InfiniteLinesWrapper>

      <InfiniteLinesWrapper childContClassName="pt-8 pb-4">
        <div ref={scrollToFolderRef} className="flex justify-between items-end px-2">
          <div>
            <h1
            className='text-md sm:text-lg md:text-xl flex items-center gap-2 font-bold'>
              <DynamicIcon iconName='FolderOpen' className='size-5 text-primary' />
              Folders <span className="text-muted-foreground font-normal text-sm ml-1">({folders? folders?.length : "loading..."})</span>
            </h1>
            <p className='text-xs sm:text-sm text-muted-foreground mt-1'>Organize your image library efficiently</p>
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
        <motion.main layout className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full border-t border-r border-border'>
            <AnimatePresence>
            {
              !folders ? 
              Array.from({length:12}).map((_,i)=>(
                <FolderLoader key={i} />
              ))
               :
              folders && folders.length > 0 ? folders.map((folder:any,i:number) => (
                <Folder key={i} idx={i} folderName={folder.name} numImages={folder?.images?.length} />
              )) : (
                <motion.div
                initial={{opacity:0}}
                animate={{opacity:1}}
                transition={{duration:0.1}}
                exit={{opacity:0}}
                className="flex items-center justify-center w-full text-center col-span-full py-20">
                  <Loader />
                </motion.div>
              )
            }
            </AnimatePresence>
        </motion.main>
      </InfiniteLinesWrapper>
    </div>
  )
}

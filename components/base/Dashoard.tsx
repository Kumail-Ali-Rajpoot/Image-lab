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
import { cn } from '@/lib/utils';

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
  const [imagePreview, setImagePreview] = React.useState<string>("");
  const [imageName, setImageName] = React.useState<string>("");
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
      <Drawer.Root open={isOpenDrawer} onOpenChange={(open) => {
        // Prevent closing the drawer if the image preview modal is active
        if (!open && imagePreview !== "") return;
        setIsOpenDrawer(open);
      }}>
        <Drawer.Portal>
          <Drawer.Overlay className='fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50' />
          <Drawer.Content className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[80%] bg-background border-t border-x border-cyan-800/40 rounded-t-xl z-50 flex flex-col shadow-2xl shadow-black/40">
            {/* Handle */}
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-cyan-800/40 my-4" />

            {/* Scrollable area */}
            <div className="flex-1 scrollbar-hide overflow-y-auto px-4 pb-6 md:px-6">
              {/* Header */}
              <div className="flex items-center gap-2 mb-1">
                <DynamicIcon iconName="Images" className="size-5 text-cyan-500" />
                <Drawer.Title className="text-lg font-bold text-foreground">All Images</Drawer.Title>
              </div>
              <Drawer.Description className="text-xs text-muted-foreground mb-5 ml-7">
                Every image stored across your folders
              </Drawer.Description>

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
              {
                isGetAllImagesLoading ? (
                  Array.from({length:14}).map((_,i)=>(
                    <motion.div key={i}
                      animate={{opacity:[0.3,0.6,0.3,0.6]}}
                      transition={{duration:2,repeat:Infinity,delay:i*0.05}}
                      className="relative overflow-hidden rounded-lg border border-cyan-800/30 bg-muted/50 shadow-sm aspect-video">
                      <div className="w-full h-full bg-muted" />
                      <div className="absolute bottom-0 left-0 right-0 h-6 bg-muted/60" />
                    </motion.div>
                  ))
                ) : allImagesResponse?.success ? allImagesResponse.data.map((image:any,i:number)=>(
                  <motion.div key={i}
                    onClick={() => {
                      setImagePreview(image.url);
                      setImageName(image.name || "Image");
                    }}
                    initial={{opacity:0, y:8}}
                    whileInView={{opacity:1, y:0}}
                    viewport={{once:true}}
                    exit={{opacity:0}}
                    transition={{duration:0.15, type:"spring", stiffness:280, damping:22}}
                    className="group relative overflow-hidden rounded-lg border border-cyan-800/30 shadow-sm shadow-cyan-900/20 bg-muted/50 cursor-pointer aspect-square sm:aspect-video">
                    <Image src={image.url}
                    width={400}
                    height={250}
                    unoptimized
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" alt={image.name || "Image"} />
                    {/* bottom name bar */}
                    <div className="absolute bottom-0 left-0 right-0 z-10 px-2 py-1.5 bg-muted/40">
                      <p className="text-[10px] text-white/90 font-medium line-clamp-1 drop-shadow">{image.name || "Image"}</p>
                    </div>
                    {/* hover overlay */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center backdrop-blur-[1px]">
                      <Button size="icon" variant="custom" className="size-8 rounded-full shadow-lg scale-50 group-hover:scale-100 transition-transform duration-200">
                        <DynamicIcon iconName="Eye" className="size-4" />
                      </Button>
                    </div>
                  </motion.div>
                )) : (
                  <p className="text-center text-muted-foreground col-span-full py-10">No images found!</p>
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
        <header className='relative min-h-[60vh] w-full items-center text-center sm:text-left flex sm:justify-start z-10 justify-center gap-8'>
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
                <Button variant="custom">Store images</Button>
              </Link>
              <Button variant="outline" 
              onClick={()=>scrollToFolderRef?.current?.scrollIntoView({behavior:"smooth",block:"start"})}
              >View folders</Button>
              </motion.div>
            </div>

          </motion.section>
          <motion.div
          initial={{opacity:0,x:10}}
          animate={{opacity:1,x:0}}
          transition={{duration:0.1,delay:0.95}}
          className="absolute inset-0 -z-10 pointer-events-none w-full h-full"
          >
            <Image 
            width={10000}
            height={10000}
            src="/hero-image-2.png"
            alt="image-lines"
            fetchPriority='high'
            className="w-full h-full object-cover"
            style={{
              maskImage: 'linear-gradient(to right, transparent 10%, black 60%), linear-gradient(to bottom, black 80%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 20%, black 60%), linear-gradient(to bottom, black 80%, transparent 100%)',
              maskComposite: 'intersect',
              WebkitMaskComposite: 'source-in'
            }}
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
                <DynamicIcon iconName='Image' className='size-5 text-cyan-500' />
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
      <InfiniteLinesWrapper childContClassName="py-2">
        <main className='w-full flex items-center scrollbar-hide overflow-x-auto gap-3 px-2'>
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
          recentImages.toReversed().map((image:any, i:number) => (
            <motion.div
            key={i}
            onClick={() => {
              setImagePreview(image.url);
              setImageName(image.name || "Image");
            }}
            initial={{opacity:0}}
            whileInView={{opacity:1}}
            viewport={{once:true}}
            exit={{opacity:0}}
            whileHover={{scale:1}}
            transition={{duration:0.12, type:"spring", stiffness:300, damping:22}}
            className="group relative w-20 h-20 sm:w-36 sm:h-36 flex-shrink-0 flex shadow-sm shadow-cyan-800 items-start overflow-hidden rounded-lg border border-cyan-800/20 bg-muted/50 cursor-pointer">
              <Image src={image.url}
              width={400}
              height={400}
              unoptimized
              className="aspect-square object-cover w-full h-full" alt={image.name || 'Image'} />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center backdrop-blur-[1px]">
                <Button size="icon" variant="custom" className="size-8 rounded-full shadow-md scale-50 group-hover:scale-100 transition-transform duration-200">
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

      {/* ── Image preview popup (modal - centered viewport overlay) ── */}
      <AnimatePresence mode='wait'>
      {
        imagePreview !== "" && (
        <motion.div
         initial={{opacity:0}}
         animate={{opacity:1}}
         exit={{opacity:0}}
         transition={{duration:0.2,ease:"easeInOut"}}
         onClick={()=>setImagePreview("")}
         className='w-full h-screen fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-[9999] p-4'>
            {/* Close button */}
            <motion.div
            initial={{opacity:0, scale:0.7}}
            animate={{opacity:1, scale:1}}
            exit={{opacity:0, scale:0.7}}
            transition={{duration:0.15, delay:0.05, type:"spring", stiffness:400, damping:22}}
            onClick={(e)=>{e.stopPropagation(); setImagePreview("");}}
            className='absolute top-3 right-3 z-10 bg-white/10 hover:bg-cyan-800/60 border border-white/20 hover:border-cyan-700/60 transition-all duration-200 backdrop-blur-sm p-2 rounded-full cursor-pointer group'>
              <DynamicIcon iconName="X" className='size-4 text-white group-hover:rotate-90 transition-transform duration-200'/>
            </motion.div>

            {/* Image card */}
            <motion.div
            initial={{opacity:0, scale:0.88, y:24}}
            animate={{opacity:1, scale:1, y:0}}
            exit={{opacity:0, scale:0.88, y:24}}
            transition={{duration:0.25, type:"spring", stiffness:320, damping:26}}
            onClick={(e)=>e.stopPropagation()}
            className='flex flex-col rounded-xl overflow-hidden border border-cyan-800/40 shadow-2xl shadow-black/60 max-w-4xl w-full max-h-[92vh]'>
              <div className='relative overflow-hidden flex-1'>
                <Image
                src={imagePreview}
                priority={true}
                fetchPriority='high'
                width={1200}
                height={800}
                unoptimized
                alt='image preview'
                className='object-contain w-full max-h-[80vh]'
                />
              </div>
              {/* Footer name bar */}
              <motion.div
              initial={{opacity:0, y:10}}
              animate={{opacity:1, y:0}}
              exit={{opacity:0, y:10}}
              transition={{duration:0.2, delay:0.12}}
              className="flex items-center justify-between gap-2 px-4 py-2.5 bg-black/60 backdrop-blur-sm border-t border-cyan-800/30">
                <div className="flex items-center gap-2 min-w-0">
                  <DynamicIcon iconName="Image" className="size-3.5 text-cyan-500 shrink-0" />
                  <p className="text-xs sm:text-sm font-semibold text-white/90 truncate">{imageName}</p>
                </div>
                <span className="text-[10px] text-white/40 shrink-0">Click outside to close</span>
              </motion.div>
            </motion.div>
        </motion.div>)
      }
      </AnimatePresence>

      <InfiniteLinesWrapper childContClassName="pt-8 pb-4">
        <div ref={scrollToFolderRef} className="flex justify-between items-end px-2">
          <div>
            <h1
            className='text-md sm:text-lg md:text-xl flex items-center gap-2 font-bold'>
              <DynamicIcon iconName='FolderOpen' className='size-5 text-cyan-500' />
              Folders <span className="text-muted-foreground font-normal text-sm ml-1">({folders? folders?.length : "loading..."})</span>
            </h1>
            <p className='text-xs sm:text-sm text-muted-foreground mt-1'>Organize your image library efficiently</p>
          </div>
          <Button onClick={()=>{router.push("/protected-dashboard/create-folder")}} variant="outline" size="sm" 
          className="hidden sm:flex bg-background sm:border-cyan-700">
            <DynamicIcon iconName="Plus" className="size-4 mr-2 text-cyan-500" />
            New Folder
          </Button>
        </div>
      </InfiniteLinesWrapper>
      
      <InfiniteLinesWrapper
      childContClassName='min-h-[50vh] overflow-y-auto mb-10'
      >
        <motion.main layout className='grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full'>
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

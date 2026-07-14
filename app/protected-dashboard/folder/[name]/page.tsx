'use client'
import React from 'react'
import InfiniteLinesWrapper from '@/components/hooks/InfiniteLinesWrapper'; 
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import DynamicIcon from '@/components/hooks/DynamicIcons';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Loader from "@/components/ui/self/Loader";
import { motion,AnimatePresence } from 'framer-motion';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from "sonner";
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { Drawer } from 'vaul';
import { xs,md,sm } from '@/components/hooks/MediaQueries';
interface Params {[key:string]: string}
interface Image  {
  id: number,
  url: string,
  name: string,
  publicId:string,
  createdAt: Date,
  updatedAt: Date,
}
interface FolderData {
  id:string,
  name:string,
  images:Image[]
}
const MotionDrawer = motion.create(Drawer.Root);
const MotionButton = motion.create(Button);
const MotionImage = motion.create(Image);


export default function FolderPage() {
  const params:Params = useParams();
  const [isMenuOpen,setIsMenuOpen] = React.useState<boolean>(false);
  const [isDeleteAll,setIsDeleteAll] = React.useState<boolean>(false);
  const [selectedImages,setSelectedImages] = React.useState<string[]>([]);
  const [isSelectMode,setIsSelectMode] = React.useState<boolean>(false);
  const [deleteLoading,setDeleteLoading] = React.useState<boolean>(false);
  const [allDeleteLoading,setAllDeleteLoading] = React.useState<boolean>(false);
  const folderName:string = decodeURIComponent(params.name as string);
  const imageLoaders = xs?6:sm?12:md?18:20
  const [imagePreview,setImagePreview] = React.useState<string>("");
  const [imageName,setImageName] = React.useState<string>("")
  const handleDeleteSelected = async (publicIds:string[])=>{
    const formData = new FormData();
    if(!publicIds || publicIds.length === 0) {
      toast.error("Please select at least one image!");
      return;
    }
    setDeleteLoading(true)
    publicIds.forEach(id => {
      formData.append("publicIds",id);
    });
    const toastId = toast.loading("Deleting images...");
    try {
      const res = await fetch('/api/trash-images',{method:'DELETE',body:formData})
      if(!res.ok)
        throw new Error("Failed to delete images!");
      const result = await res.json()
      mutate()
      toast.success("The images are deleted successfully!",{id:toastId})
    } catch (err:any) {
      toast.error(err.message || "Failed to delete images!",{id:toastId})
    } finally {
      setDeleteLoading(false);
      setSelectedImages([]);
      setIsSelectMode(false);
    }
  }
  
  const {data:response,isLoading:folderLoading,error:folderError,mutate} = useSWR(`/api/folder-images?folder-name=${encodeURIComponent(folderName)}`,fetcher)
  const folderData = response?.data as FolderData | undefined;
  if(folderError){
    toast.error("Failed to fetch folder images",{
      description: folderError.message
    })
  }
  const publicIds:string[] = folderData?.images.map(image => image.publicId) || [];
  const handleDeleteAll = async () =>{
    try {
      while(publicIds.length > 0) {
        setAllDeleteLoading(true)
      const toastId = toast.loading("Deleting all images...")
      if(publicIds.length === 0) {
        toast.error("No images to delete!",{id:toastId})
        return;
      }
      const imagesToDelete = publicIds.splice(0,7);
      const formData = new FormData();
      imagesToDelete.forEach(id => {
        formData.append("publicIds",id);
      });
      const res = await fetch("/api/trash-images",{
        method:"DELETE",
        body:formData
      })
      if(!res.ok){
        throw new Error("Failed to delete images!")
      }
      const result = await res.json()
      if(result.success){
        toast.success("The images are deleted successfully!",{id:toastId})
        mutate()
      }else{
        toast.error("Failed to delete images!",{id:toastId})
      }
    }
    }catch(err:any) {
      console.log(err)
    } finally {
      setAllDeleteLoading(false)
    }
  }
  return (
    <div>
      <MotionDrawer
      initial={{opacity:0}}
      animate={{opacity:1}}
      transition={{duration:0.1,type:"spring",damping:25,stiffness:400}} 
      open={isDeleteAll} onOpenChange={setIsDeleteAll}>
        <Drawer.Portal>
        <Drawer.Overlay className='z-50 fixed bg-muted/20 backdrop-blur-xs inset-0'/>
        <Drawer.Content className='max-w-md w-full z-50 fixed bottom-0 p-2 rounded-t-sm left-1/2 -translate-x-1/2 bg-background border'>
          <div className='w-10 h-2 rounded-sm bg-muted mx-auto' />
          <Drawer.Title className="text-md font-bold">Delete All Images</Drawer.Title>
          <Drawer.Description className="text-xs text-muted-foreground mb-4">
            Are you sure you want to delete all the images in this folder?
          </Drawer.Description>
          <section className='flex gap-2'>
            <Drawer.Close asChild>
              <Button variant="outline">Cancel</Button>
            </Drawer.Close>
            <Button variant="destructive" disabled={allDeleteLoading || folderData?.images.length === 0} onClick={handleDeleteAll}>
              {allDeleteLoading?"Deleting...":"Yes, delete all"}
            </Button>
          </section>
        </Drawer.Content>
        </Drawer.Portal>
        
      </MotionDrawer>
      <InfiniteLinesWrapper
      childContClassName={cn('relative')}
      parentContClassName='border-t'
      >
          <nav className='w-full flex items-center justify-between'>
            <Image 
            className='w-15 sm:w-20 object-contain'
            src={"/logo-2.png"} alt="logo" width={100} height={100} />
            <Link href={`/protected-dashboard/folder/${encodeURIComponent(folderName)}/add`}>
              <Button variant="custom" size={"sm"} className='md:scale-100 sm:scale-90 scale-75'><DynamicIcon iconName="Plus" className="mr-1.5 size-4"/>Add Images</Button>
            </Link>
          </nav>
      </InfiniteLinesWrapper>
      <InfiniteLinesWrapper parentContClassName='relative z-50' childContClassName='flex overflow-visible z-50 relative items-center justify-between p-2'>
          <Link href="/protected-dashboard" 
          className='p-1 flex justify-center group items-center sm:gap-1 md:gap-2'>
            <motion.div whileHover={{scale:1.05}} transition={{duration:0.05,ease:"easeInOut"}}
            className='rounded-xs p-0.5 scale-60 sm:scale-75 md:scale-90 flex transition-all duration-200 group-hover:-translate-x-1 group-active:-translate-x-2'>  
              <DynamicIcon iconName="ArrowLeft" className="text-cyan-500 group-hover:text-cyan-400 transition-colors" />
            </motion.div>
          <h1 className='text-[10px] sm:text-sm md:text-md font-semibold'>Folder <span className="text-cyan-500 font-bold">{folderName}</span></h1>
          </Link>
          <div className='relative flex items-center '>
          <AnimatePresence>
          {
            isSelectMode ? (
              <motion.div 
              layoutId='menu' 
              initial={{opacity:0,scale:0.8}} 
              animate={{opacity:1,scale:1}} 
              exit={{opacity:0,scale:0.8}} 
              transition={{duration:0.1,type:"spring",damping:25,stiffness:400}}
              className='flex gap-2'
              >
                <MotionButton onClick={()=>{setSelectedImages([]);setIsSelectMode(false);}}
                 layoutId="cancel" variant={"outline"} size={xs?"xs":"sm"}>
                  <DynamicIcon iconName="X" className='w-4 h-4'/>
                  Cancel
                </MotionButton>
                <MotionButton onClick={()=>{
                  handleDeleteSelected(selectedImages);
                }}
                  layoutId="delete" 
                  size={xs?"xs":"sm"} 
                  disabled={selectedImages.length === 0 || deleteLoading}
                  variant={"destructive"}>
                  <DynamicIcon iconName="Trash2" className='w-4 h-4'/>
                  Delete Selected
                </MotionButton>
              </motion.div>
            ):
            isMenuOpen ? 
            <motion.div 
            layoutId='menu' 
            initial={{opacity:0,y:-10}} 
            whileInView={{opacity:1,y:0}} 
            exit={{opacity:0,y:10}} 
            transition={{duration:0.1,type:"spring",damping:25,stiffness:400}} 
            className=' absolute right-0 top-0 bg-background border z-50 p-2 rounded-md flex gap-2 flex-col sm:min-w-[150px] md:min-w-[200px] shadow-lg'>
            <div className='flex justify-between items-center mb-1 pb-1 border-b'>
              <span className='text-xs font-semibold text-muted-foreground'>Menu</span>
              <div onClick={() => setIsMenuOpen(false)} className='cursor-pointer rounded-sm hover:bg-muted transition-colors p-1'>
                 <DynamicIcon iconName="X" className='w-4 h-4' />
              </div>
            </div>
            <Button variant={"destructive"} size={xs?"xs":"sm"} 
              onClick={()=>{setIsDeleteAll(true); setIsMenuOpen(false); }}
              className='w-full justify-start gap-2'> 
              <DynamicIcon iconName="Trash2" className='w-4 h-4'/> All</Button>
            <Button variant={"outline"} size={xs?"xs":"sm"} 
              onClick={()=>{setIsSelectMode(true); setIsMenuOpen(false); }}
              className='w-full justify-start gap-2 hover:text-cyan-500 hover:border-cyan-500/50 transition-colors'> 
              <DynamicIcon iconName="CheckSquare" className='w-4 h-4 text-cyan-500'/> Selected</Button>
          </motion.div>
          :
          <motion.div
          initial={{opacity:0,y:-10}} 
          whileInView={{opacity:1,y:0}} 
          exit={{opacity:0,y:10}} 
          transition={{duration:0.1,type:"spring",damping:25,stiffness:400}} 
          onClick={()=>{
            setIsMenuOpen((prev)=>!prev);
            console.log(isMenuOpen)
          }}
          layoutId="menu"
          className='rounded-sm p-1 transition-colors duration-200 hover:bg-muted/40 cursor-pointer'>
            <DynamicIcon iconName="MoreVertical" className="text-cyan-500 hover:text-cyan-400 transition-colors" />
          </motion.div>
          }
          </AnimatePresence>
          </div>
      </InfiniteLinesWrapper>
      <InfiniteLinesWrapper
      childContClassName='relative'
      >
        <motion.div layout
        className={cn("min-h-screen w-full gap-1.5 sm:gap-2.5 md:gap-4 p-1 sm:p-2 content-start",
        folderData?.images?.length !== 0 ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4" : "grid grid-cols-1"
        )}>
          <AnimatePresence mode='popLayout'>
          {
            !folderData?
            // Loader skeletons — landscape
            Array.from({length:12}).map((_,index)=>( 
              <motion.div
                className={cn(
                  index >= 6 && "hidden sm:block",
                  index >= 9 && "sm:hidden md:block",
                  "block"
                )}
                animate={{ opacity: [0.3,0.6,0.3,0.6] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: index * 0.05 }}
                key={"loading-container" + index}
              >
                <div className='relative border border-cyan-800/30 rounded-lg overflow-hidden aspect-video bg-muted'>
                  {/* shimmer name bar */}
                  <div className='absolute bottom-0 left-0 z-10 w-full h-7 bg-muted/60 animate-pulse' />
                </div>
              </motion.div>
            ))
            : folderData?.images?.length !== 0 ? folderData?.images?.toReversed().map((img,index)=>(
              <motion.div
              initial={{opacity:0, y:10}}
              animate={{opacity:1, y:0}}
              exit={{opacity:0, scale:0.95}}
              transition={{duration:0.18, delay: index * 0.03, type:"spring", stiffness:280, damping:22}}
              key={img.id}
              >
                <motion.div onClick={()=>{
                  if(!isSelectMode) {
                    setImagePreview(img.url as string);
                    setImageName(img.name as string)
                    return
                  }
                  const images = [...selectedImages];
                  if(images.includes(img.publicId as string)) {
                    setSelectedImages(images.filter(d => d !== img.publicId))
                  } else {
                    setSelectedImages([...images, img.publicId as string])
                  }
                }}
                layout
                key={img.publicId}
                whileHover={{scale:1.03, y:-2}}
                transition={{duration:0.12, type:"spring", stiffness:500, damping:22}}
                className='relative border border-cyan-800/30 shadow-sm shadow-cyan-900/20 cursor-pointer rounded-lg group overflow-hidden aspect-video'>
                  <MotionImage
                  layout
                  src={img.url}
                  alt={img.name}
                  className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
                  width={600}
                  height={400}
                  key={index}
                  unoptimized
                  />
                  {/* bottom name bar — always visible */}
                  <div className="absolute bottom-0 left-0 right-0 z-10 px-2 py-1.5 bg-muted/40">
                    <p className='text-[10px] sm:text-xs text-white/90 font-medium line-clamp-1 drop-shadow'>{img.name}</p>
                  </div>
                  {/* hover overlay with Eye */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center backdrop-blur-[1px]">
                    <Button size="icon" variant="custom" className="size-8 rounded-full shadow-lg scale-50 group-hover:scale-100 transition-transform duration-200">
                      <DynamicIcon iconName="Eye" className="size-4" />
                    </Button>
                  </div>
                  {
                    isSelectMode &&
                    <Checkbox checked={selectedImages.includes(img.publicId as string)}
                    className='rounded-full absolute bottom-2 right-2 scale-100 sm:scale-125'
                    />
                  }
                </motion.div>
              </motion.div>
            ))
            : (
              <div className="flex flex-col items-center justify-center border rounded-xl p-10 col-span-full">
                <Image src={"/no-image-question-mark.png"} alt="No images" fetchPriority='high' width={200} height={200} className="opacity-60" />
                <h3 className="text-sm mt-4 font-bold text-muted-foreground">No images found in this folder</h3>
                <p className='text-xs text-muted-foreground mt-1'>Click "Add Images" in the top right to get started.</p>
              </div>
            )
          }
          </AnimatePresence>
        </motion.div>
      </InfiniteLinesWrapper>
      <AnimatePresence mode='wait'>
      {
        imagePreview !== "" && (
        <motion.div
         initial={{opacity:0}}
         animate={{opacity:1}}
         exit={{opacity:0}}
         transition={{duration:0.2,ease:"easeInOut"}}
         onClick={()=>setImagePreview("")}
         className='w-full h-screen fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-[1000] p-4'>
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
    </div>
  )
}

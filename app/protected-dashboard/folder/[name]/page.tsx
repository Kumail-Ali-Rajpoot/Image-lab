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
            className='w-15 sm:w-20'
            src={"/logo.png"} alt="logo" width={100} height={100} />
            <Link href={`/protected-dashboard/folder/${encodeURIComponent(folderName)}/add`}>
              <Button size={"sm"} className='md:scale-100 sm:scale-90 scale-75'><DynamicIcon iconName="Image"/>Add Images</Button>
            </Link>
          </nav>
      </InfiniteLinesWrapper>
      <InfiniteLinesWrapper parentContClassName='relative z-50' childContClassName='flex overflow-visible z-50 relative items-center justify-between p-2'>
          <Link href="/protected-dashboard" 
          className='p-1 flex justify-center group items-center sm:gap-1 md:gap-2'>
            <motion.div whileHover={{scale:1.05}} transition={{duration:0.05,ease:"easeInOut"}}
            className='rounded-xs p-0.5 scale-60 sm:scale-75 md:scale-90 flex transition-all duration-200 group-hover:-translate-x-1 group-active:-translate-x-2'>  
              <DynamicIcon iconName="ArrowLeft"/>
            </motion.div>
          <h1 className='text-[10px] sm:text-sm md:text-md font-semibold'>Folder {folderName}</h1>
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
              className='w-full justify-start gap-2'> 
              <DynamicIcon iconName="Trash" className='w-4 h-4'/> Selected</Button>
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
            <DynamicIcon iconName="Menu"/>
          </motion.div>
          }
          </AnimatePresence>
          </div>
      </InfiniteLinesWrapper>
      <InfiniteLinesWrapper
      childContClassName='relative'
      >
        <motion.div layout
        className={cn("min-h-screen w-full gap-0.5 sm:gap-2 md:gap-4 p-0.5 sm:p-2 content-start",
        folderData?.images?.length !== 0 ? "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5" : "grid grid-cols-1"
        )}>
          <AnimatePresence mode='popLayout'>
          {
            !folderData?
            // Loader which shows when data is fetching for images
            Array.from({length:15}).map((_,index)=>( 
              <motion.div
                className={cn(
                  index >= 6 && "hidden sm:block",
                  index >= 12 && "sm:hidden md:block",
                  index >= 18 && "md:hidden lg:block",
                  "block"
                )}
                animate={{
                  opacity: [0.3,0.6,0.3,0.6],
                }}
                transition={{
                duration: 2,
                repeat: Infinity,
               ease: "easeInOut",
               delay: (index) * 0.05,
              }}
              key={"loading-container" + index}
              >
                <motion.div 
                key={"loading"+index}
                whileHover={{scale:1.05}} transition={{duration:0.1,type:"spring", stiffness:600, damping:25}} 
                className='relative border rounded-sm overflow-hidden aspect-video'>
                  <section className='p-0.5 sm:p-1 text-[10px] sm:text-xs absolute top-0 left-0 z-10 w-full bg-muted/20'>
                    <p className='line-clamp-1'></p>
                  </section>
                  <div
                  className='w-full h-full bg-muted object-cover'
                  />
                </motion.div>
              </motion.div>
            ))
            : folderData?.images?.length !== 0 ? folderData?.images?.toReversed().map((img,index)=>(
              // The images data preview of all images in a folder
              <motion.div
              initial={{opacity:0, scale:0.98}}
              animate={{opacity:1, scale:1}}
              exit={{opacity:0, scale:0}}
              transition={{duration:0.1,delay:0.1,ease:"easeInOut"}}
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
                        const newImagesData = images.filter(data=> data !== img.publicId)
                        setSelectedImages(newImagesData)
                      }else{
                        images.push(img.publicId as string)
                        setSelectedImages(images)
                      }
                      console.log(selectedImages)
                    }}
                layout
                key={img.publicId}
                whileHover={{scale:1.05}} transition={{duration:0.1,type:"spring", stiffness:600, damping:25}} 
                className='relative border cursor-pointer rounded-sm group-container group aspect-square'>
                  <section className='p-0.5 sm:p-1 text-[10px] sm:text-xs absolute top-0 left-0 z-10 w-full bg-muted/20'>
                    <p className='line-clamp-1'>{img.name}</p>
                  </section>
                  <MotionImage
                  layout
                  src={img.url} 
                  alt={"Image"}
                  className='w-full h-full group-hover:blur-sm object-cover'
                  width={400}
                  height={400}
                  key={index}
                  unoptimized
                  />
                  <div className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                    <Button size="icon" variant="secondary" className="size-8 rounded-full shadow-md scale-50 group-hover:scale-100 transition-transform duration-300">
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
              <div className="flex flex-col items-center justify-center border">
                    <Image src={"/no-image-question-mark.png"} alt="Image question mark" fetchPriority='high' width={400} height={400} />
                    <h3 className="text-sm p-2 font-bold text-muted-foreground">No images data found in this folder!</h3>
                    <p className='text-xs text-muted-foreground p-2'>To add images click on "Add Images" button in the top right corner!</p>
                  </div>
            )
          }
          </AnimatePresence>
        </motion.div>
      </InfiniteLinesWrapper>
      <AnimatePresence mode='wait'>
      {
        imagePreview !== "" ? imagePreview &&
        
        (<motion.div
         initial={{opacity:0,filter:"blur(10px)",clipPath:"inset(20% 0 20% 0)"}}
         animate={{opacity:1,filter:"blur(0px)",clipPath:"inset(0% 0 0% 0)"}}
         exit={{opacity:0,filter:"blur(10px)",clipPath:"inset(20% 0 20% 0)"}}
         transition={{duration:0.3,ease:"easeInOut"}}
         className='w-full h-screen fixed overflow-y-auto flex justify-center top-0 left-0 bg-background/40 backdrop-blur-xs py-4 px-8 z-[1000]'>
            <motion.div
            initial={{scale:0}}
            animate={{scale:1}}
            transition={{duration:0.3,delay:0.05}}
            exit={{scale:0,transition:{duration:0.1}}}
            onClick={()=>setImagePreview("")}
            className='absolute top-2 right-2 group z-10 bg-white/10 hover:bg-white/50 transition-all duration-300 backdrop-blur-xs p-2 rounded-full cursor-pointer'>
              <DynamicIcon iconName="X" className='group-hover:scale-125 transition-all duration-300'/>
            </motion.div>
            <motion.div 
            initial={{scale:0.5}}
            animate={{scale:1}}
            transition={{duration:0.4}}
            exit={{scale:0.5,transition:{duration:0.2}}}
            className='flex flex-col gap-2'>
              <Image src={imagePreview} priority={true} 
              fetchPriority='high' 
              width={1000}
              height={1000}
              unoptimized
              alt='image preview' 
              className='object-contain w-full max-h-[99%]'/>
              <motion.section 
              initial={{clipPath:"inset(20% 0 20% 0)", opacity:0}}
              animate={{clipPath:"inset(0% 0 0% 0)", opacity:1}}
              transition={{duration:0.3,delay:0.2}}
              exit={{clipPath:"inset(20% 0 20% 0)", opacity:0,transition:{duration:0.1}}}
              className="w-md bg-card flex flex-col gap-2">
                <h3 className="text-md p-2 font-bold">{imageName}</h3>
              </motion.section>  
              <br />
            </motion.div>
        </motion.div>)
        : ""
      }
      </AnimatePresence>
    </div>
  )
}

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

const MotionButton = motion.create(Button);
const MotionImage = motion.create(Image);
export default function FolderPage() {
  const params:Params = useParams();
  const [isMenuOpen,setIsMenuOpen] = React.useState(false);
  const [selectedImages,setSelectedImages] = React.useState<string[]>([]);
  const [isSelectMode,setIsSelectMode] = React.useState<boolean>(false);
  const [deleteDisabled,setDeleteDisabled] = React.useState<boolean>(true);
  const folderName:string = params.name;

  const handleDeleteSelected = async (publicIds:string[])=>{
      const formData = new FormData();
      if(!publicIds || publicIds.length === 0) {
        toast.error("Please select at least one image!");
        return;
      }
      setDeleteDisabled(true)
      publicIds.forEach(id => {
        formData.append("publicIds",id);
      });
      const toastId = toast.loading("Deleting images...");
      try {
        const res = await fetch('/api/trash-images',{method:'DELETE',body:formData})
        if(!res.ok)
          throw new Error("Failed to delete images!");
        const result = await res.json()
        mutate(`/api/folder-images/${folderName}`)
        toast.success("The images are deleted successfully!",{id:toastId})
      } catch (err:any) {
        toast.error(err.message || "Failed to delete images!",{id:toastId})
      } finally {
        setDeleteDisabled(false);
        setSelectedImages([]);
        setIsSelectMode(false);
      }
  }

  const {data:response,isLoading:folderLoading,error:folderError,mutate} = useSWR(`/api/folder-images?folder-name=${folderName}`,fetcher)
  const folderData = response?.data as FolderData | undefined;
  if(folderError){
    toast.error("Failed to fetch folder images",{
      description: folderError.message
    })
  }
  return (
    <div>
      <InfiniteLinesWrapper
      childContClassName={cn('relative')}
      parentContClassName='border-t'
      >
          <nav className='w-full flex items-center justify-between'>
            <Image 
            className='sm:w-20'
            src={"/logo.png"} alt="logo" width={100} height={100} />
            <Link href={`/protected-dashboard/folder/${folderName}/add`}>
              <Button size={"sm"}><DynamicIcon iconName="Image"/>Add Images</Button>
            </Link>
          </nav>
      </InfiniteLinesWrapper>
      <InfiniteLinesWrapper parentContClassName='relative z-50' childContClassName='flex overflow-visible z-50 relative items-center justify-between p-2'>
          <Link href="/protected-dashboard" 
          className='p-1 flex justify-center group items-center sm:gap-1 md:gap-2'>
            <motion.div whileHover={{scale:1.05}} transition={{duration:0.05,ease:"easeInOut"}}
            className='rounded-xs p-0.5 scale-60 sm:scale-75 md:scale-100 flex transition-all duration-200 group-hover:-translate-x-1 group-active:-translate-x-2'>  
              <DynamicIcon iconName="ArrowLeft"/>
            </motion.div>
          <h1 className='text-[10px] sm:text-sm md:text-md font-semibold'>Folder {folderName}</h1>
          </Link>
          <div className='relative flex items-center scale-60 sm:scale-100'>
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
                 layoutId="cancel" variant={"outline"} size={"sm"}>
                  <DynamicIcon iconName="X" className='w-4 h-4'/>
                  Cancel
                </MotionButton>
                <MotionButton onClick={()=>{
                  handleDeleteSelected(selectedImages);
                  setSelectedImages([]);
                  setIsSelectMode(false);
                }}
                  layoutId="delete" 
                  size={"sm"} 
                  disabled={deleteDisabled}
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
            className='absolute right-0 top-0 bg-background border z-50 p-2 rounded-md flex gap-2 flex-col min-w-[160px] shadow-lg'>
            <div className='flex justify-between items-center mb-1 pb-1 border-b'>
              <span className='text-xs font-semibold text-muted-foreground'>Menu</span>
              <div onClick={() => setIsMenuOpen(false)} className='cursor-pointer rounded-sm hover:bg-muted transition-colors p-1'>
                 <DynamicIcon iconName="X" className='w-4 h-4' />
              </div>
            </div>
            <Button variant={"destructive"} size={"sm"} 
              className='w-full justify-start gap-2'> 
              <DynamicIcon iconName="Trash2" className='w-4 h-4'/> All</Button>
            <Button variant={"outline"} size={"sm"} 
              onClick={()=>{setIsSelectMode(true); setIsMenuOpen(false)}}
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
              <motion.div 
              initial={{opacity:0}}
              animate={{opacity:1}}
              exit={{opacity:0}}
              transition={{duration:0.1,ease:"easeInOut"}}
               key={`loader`} className='flex col-span-full border h-40 items-center justify-center'>
                <Loader />
              </motion.div>
            : folderData?.images?.length !== 0 ? folderData?.images?.map((img,index)=>(
              <motion.div
              initial={{opacity:0, scale:0.98}}
              animate={{opacity:1, scale:1}}
              exit={{opacity:0, scale:0}}
              transition={{duration:0.1,delay:0.1,ease:"easeInOut"}}
              key={img.id}
              >
                <motion.div onClick={()=>{
                  if(!isSelectMode) return;
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
                className='relative border rounded-sm overflow-hidden aspect-video'>
                  <section className='p-0.5 sm:p-1 text-[10px] sm:text-xs absolute top-0 left-0 z-10 w-full bg-muted/20'>
                    <p className='line-clamp-1'>{img.name}</p>
                  </section>
                  <MotionImage
                  layout
                  src={img.url} 
                  alt={"Image"}
                  className='w-full h-full object-cover'
                  width={400}
                  height={400}
                  key={index}
                  unoptimized
                  />
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
    </div>
  )
}

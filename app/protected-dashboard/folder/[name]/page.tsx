'use client'
import React from 'react'
import InfiniteLinesWrapper from '@/components/hooks/InfiniteLinesWrapper'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import DynamicIcon from '@/components/hooks/DynamicIcons'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Loader from "@/components/ui/self/Loader"
import { motion,AnimatePresence } from 'framer-motion';

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
export default function FolderPage() {
  const params:Params = useParams();
  const [folderData, setFolderData] = React.useState<FolderData | null>(null);
  const folderName:string = params.name;
  React.useEffect(()=>{

    const formData = new FormData();
    formData.append("folder-name",folderName);
    fetch('/api/folder-images',{
      method:'POST',
      body: formData
    }).then(res => {
      if(!res.ok)
        throw new Error("Failed to fetch folder data!")
      return res.json()
    })
      .then(res => setFolderData(res.data as FolderData))
      .catch(err => console.log(err));
  },[folderName])

  return (
    <div>
      <InfiniteLinesWrapper
      childContClassName={cn('relative')}
      parentContClassName='border-t'
      >
          <nav className='w-full flex items-center justify-between'>
            <h1><Image src={"/logo.png"} alt="logo" width={100} height={100} /></h1>
            <Link href={`/protected-dashboard/folder/${folderName}/add`}>
              <Button><DynamicIcon iconName="Image"/>Add Images</Button>
            </Link>
          </nav>
      </InfiniteLinesWrapper>
      <InfiniteLinesWrapper childContClassName='flex items-center gap-2'>
          <Link href="/protected-dashboard" 
          className='p-1 flex justify-center items-center gap-2'>
            <motion.div whileHover={{scale:1.05}} transition={{duration:0.05,ease:"easeInOut"}}
            className='rounded-xs p-0.5 flex'>  
              <DynamicIcon iconName="ArrowLeft"/>
            </motion.div>
          <h1 className='text-lg font-semibold'>Folder {folderName}</h1>
          </Link>
      </InfiniteLinesWrapper>
      <InfiniteLinesWrapper
      childContClassName='relative'
      >
        <div className={cn("min-h-screen w-full gap-4 p-2 space-y-4",
          folderData?.images?.length !== 0 ? "grid grid-cols-2md:grid-cols-3 xl:grid-cols-4" : "grid grid-cols-1"
        )}>
          <AnimatePresence mode='popLayout'>
          {
            !folderData? 
            Array.from({length:5}).map((d,i)=>(
              <motion.div 
              initial={{opacity:0}}
              animate={{opacity:1}}
              exit={{opacity:0}}
              transition={{duration:0.1,ease:"easeInOut"}}
               key={`loader-${i}`} className='flex border items-center justify-center'>
                <Loader />
              </motion.div>
            ))
            : folderData?.images?.length !== 0 ? folderData?.images?.map((img,index)=>(
              <motion.div
              initial={{opacity:0, scale:0.98}}
              animate={{opacity:1, scale:1}}
              exit={{opacity:0, scale:0}}
              transition={{duration:0.1,delay:0.1,ease:"easeInOut"}}
              key={img.id}
              >
                <motion.div whileHover={{scale:1.05}} transition={{duration:0.1,type:"spring", stiffness:200, damping:15}} 
                className='relative border rounded-sm overflow-hidden'>
                  <section className='p-1 text-sm absolute top-0 left-0 z-10 w-full bg-muted/20'>
                    <p className='line-clamp-1'>{img.name}</p>
                  </section>
                  <Image 
                  src={img.url} 
                  alt={"Image"}
                  className='w-full h-40'
                  width={400}
                  height={400}
                  key={index}
                  unoptimized
                  />
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
        </div>
      </InfiniteLinesWrapper>
    </div>
  )
}

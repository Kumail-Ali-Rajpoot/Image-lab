'use client'
import DynamicIcon from '@/components/hooks/DynamicIcons'
import React from 'react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import Image from 'next/image'
import { fetcher } from '@/lib/fetcher'
import useSWR from 'swr'
interface props {
    idx: any,
    folderName: string,
    numImages: number,
}

export default function Folder({idx, folderName, numImages}: props) {
  const {data:folderImages, isLoading:isFolderImagesLoading,error:folderImagesError} = useSWR(`/api/folder-images?folder-name=${encodeURIComponent(folderName)}&numOfImages=4`,fetcher);
  const images = folderImages?.data?.images || [];
  if(folderImagesError)
    toast.error("The folder images are not fetched");
  return (
    <motion.div
      initial={{opacity:0}}
      whileInView={{opacity:1}}
      viewport={{once:true}}
      exit={{opacity:0}}
      transition={{duration:0.1,type:"spring",stiffness:100,damping:15}}>
    <Link 
      href={`/protected-dashboard/folder/${folderName}`}
      className={cn(
        'flex flex-col p-2 border-b hover:bg-accent/20 cursor-pointer border-l',
        'active:bg-accent/40 block w-full',
        'no-underline text-inherit'
      )}
    >
        <div className='flex items-center line-clamp-1 justify-between'>
          {/* Folder Name */}
            <p className='flex items-center gap-2 text-xs line-clamp-1 sm:text-sm capitalize'>
              <DynamicIcon iconName='Folder' className='size-3 sm:size-5' />
              {folderName}
            </p>
            <p className='text-xs text-muted-foreground'>images: {images?.length || 0}</p>
        </div>
        <div className='border-t mt-1'>
              <p className='text-xs py-2 text-muted-foreground'>The images store in this folder</p>
            <div className='flex gap-2 overflow-x-hidden border-t py-2'>
                {images.length !==0 ? images.map((img:any,i:number)=>(
                  <Image
                  key={i}
                  width={100}
                  height={100}
                  unoptimized
                  fetchPriority='low'
                  src={img.url}
                  className='size-10 rounded'
                  alt={`Image ${i}` }/>
                )) :
                (
                  <div className='flex items-center gap-1'>
                    <div className='size-10 rounded bg-muted'/>
                    <div className='size-10 rounded bg-muted'/>
                    <div className='size-10 rounded bg-muted'/>
                  </div>
                )
                }
            </div>
        </div>
    </Link>
    </motion.div>
  )
}

export function FolderLoader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col p-2 border-b border-l w-full bg-background"
    >
      <div className="flex items-center justify-between">
        {/* Animated Folder Name Placeholder */}
        <div className="flex items-center gap-2">
          <div className="size-5 rounded bg-muted animate-pulse" />
          <motion.div 
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="h-4 w-24 bg-muted rounded" 
          />
        </div>
        {/* Animated Count Placeholder */}
        <motion.div 
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          className="h-3 w-12 bg-muted rounded" 
        />
      </div>

      <div className="border-t mt-1">
        <motion.div 
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          className="h-3 w-40 bg-muted rounded my-3" 
        />
        
        <div className="flex gap-2 overflow-x-hidden border-t py-2">
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0.3 }}
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.1, // Staggered effect
              }}
              className="size-10 rounded bg-muted"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
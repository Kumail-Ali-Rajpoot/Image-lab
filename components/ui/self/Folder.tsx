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
      initial={{opacity:0, y:8}}
      whileInView={{opacity:1, y:0}}
      viewport={{once:true}}
      exit={{opacity:0}}
      transition={{duration:0.15, type:"spring", stiffness:200, damping:20}}
      >
    <Link 
      href={`/protected-dashboard/folder/${folderName}`}
      className={cn(
        'flex flex-col p-0 border border-cyan-800/40 shadow-sm shadow-cyan-900/20 hover:border-cyan-700/60 hover:shadow-cyan-700/20 cursor-pointer rounded-lg overflow-hidden transition-all duration-200',
        'active:scale-[0.98] block w-full',
        'no-underline text-inherit'
      )}
    >
        {/* Image preview grid — 2x2 landscape strips */}
        <div className='grid grid-cols-2 grid-rows-2 gap-px bg-cyan-800/10'>
          {images.length !== 0 ? images.slice(0,4).map((img:any, i:number) => (
            <div key={i} className='relative aspect-video overflow-hidden bg-muted'>
              <Image
              width={200}
              height={120}
              unoptimized
              fetchPriority='low'
              src={img.url}
              className='w-full h-full object-cover'
              alt={`Image ${i}`} />
            </div>
          )) : (
            Array.from({length:4}).map((_,i) => (
              <div key={i} className='aspect-video bg-muted/60' />
            ))
          )}
        </div>
        {/* Name + count bar */}
        <div className='flex items-center justify-between px-2.5 py-2 bg-background'>
          <p className='flex items-center gap-1.5 text-xs sm:text-sm font-semibold capitalize truncate'>
            <DynamicIcon iconName='Folder' className='size-3.5 sm:size-4 text-cyan-500 shrink-0' />
            {folderName}
          </p>
          <span className='text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full shrink-0 ml-1'>
            {images?.length || 0}
          </span>
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
      className="flex flex-col border border-cyan-800/30 rounded-lg overflow-hidden bg-background"
    >
      {/* image preview grid skeleton */}
      <div className="grid grid-cols-2 gap-px bg-cyan-800/10">
        {[1,2,3,4].map((i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 }}
            className="aspect-video bg-muted"
          />
        ))}
      </div>
      {/* name bar skeleton */}
      <div className="flex items-center justify-between px-2.5 py-2 bg-background">
        <div className="flex items-center gap-2">
          <div className="size-4 rounded bg-muted animate-pulse" />
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="h-3.5 w-24 bg-muted rounded"
          />
        </div>
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          className="h-4 w-6 bg-muted rounded-full"
        />
      </div>
    </motion.div>
  );
}
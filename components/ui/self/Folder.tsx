'use client'
import DynamicIcon from '@/components/hooks/DynamicIcons'
import React from 'react'
import { cn } from '@/lib/utils'
import Link from 'next/link' // Import Link

interface props {
    idx: any,
    folderName: string,
    numImages: number,
}

export default function Folder({idx, folderName, numImages}: props) {
  return (
    <Link 
      href={`/protected-dashboard/folder/${folderName}`}
      className={cn(
        'flex flex-col p-2 border-b hover:bg-accent/20 cursor-pointer border-l',
        'active:bg-accent/40 block w-full',
        'no-underline text-inherit'
      )}
    >
        <div className='flex items-center justify-between'>
            <p className='flex items-center gap-2'>
              <DynamicIcon iconName='Folder' className='size-5' />
              {folderName}
            </p>
            <p className='text-xs text-muted-foreground'>images: {numImages}</p>
        </div>
        <div className='border-t mt-1'> {/* Added a small margin top */}
            <h1 className='text-sm font-semibold'>Images</h1>
            <p className='text-xs text-muted-foreground'>The images store in this folder</p>
            <div className='flex gap-2 overflow-x-hidden border-t py-2'>
                <img
                 src="https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=300&auto=format&fit=crop"
                 className='size-10 rounded' // Added rounded for better look
                 alt="" />
                <img
                 src="https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=300&auto=format&fit=crop"
                 className='size-10 rounded'
                 alt="" />
                <img
                 src="https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=300&auto=format&fit=crop"
                 className='size-10 rounded'
                 alt="" />
            </div>
        </div>
    </Link>
  )
}
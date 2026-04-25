'use client'
import React from 'react'
import InfiniteLinesWrapper from '@/components/hooks/InfiniteLinesWrapper'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import DynamicIcon from '@/components/hooks/DynamicIcons'
import { useParams } from 'next/navigation'
export default function FolderPage() {
  const params = useParams()
  return (
    <div>
      <InfiniteLinesWrapper
      childContClassName={cn('relative')}
      parentContClassName='border-t'
      >
          <nav className='w-full flex items-center justify-between'>
            <h1><Image src={"/logo.png"} alt="logo" width={100} height={100} /></h1>
            <Button><DynamicIcon iconName="Image"/>Add Images</Button>
          </nav>
      </InfiniteLinesWrapper>
      <InfiniteLinesWrapper
      childContClassName='relative'
      >
        <div className='h-screen w-full grid grid-cols-4 p-2'>

        </div>
      </InfiniteLinesWrapper>
    </div>
  )
}

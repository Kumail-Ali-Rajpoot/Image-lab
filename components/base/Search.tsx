'use client'
import React from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import DynamicIcon from '../hooks/DynamicIcons'
import ListItem from '../ui/self/ListItem'
import { cn } from '@/lib/utils'
export function FolderSearch({isSearch = false}: {isSearch?: boolean}) {
  const [isSearchOpen, setIsSearchOpen] = React.useState<boolean>(isSearch);
  return (
    <div className={cn('fixed h-screen top-0 w-full z-10 bg-card/10 backdrop-blur-xs', isSearchOpen ? 'block' : 'hidden')}>
        <div className='fixed z-20 top-1/2 translate-y-[-50%] left-[50%] translate-x-[-50%] max-w-xl w-full bg-card rounded-sm border border-border p-2'>
            <header className="p-1 md:p-2">
                <h1 className='lg:text-xl text-md md:text-lg font-bold'>Search in folders</h1>
                <p className='text-xs md:text-sm text-muted-foreground'>Search for folders easily where you store your image</p>
            </header>
            <main>
                <div className="flex border-b p-1 md:p-2 items-center gap-2">
                    <Input type="text" placeholder="Search folders" />
                    <Button>
                        <DynamicIcon iconName="Search" className="size-4" />
                    </Button>
                </div>
                <section className='p-2'>
                    <h1 className='font-mono leading-tight text-sm text-muted-foreground'>Results are found:</h1>
                    <main className="flex flex-col gap-2 max-h-[40vh] h-full overflow-y-auto">
                        <ListItem />
                        <ListItem />
                        <ListItem />
                        <ListItem />
                        <ListItem />
                        <ListItem />
                        <ListItem />
                        <ListItem />
                        <ListItem />
                        <ListItem />
                        <ListItem />
                        <ListItem />
                    </main>
                </section>
            </main>
        </div>
    </div>
  )
}
'use client'
import React from 'react'
import DynamicIcon from '@/components/hooks/DynamicIcons'
import { motion } from 'framer-motion'
export default function ListItem() {
  return (
    <motion.div 
    whileHover={{backgroundColor: "var(--muted)"}}
    transition={{duration: 0.1}}
    className='flex justify-between  p-2 rounded-sm'>
        <section className='flex items-center gap-2'>
            <DynamicIcon iconName='FolderOpen' className='size-4' />
            <h1 className='text-sm font-medium'>Kumail Images</h1>
        </section>
        <section className='flex gap-2 text-sm items-center'>
            <DynamicIcon iconName='ImageIcon' className='size-4' /> 20
        </section>
    </motion.div>
  )
}
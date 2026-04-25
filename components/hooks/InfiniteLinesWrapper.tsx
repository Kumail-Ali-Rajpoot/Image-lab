'use client'
import React from 'react'
import { cn } from '@/lib/utils'
import { motion } from "framer-motion";
interface props {
    children: any,
    parentContClassName?:string,
    childContClassName?:string,
    parentStyle?:React.CSSProperties
    childStyle?:React.CSSProperties
}
export default function InfiniteLinesWrapper({children,parentContClassName,childContClassName,childStyle,parentStyle}:props) {
  return (
    <motion.div 
    initial={{opacity:0,filter:"blur(2px)"}} 
    whileInView={{opacity:1,filter:"blur(0px)"}} 
    transition={{duration: 0.5,delay:0.1}}
    viewport={{once:true}}
    style={parentStyle}
    className={cn('border-b w-full flex justify-center',parentContClassName)}>
        <div 
        style={childStyle}
        className={cn('max-w-7xl p-2 w-full border-x',childContClassName)}>
            {children}
        </div>
    </motion.div>
  )
}

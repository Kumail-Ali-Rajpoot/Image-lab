'use client'
import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from "framer-motion"
import Image from 'next/image'

interface props {
  imgUrl: string;
  left?: string;
  right?: string;
  top?: string;
  bottom?: string;
  rotate?: string;
  size?: string;
  idx?: number;
}

export default function ImageContainer({ imgUrl, idx = 0, left, right, top, bottom, rotate = "0deg", size }: props) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Use a proxy to optimize external browser URLs and fix CORS/Lag
  const optimizedUrl = imgUrl.startsWith('http') 
    ? `https://wsrv.nl/?url=${encodeURIComponent(imgUrl)}&w=400&q=80` 
    : imgUrl;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, rotate: rotate }}
      animate={{ opacity: 1, scale: 1, rotate: rotate }}
      transition={{ 
        type: "spring", 
        stiffness: 150, // Slightly lower stiffness feels more "premium"
        damping: 18, 
        delay: idx * 0.08 // Shorter delay keeps the sequence tight
      }} 
      whileHover={{ 
        scale: 1.05,
        zIndex: 10, // Bring to front on hover
        transition: { duration: 0.2 } 
      }}
      className={cn(
        'absolute rounded-xl sm:scale-75 md:scale-100 scale-50 will-change-transform overflow-hidden shadow-2xl border border-white/10 z-0',
        left,
        right,
        top,
        bottom,
      )}
      style={{
        width: size || '150px',
        height: size || '150px',
      }}
    >  
      {/* We wrap the Image in a motion.div because motion.Image is 
         not a built-in Framer Motion component for Next.js Image 
      */}
      <motion.div 
        className="w-full h-full"
        whileHover={{ scale: 1.15 }}
        transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }} // Custom cubic-bezier
      >
        <Image 
          src={optimizedUrl}
          fill
          priority={idx < 4} // Load first few immediately
          className={cn(
            'object-cover transition-opacity duration-500',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoadingComplete={() => setIsLoaded(true)}
          alt="Decorative element"
          unoptimized={true} // Necessary for some external browser URLs
        />
      </motion.div>
    </motion.div>
  )
}
"use client"

import * as React from "react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"
import { AnimatePresence,motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { CheckIcon } from "lucide-react"

const MotionIndicator = motion.create(CheckboxPrimitive.Indicator);

function Checkbox({
  className,
  checked,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      checked={checked} // Pass it through
      className={cn(
        "peer relative flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-input shadow-xs transition-shadow outline-none group-has-disabled/field:opacity-50 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary",
        className
      )}
      {...props}
    >
      {/* 2. Wrap the indicator logic in AnimatePresence to handle exit animations */}
      <AnimatePresence initial={false}>
        {checked && (
          <MotionIndicator
            data-slot="checkbox-indicator"
            // Keep original layout classes, remove transition-none
            className="grid place-content-center text-current [&>svg]:size-3.5"
            forceMount // Important: let framer-motion handle mounting, not Radix
            
            // 3. Define the animations
            initial={{ opacity: 0, scale: 0.8 }}   // Where it starts (from 0)
            animate={{ opacity: 1, scale: 1 }}     // Where it ends (show)
            exit={{ opacity: 0, scale: 0.8 }}      // Where it goes (hide)
            
            // 4. (Optional) Customize the speed/feel
            transition={{ duration: 0.3, type:"spring",damping:20,stiffness:200 }}
          >
            <CheckIcon />
          </MotionIndicator>
        )}
      </AnimatePresence>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }

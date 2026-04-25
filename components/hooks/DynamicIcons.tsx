'use client'
import React from 'react'
import * as icons from "lucide-react"

interface DynamicIconProps {
  iconName: string;
  size?: number;
  className?: string;
}

export default function DynamicIcon({ iconName, size = 24, className = "" }: DynamicIconProps) {
  const LucideIcon = icons[iconName as keyof typeof icons] as React.ElementType;

  if (!LucideIcon) {
    console.warn(`Icon "${iconName}" does not exist in lucide-react`);
    return <icons.HelpCircle size={size} className={className} />;
  }

  return <LucideIcon size={size} className={className} />;
}
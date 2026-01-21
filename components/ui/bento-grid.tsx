'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface BentoGridProps {
  children: React.ReactNode
  className?: string
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div className={cn(
      "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",
      className
    )}>
      {children}
    </div>
  )
}

interface BentoBoxProps {
  children: React.ReactNode
  title?: string
  description?: string
  icon?: React.ReactNode
  className?: string
  onClick?: () => void
}

export function BentoBox({ 
  children, 
  title, 
  description, 
  icon, 
  className,
  onClick 
}: BentoBoxProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-card border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm",
        "hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02]",
        "transition-all duration-200 cursor-pointer",
        onClick && "hover:bg-accent",
        className
      )}
    >
      {icon && (
        <div className="mb-4">
          {icon}
        </div>
      )}
      
      {title && (
        <h3 className="font-semibold text-lg text-foreground mb-2">
          {title}
        </h3>
      )}
      
      {description && (
        <p className="text-muted-foreground text-sm">
          {description}
        </p>
      )}
      
      {children}
    </div>
  )
}

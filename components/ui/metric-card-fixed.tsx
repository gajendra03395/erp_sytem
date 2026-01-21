'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface MetricCardProps {
  title: string
  value: string | number
  change?: string | number
  changeType?: 'increase' | 'decrease' | 'neutral'
  icon?: React.ReactNode
  description?: string
  className?: string
}

export function MetricCard({ 
  title, 
  value, 
  change, 
  changeType = 'neutral',
  icon, 
  description,
  className 
}: MetricCardProps) {
  const getChangeColor = () => {
    switch (changeType) {
      case 'increase':
        return 'text-green-600 dark:text-green-400'
      case 'decrease':
        return 'text-red-600 dark:text-red-400'
      default:
        return 'text-muted-foreground'
    }
  }

  const getChangeIcon = () => {
    switch (changeType) {
      case 'increase':
        return '↑'
      case 'decrease':
        return '↓'
      default:
        return ''
    }
  }

  return (
    <div className={cn(
      "bg-card border border-gray-200 dark:border-gray-800 rounded-2xl p-6",
      className
    )}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-foreground">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {icon && (
          <div className="text-muted-foreground">
            {icon}
          </div>
        )}
      </div>
      
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-foreground">{value}</span>
        {change && (
          <span className={cn("text-sm font-medium", getChangeColor())}>
            {getChangeIcon()}{change}
          </span>
        )}
      </div>
    </div>
  )
}

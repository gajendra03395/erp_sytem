'use client'

import { AlertTriangle, X } from 'lucide-react'
import { useState } from 'react'
import { useTheme } from '@/components/providers/ThemeProvider'

interface AlertProps {
  message: string
  type?: 'warning' | 'error' | 'success' | 'info'
  onClose?: () => void
}

export function Alert({ message, type = 'warning', onClose }: AlertProps) {
  const { theme } = useTheme()
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  const handleClose = () => {
    setIsVisible(false)
    onClose?.()
  }

  const typeStyles = {
    warning: {
      bg: theme === 'dark' ? 'bg-yellow-900/20' : 'bg-yellow-50',
      border: theme === 'dark' ? 'border-yellow-700' : 'border-yellow-300',
      text: theme === 'dark' ? 'text-yellow-400' : 'text-yellow-800',
      icon: 'text-yellow-500',
    },
    error: {
      bg: theme === 'dark' ? 'bg-red-900/20' : 'bg-red-50',
      border: theme === 'dark' ? 'border-red-700' : 'border-red-300',
      text: theme === 'dark' ? 'text-red-400' : 'text-red-800',
      icon: 'text-red-500',
    },
    success: {
      bg: theme === 'dark' ? 'bg-green-900/20' : 'bg-green-50',
      border: theme === 'dark' ? 'border-green-700' : 'border-green-300',
      text: theme === 'dark' ? 'text-green-400' : 'text-green-800',
      icon: 'text-green-500',
    },
    info: {
      bg: theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50',
      border: theme === 'dark' ? 'border-blue-700' : 'border-blue-300',
      text: theme === 'dark' ? 'text-blue-400' : 'text-blue-800',
      icon: 'text-blue-500',
    },
  }

  const styles = typeStyles[type]

  return (
    <div
      className={`
        ${styles.bg} ${styles.border} ${styles.text}
        border rounded-lg p-4 flex items-start gap-3
        animate-in slide-in-from-top-5 duration-300
      `}
    >
      <AlertTriangle className={`${styles.icon} flex-shrink-0 mt-0.5`} size={20} />
      <p className="flex-1 text-sm font-medium">{message}</p>
      {onClose && (
        <button
          onClick={handleClose}
          className={`
            ${styles.text} hover:opacity-70 transition-opacity
            flex-shrink-0
          `}
        >
          <X size={18} />
        </button>
      )}
    </div>
  )
}

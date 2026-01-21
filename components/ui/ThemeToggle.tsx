'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 w-full
        ${theme === 'dark'
          ? 'text-industrial-dark-text hover:bg-industrial-dark-surface'
          : 'text-industrial-light-text hover:bg-gray-100'
        }
      `}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      <span className="font-medium">
        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
      </span>
    </button>
  )
}

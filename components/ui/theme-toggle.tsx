'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light')

  React.useEffect(() => {
    const root = window.document.documentElement
    const initialTheme = root.classList.contains('dark') ? 'dark' : 'light'
    setTheme(initialTheme)
  }, [])

  const toggleTheme = () => {
    const root = window.document.documentElement
    const newTheme = theme === 'light' ? 'dark' : 'light'
    
    root.classList.remove('light', 'dark')
    root.classList.add(newTheme)
    setTheme(newTheme)
    
    localStorage.setItem('theme', newTheme)
  }

  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    if (savedTheme) {
      const root = window.document.documentElement
      root.classList.remove('light', 'dark')
      root.classList.add(savedTheme)
      setTheme(savedTheme)
    }
  }, [])

  return (
    <button
      onClick={toggleTheme}
      className="inline-flex items-center justify-center rounded-md p-2 hover:bg-accent transition-colors"
    aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  )
}

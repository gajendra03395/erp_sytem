'use client'

import * as React from 'react'

const theme = {
  light: {
    background: 'hsl(0 0% 100%)',
    foreground: 'hsl(222.2 84% 4.9%)',
    card: 'hsl(0 0% 100%)',
    cardForeground: 'hsl(222.2 84% 4.9%)',
    popover: 'hsl(0 0% 100%)',
    popoverForeground: 'hsl(222.2 84% 4.9%)',
    primary: {
      DEFAULT: 'hsl(221.2 83.2% 53.3%)',
      foreground: 'hsl(210 40% 98%)',
    },
    secondary: {
      DEFAULT: 'hsl(210 40% 96%)',
      foreground: 'hsl(222.2 84% 4.9%)',
    },
    muted: {
      DEFAULT: 'hsl(210 40% 96%)',
      foreground: 'hsl(215.4 16.3% 46.9%)',
    },
    accent: {
      DEFAULT: 'hsl(210 40% 96%)',
      foreground: 'hsl(222.2 84% 4.9%)',
    },
    destructive: {
      DEFAULT: 'hsl(0 84.2% 60.2%)',
      foreground: 'hsl(210 40% 98%)',
    },
    border: 'hsl(214.3 31.8% 91.4%)',
    input: 'hsl(210 40% 96%)',
    ring: 'hsl(221.2 83.2% 53.3%)',
    chart: {
      '1': 'hsl(12 76% 61%)',
      '2': 'hsl(173 58% 39%)',
      '3': 'hsl(197 37% 24%)',
      '4': 'hsl(43 74% 66%)',
      '5': 'hsl(27 87% 67%)',
    },
  },
  dark: {
    background: 'hsl(222.2 84% 4.9%)',
    foreground: 'hsl(210 40% 98%)',
    card: 'hsl(222.2 84% 4.9%)',
    cardForeground: 'hsl(210 40% 98%)',
    popover: 'hsl(222.2 84% 4.9%)',
    popoverForeground: 'hsl(210 40% 98%)',
    primary: {
      DEFAULT: 'hsl(217.2 91.2% 59.8%)',
      foreground: 'hsl(222.2 84% 4.9%)',
    },
    secondary: {
      DEFAULT: 'hsl(217.2 32.6% 17.5%)',
      foreground: 'hsl(210 40% 98%)',
    },
    muted: {
      DEFAULT: 'hsl(217.2 32.6% 17.5%)',
      foreground: 'hsl(215.2 20.2% 65.1%)',
    },
    accent: {
      DEFAULT: 'hsl(217.2 32.6% 17.5%)',
      foreground: 'hsl(210 40% 98%)',
    },
    destructive: {
      DEFAULT: 'hsl(0 62.8% 30.6%)',
      foreground: 'hsl(210 40% 98%)',
    },
    border: 'hsl(217.2 32.6% 17.5%)',
    input: 'hsl(217.2 32.6% 17.5%)',
    ring: 'hsl(224.3 76.3% 94.1%)',
    chart: {
      '1': 'hsl(12 76% 61%)',
      '2': 'hsl(173 58% 39%)',
      '3': 'hsl(197 37% 24%)',
      '4': 'hsl(43 74% 66%)',
      '5': 'hsl(27 87% 67%)',
    },
  },
}

export type Theme = typeof theme

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: 'light' | 'dark' | 'system'
}

export function ThemeProvider({ children, defaultTheme = 'system' }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false)
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light')

  React.useEffect(() => {
    setMounted(true)
  }, [])

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

  if (!mounted) {
    return null
  }

  return (
    <div className={defaultTheme === 'dark' ? 'dark' : ''}>
      {children}
    </div>
  )
}

export function useTheme() {
  return React.useContext(React.createContext({ theme: 'light', toggleTheme: () => {} }))
}

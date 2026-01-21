'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import type { EmployeeRole } from '@/types/employee'

interface AuthContextType {
  currentRole: EmployeeRole | null
  userName: string | null
  userEmail: string | null
  employeeId: string | null
  setCurrentRole: (role: EmployeeRole) => void
  isAuthenticated: boolean
  login: (credentials: { email?: string; employeeId?: string; password: string }) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [currentRole, setCurrentRole] = useState<EmployeeRole | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [employeeId, setEmployeeId] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check if user is logged in (only on client side)
    if (typeof window !== 'undefined') {
      try {
        const token = localStorage.getItem('auth_token')
        const savedRole = localStorage.getItem('user_role') as EmployeeRole
        const savedName = localStorage.getItem('user_name')
        const savedEmail = localStorage.getItem('user_email')
        const savedEmployeeId = localStorage.getItem('employee_id')

        if (token && savedRole) {
          setIsAuthenticated(true)
          // Always set the role if it exists
          setCurrentRole(savedRole)
          setUserName(savedName)
          setUserEmail(savedEmail)
          setEmployeeId(savedEmployeeId)
        } else {
          setIsAuthenticated(false)
          // Redirect to login if not on auth page
          if (!pathname?.startsWith('/auth') && mounted) {
            router.push('/auth/login')
          }
        }
      } catch (error) {
        console.error('Auth provider error:', error)
        setIsAuthenticated(false)
        if (!pathname?.startsWith('/auth') && mounted) {
          router.push('/auth/login')
        }
      }
    }
  }, [pathname, mounted, router])

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      // Clear localStorage (only on client side)
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem('auth_token')
          localStorage.removeItem('user_role')
          localStorage.removeItem('user_name')
          localStorage.removeItem('user_email')
          localStorage.removeItem('employee_id')
        } catch (error) {
          console.error('LocalStorage clear error:', error)
        }
      }
      setIsAuthenticated(false)
      setCurrentRole(null)
      setUserName(null)
      setUserEmail(null)
      setEmployeeId(null)
      router.push('/auth/login')
    }
  }

  const login = async (credentials: { email?: string; employeeId?: string; password: string }) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Login failed')
      }

      const data = await response.json()
      
      // Save auth data to localStorage (only on client side)
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('auth_token', data.token)
          localStorage.setItem('user_role', data.user.role)
          localStorage.setItem('user_name', data.user.name)
          localStorage.setItem('user_email', data.user.email)
          localStorage.setItem('employee_id', data.user.employeeId)
        } catch (error) {
          console.error('LocalStorage error:', error)
        }
      }
      
      // Update state
      setIsAuthenticated(true)
      setCurrentRole(data.user.role)
      setUserName(data.user.name)
      setUserEmail(data.user.email)
      setEmployeeId(data.user.employeeId)
    } catch (error) {
      throw error
    }
  }

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <AuthContext.Provider
      value={{
        currentRole,
        userName,
        userEmail,
        employeeId,
        setCurrentRole,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  // Return context if available, otherwise return default/fallback
  if (context === undefined) {
    return {
      currentRole: 'OPERATOR' as const,
      userName: null,
      userEmail: null,
      employeeId: null,
      setCurrentRole: () => {},
      isAuthenticated: false,
      login: async () => {},
      logout: () => {},
    }
  }
  return context
}

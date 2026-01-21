import { useState, useEffect } from 'react'

interface User {
  id: string
  email: string
  role: string
  name: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Mock user for development
    setUser({
      id: '1',
      email: 'admin@erp.com',
      role: 'ADMIN',
      name: 'Admin User'
    })
  }, [])

  return { user }
}

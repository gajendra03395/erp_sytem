import type { NextRequest } from 'next/server'
import type { EmployeeRole } from '../../types/employee'

export interface AuthUser {
  id: string
  email: string
  employee_id: string
  role: EmployeeRole
  name: string
}

export function getAuthUser(request: NextRequest): AuthUser | null {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.replace('Bearer ', '').trim()
  if (!token) {
    return null
  }

  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const payload = JSON.parse(decoded)

    if (!payload?.employee_id || !payload?.role) {
      return null
    }

    return {
      id: payload.id,
      email: payload.email,
      employee_id: payload.employee_id,
      role: payload.role,
      name: payload.name,
    }
  } catch (error) {
    console.error('Failed to parse auth token:', error)
    return null
  }
}

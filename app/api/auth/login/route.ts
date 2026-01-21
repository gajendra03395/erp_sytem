import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { getStoredCredentials } from '@/lib/utils/credentials'
import { prisma } from '@/lib/db/prisma-client'
import bcrypt from 'bcryptjs'

// Mock user database with credentials (fallback)
const MOCK_USERS = [
  {
    id: '0',
    name: 'Super User',
    email: 'superuser@erp.com',
    employee_id: 'SUPER000',
    password: 'super123',
    role: 'SUPERUSER' as const,
  },
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@erp.com',
    employee_id: 'EMP001',
    password: 'admin123',
    role: 'ADMIN' as const,
  },
  {
    id: '2',
    name: 'John Operator',
    email: 'emp@erp.com',
    employee_id: 'EMP002',
    password: 'emp123',
    role: 'OPERATOR' as const,
  },
  {
    id: '3',
    name: 'Sarah Supervisor',
    email: 'supervisor@erp.com',
    employee_id: 'EMP003',
    password: 'supervisor123',
    role: 'SUPERVISOR' as const,
  },
]

export async function POST(request: NextRequest) {
  try {
    const { email, password, employee_id } = await request.json()

    // Validate input
    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }

    if (!email && !employee_id) {
      return NextResponse.json(
        { error: 'Email or Employee ID is required' },
        { status: 400 }
      )
    }

    let user = null

    // First try to find user in database
    try {
      const dbUser = await prisma.user.findFirst({
        where: {
          OR: [
            email ? { email } : {},
            employee_id ? { employee: { employeeId: employee_id } } : {}
          ].filter(condition => Object.keys(condition).length > 0)
        },
        include: {
          employee: true
        }
      })

      if (dbUser) {
        // Verify password
        const isValidPassword = await bcrypt.compare(password, dbUser.passwordHash)
        if (isValidPassword) {
          user = {
            id: dbUser.id,
            name: dbUser.employee?.name || 'Unknown',
            email: dbUser.email,
            employee_id: dbUser.employee?.employeeId || 'UNKNOWN',
            role: dbUser.role,
          }
        }
      }
    } catch (dbError) {
      console.log('Database user lookup failed, falling back to mock users')
    }

    // If not found in database, check mock users
    if (!user) {
      user = MOCK_USERS.find(
        (u) => (u.email === email || u.employee_id === employee_id) && u.password === password
      )
    }

    // If not in mock users, check stored credentials
    if (!user) {
      const storedCredentials = getStoredCredentials()
      user = storedCredentials.find(
        (u: any) => (u.email === email || u.employee_id === employee_id) && u.password === password
      ) as any
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Generate simple JWT token (for demo purposes)
    const token = Buffer.from(
      JSON.stringify({
        id: user.id,
        email: user.email,
        employee_id: user.employee_id,
        role: user.role,
        name: user.name,
        iat: Date.now(),
      })
    ).toString('base64')

    return NextResponse.json(
      {
        success: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          employee_id: user.employee_id,
          role: user.role,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    )
  }
}

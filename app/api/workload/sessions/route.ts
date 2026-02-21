import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma-client'

// Types for workload tracking
export interface WorkloadSession {
  id: string
  employeeId: string
  date: string
  startTime: string
  endTime?: string
  duration?: number
  activityType: 'working' | 'idle' | 'break' | 'meeting'
  taskType?: string
  efficiency?: number
  notes?: string
}

export interface WorkloadAnalytics {
  id: string
  employeeId: string
  period: 'daily' | 'weekly' | 'monthly'
  periodStart: string
  periodEnd: string
  totalHours: number
  workingHours: number
  idleHours: number
  breakHours: number
  efficiency: number
  productivity: number
  tasksCompleted: number
  overtimeHours: number
  score: number
}

export interface WorkloadPrediction {
  id: string
  employeeId: string
  predictionDate: string
  predictedHours: number
  actualHours?: number
  efficiency: number
  confidence: number
  riskLevel: 'low' | 'medium' | 'high'
  factors?: any
}

// GET /api/workload/sessions - Get workload sessions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const employeeId = searchParams.get('employeeId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const activityType = searchParams.get('activityType')

    // Try database first
    try {
      const sessions = await prisma.workloadSession.findMany({
        where: {
          ...(employeeId && { employeeId }),
          ...(startDate && endDate && {
            date: {
              gte: new Date(startDate),
              lte: new Date(endDate)
            }
          }),
          ...(activityType && { activityType })
        },
        include: {
          employee: {
            select: {
              id: true,
              name: true,
              email: true,
              department: true
            }
          }
        },
        orderBy: {
          date: 'desc'
        }
      })

      return NextResponse.json(sessions)
    } catch (dbError) {
      console.log('Database unavailable, using mock data for workload sessions')
      
      // Fallback mock data
      const mockSessions: WorkloadSession[] = [
        {
          id: '1',
          employeeId: 'emp_001',
          date: '2024-01-15T00:00:00Z',
          startTime: '2024-01-15T09:00:00Z',
          endTime: '2024-01-15T17:00:00Z',
          duration: 480,
          activityType: 'working',
          taskType: 'production',
          efficiency: 85,
          notes: 'Productive day on assembly line'
        },
        {
          id: '2',
          employeeId: 'emp_002',
          date: '2024-01-15T00:00:00Z',
          startTime: '2024-01-15T08:30:00Z',
          endTime: '2024-01-15T16:30:00Z',
          duration: 480,
          activityType: 'working',
          taskType: 'maintenance',
          efficiency: 92,
          notes: 'Completed scheduled maintenance'
        },
        {
          id: '3',
          employeeId: 'emp_001',
          date: '2024-01-14T00:00:00Z',
          startTime: '2024-01-14T09:00:00Z',
          endTime: '2024-01-14T12:00:00Z',
          duration: 180,
          activityType: 'working',
          taskType: 'production',
          efficiency: 78,
          notes: 'Morning shift only'
        }
      ]

      return NextResponse.json(mockSessions)
    }
  } catch (error) {
    console.error('Error fetching workload sessions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch workload sessions' },
      { status: 500 }
    )
  }
}

// POST /api/workload/sessions - Create workload session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { employeeId, startTime, endTime, activityType, taskType, notes } = body

    // Calculate duration
    const duration = endTime ? Math.floor((new Date(endTime).getTime() - new Date(startTime).getTime()) / (1000 * 60)) : null

    // Try database first
    try {
      const session = await prisma.workloadSession.create({
        data: {
          employeeId,
          date: new Date(startTime),
          startTime: new Date(startTime),
          endTime: endTime ? new Date(endTime) : null,
          duration,
          activityType,
          taskType,
          notes
        },
        include: {
          employee: {
            select: {
              id: true,
              name: true,
              email: true,
              department: true
            }
          }
        }
      })

      return NextResponse.json(session, { status: 201 })
    } catch (dbError) {
      console.log('Database unavailable, creating mock workload session')
      
      // Fallback mock response
      const mockSession = {
        id: `session_${Date.now()}`,
        employeeId,
        date: new Date(startTime).toISOString(),
        startTime,
        endTime,
        duration,
        activityType,
        taskType,
        notes,
        efficiency: Math.floor(Math.random() * 30) + 70, // Random efficiency 70-100
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        employee: {
          id: employeeId,
          name: 'Mock Employee',
          email: 'mock@company.com',
          department: 'production'
        }
      }

      return NextResponse.json(mockSession, { status: 201 })
    }
  } catch (error) {
    console.error('Error creating workload session:', error)
    return NextResponse.json(
      { error: 'Failed to create workload session' },
      { status: 500 }
    )
  }
}

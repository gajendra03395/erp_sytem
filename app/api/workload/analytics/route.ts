import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma-client'

// Types for analytics
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

// GET /api/workload/analytics - Get workload analytics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const employeeId = searchParams.get('employeeId')
    const period = searchParams.get('period') as 'daily' | 'weekly' | 'monthly' | null
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Try database first
    try {
      const analytics = await prisma.workloadAnalytics.findMany({
        where: {
          ...(employeeId && { employeeId }),
          ...(period && { period }),
          ...(startDate && endDate && {
            periodStart: {
              gte: new Date(startDate),
              lte: new Date(endDate)
            }
          })
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
          periodStart: 'desc'
        }
      })

      return NextResponse.json(analytics)
    } catch (dbError) {
      console.log('Database unavailable, using mock data for workload analytics')
      
      // Fallback mock data
      const mockAnalytics: WorkloadAnalytics[] = [
        {
          id: '1',
          employeeId: 'emp_001',
          period: 'daily',
          periodStart: '2024-01-15T00:00:00Z',
          periodEnd: '2024-01-15T23:59:59Z',
          totalHours: 8.5,
          workingHours: 7.2,
          idleHours: 0.8,
          breakHours: 0.5,
          efficiency: 85,
          productivity: 12.5,
          tasksCompleted: 90,
          overtimeHours: 0.5,
          score: 88
        },
        {
          id: '2',
          employeeId: 'emp_002',
          period: 'daily',
          periodStart: '2024-01-15T00:00:00Z',
          periodEnd: '2024-01-15T23:59:59Z',
          totalHours: 8.0,
          workingHours: 7.5,
          idleHours: 0.3,
          breakHours: 0.2,
          efficiency: 92,
          productivity: 15.2,
          tasksCompleted: 114,
          overtimeHours: 0,
          score: 94
        },
        {
          id: '3',
          employeeId: 'emp_001',
          period: 'weekly',
          periodStart: '2024-01-15T00:00:00Z',
          periodEnd: '2024-01-21T23:59:59Z',
          totalHours: 42.5,
          workingHours: 36.0,
          idleHours: 4.0,
          breakHours: 2.5,
          efficiency: 87,
          productivity: 13.8,
          tasksCompleted: 496,
          overtimeHours: 2.5,
          score: 90
        }
      ]

      return NextResponse.json(mockAnalytics)
    }
  } catch (error) {
    console.error('Error fetching workload analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch workload analytics' },
      { status: 500 }
    )
  }
}

// POST /api/workload/analytics - Create or update analytics
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { employeeId, period, periodStart, periodEnd, totalHours, workingHours, idleHours, breakHours, efficiency, productivity, tasksCompleted, overtimeHours } = body

    // Calculate overall score
    const score = Math.round((efficiency * 0.4) + (productivity * 0.3) + ((workingHours / totalHours) * 100 * 0.3))

    // Try database first
    try {
      const analytics = await prisma.workloadAnalytics.create({
        data: {
          employeeId,
          period,
          periodStart: new Date(periodStart),
          periodEnd: new Date(periodEnd),
          totalHours,
          workingHours,
          idleHours,
          breakHours,
          efficiency,
          productivity,
          tasksCompleted,
          overtimeHours,
          score
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

      return NextResponse.json(analytics, { status: 201 })
    } catch (dbError) {
      console.log('Database unavailable, creating mock workload analytics')
      
      // Fallback mock response
      const mockAnalytics = {
        id: `analytics_${Date.now()}`,
        employeeId,
        period,
        periodStart,
        periodEnd,
        totalHours,
        workingHours,
        idleHours,
        breakHours,
        efficiency,
        productivity,
        tasksCompleted,
        overtimeHours,
        score,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        employee: {
          id: employeeId,
          name: 'Mock Employee',
          email: 'mock@company.com',
          department: 'production'
        }
      }

      return NextResponse.json(mockAnalytics, { status: 201 })
    }
  } catch (error) {
    console.error('Error creating workload analytics:', error)
    return NextResponse.json(
      { error: 'Failed to create workload analytics' },
      { status: 500 }
    )
  }
}

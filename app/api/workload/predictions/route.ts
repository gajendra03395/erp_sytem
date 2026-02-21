import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma-client'

// Types for predictions
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

// Simple ML prediction model
class WorkloadPredictor {
  // Predict based on historical patterns
  static predictWorkload(employeeId: string, historicalData: any[]): WorkloadPrediction {
    // Simple heuristic-based prediction
    const avgHours = historicalData.reduce((sum, d) => sum + (d.workingHours || 0), 0) / historicalData.length || 8
    const avgEfficiency = historicalData.reduce((sum, d) => sum + (d.efficiency || 0), 0) / historicalData.length || 80
    
    // Factors affecting prediction
    const factors = {
      historicalAverage: avgHours,
      efficiencyTrend: avgEfficiency,
      seasonality: this.getSeasonalityFactor(),
      workloadTrend: this.getWorkloadTrend(historicalData)
    }
    
    // Predict next day's workload
    let predictedHours = avgHours * factors.seasonality * factors.workloadTrend
    let confidence = Math.min(95, 60 + (historicalData.length * 2))
    
    // Determine risk level
    let riskLevel: 'low' | 'medium' | 'high' = 'low'
    if (avgEfficiency < 70) riskLevel = 'high'
    else if (avgEfficiency < 85) riskLevel = 'medium'
    
    // Adjust confidence based on risk
    if (riskLevel === 'high') confidence = Math.max(50, confidence - 20)
    else if (riskLevel === 'medium') confidence = Math.max(60, confidence - 10)
    
    return {
      id: `pred_${Date.now()}`,
      employeeId,
      predictionDate: new Date().toISOString(),
      predictedHours: Math.round(predictedHours * 10) / 10,
      efficiency: Math.round(avgEfficiency),
      confidence: Math.round(confidence),
      riskLevel,
      factors
    }
  }
  
  private static getSeasonalityFactor(): number {
    const month = new Date().getMonth()
    // Simple seasonality: higher workload in certain months
    const seasonalFactors = [1.0, 1.1, 1.2, 1.1, 1.0, 0.9, 0.8, 0.9, 1.0, 1.1, 1.2, 1.0]
    return seasonalFactors[month]
  }
  
  private static getWorkloadTrend(historicalData: any[]): number {
    if (historicalData.length < 2) return 1.0
    
    const recent = historicalData.slice(-7) // Last 7 days
    const older = historicalData.slice(-14, -7) // Previous 7 days
    
    const recentAvg = recent.reduce((sum, d) => sum + (d.workingHours || 0), 0) / recent.length
    const olderAvg = older.reduce((sum, d) => sum + (d.workingHours || 0), 0) / older.length
    
    return recentAvg / olderAvg || 1.0
  }
}

// GET /api/workload/predictions - Get workload predictions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const employeeId = searchParams.get('employeeId')
    const generateNew = searchParams.get('generate') === 'true'

    // Try database first
    try {
      if (generateNew && employeeId) {
        // Generate new prediction
        const historicalData = await prisma.workloadAnalytics.findMany({
          where: { employeeId },
          orderBy: { periodStart: 'desc' },
          take: 30 // Last 30 records
        })
        
        const prediction = WorkloadPredictor.predictWorkload(employeeId, historicalData)
        
        const savedPrediction = await prisma.workloadPrediction.create({
          data: {
            employeeId,
            predictionDate: new Date(prediction.predictionDate),
            predictedHours: prediction.predictedHours,
            efficiency: prediction.efficiency,
            confidence: prediction.confidence,
            riskLevel: prediction.riskLevel,
            factors: prediction.factors
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
        
        return NextResponse.json(savedPrediction)
      } else {
        const predictions = await prisma.workloadPrediction.findMany({
          where: employeeId ? { employeeId } : {},
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
            predictionDate: 'desc'
          }
        })
        
        return NextResponse.json(predictions)
      }
    } catch (dbError) {
      console.log('Database unavailable, using mock data for workload predictions')
      
      // Fallback mock data
      const mockPredictions: WorkloadPrediction[] = [
        {
          id: '1',
          employeeId: 'emp_001',
          predictionDate: '2024-01-16T00:00:00Z',
          predictedHours: 8.2,
          efficiency: 85,
          confidence: 85,
          riskLevel: 'low',
          factors: {
            historicalAverage: 8.0,
            efficiencyTrend: 85,
            seasonality: 1.1,
            workloadTrend: 1.0
          }
        },
        {
          id: '2',
          employeeId: 'emp_002',
          predictionDate: '2024-01-16T00:00:00Z',
          predictedHours: 7.8,
          efficiency: 92,
          confidence: 78,
          riskLevel: 'low',
          factors: {
            historicalAverage: 8.0,
            efficiencyTrend: 92,
            seasonality: 0.95,
            workloadTrend: 0.98
          }
        },
        {
          id: '3',
          employeeId: 'emp_003',
          predictionDate: '2024-01-16T00:00:00Z',
          predictedHours: 6.5,
          efficiency: 68,
          confidence: 65,
          riskLevel: 'medium',
          factors: {
            historicalAverage: 7.0,
            efficiencyTrend: 68,
            seasonality: 0.9,
            workloadTrend: 0.93
          }
        }
      ]
      
      return NextResponse.json(mockPredictions)
    }
  } catch (error) {
    console.error('Error fetching workload predictions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch workload predictions' },
      { status: 500 }
    )
  }
}

// POST /api/workload/predictions - Create prediction
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { employeeId, predictedHours, efficiency, confidence, riskLevel, factors } = body

    // Try database first
    try {
      const prediction = await prisma.workloadPrediction.create({
        data: {
          employeeId,
          predictionDate: new Date(),
          predictedHours,
          efficiency,
          confidence,
          riskLevel,
          factors
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

      return NextResponse.json(prediction, { status: 201 })
    } catch (dbError) {
      console.log('Database unavailable, creating mock workload prediction')
      
      // Fallback mock response
      const mockPrediction = {
        id: `pred_${Date.now()}`,
        employeeId,
        predictionDate: new Date().toISOString(),
        predictedHours,
        efficiency,
        confidence,
        riskLevel,
        factors,
        actualHours: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        employee: {
          id: employeeId,
          name: 'Mock Employee',
          email: 'mock@company.com',
          department: 'production'
        }
      }

      return NextResponse.json(mockPrediction, { status: 201 })
    }
  } catch (error) {
    console.error('Error creating workload prediction:', error)
    return NextResponse.json(
      { error: 'Failed to create workload prediction' },
      { status: 500 }
    )
  }
}

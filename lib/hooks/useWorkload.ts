'use client'

import { useState, useEffect, useCallback } from 'react'
import { useEmployees } from '@/lib/hooks/useEmployees'

// Types for workload data
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
  employee?: {
    id: string
    name: string
    email: string
    department: string
  }
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
  employee?: {
    id: string
    name: string
    email: string
    department: string
  }
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
  employee?: {
    id: string
    name: string
    email: string
    department: string
  }
}

// Custom hooks for workload data
export function useWorkloadSessions(employeeId?: string, startDate?: string, endDate?: string) {
  const [sessions, setSessions] = useState<WorkloadSession[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSessions = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const params = new URLSearchParams()
      if (employeeId) params.append('employeeId', employeeId)
      if (startDate) params.append('startDate', startDate)
      if (endDate) params.append('endDate', endDate)
      
      const response = await fetch(`/api/workload/sessions?${params}`)
      if (!response.ok) throw new Error('Failed to fetch sessions')
      
      const data = await response.json()
      setSessions(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [employeeId, startDate, endDate])

  const createSession = async (sessionData: Partial<WorkloadSession>) => {
    try {
      const response = await fetch('/api/workload/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData)
      })
      
      if (!response.ok) throw new Error('Failed to create session')
      
      const newSession = await response.json()
      setSessions(prev => [newSession, ...prev])
      return newSession
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  useEffect(() => {
    fetchSessions()
  }, [employeeId, startDate, endDate])

  return { sessions, loading, error, refetch: fetchSessions, createSession }
}

export function useWorkloadAnalytics(employeeId?: string, period?: string) {
  const [analytics, setAnalytics] = useState<WorkloadAnalytics[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const params = new URLSearchParams()
      if (employeeId) params.append('employeeId', employeeId)
      if (period) params.append('period', period)
      
      const response = await fetch(`/api/workload/analytics?${params}`)
      if (!response.ok) throw new Error('Failed to fetch analytics')
      
      const data = await response.json()
      setAnalytics(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [employeeId, period])

  const createAnalytics = async (analyticsData: Partial<WorkloadAnalytics>) => {
    try {
      const response = await fetch('/api/workload/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(analyticsData)
      })
      
      if (!response.ok) throw new Error('Failed to create analytics')
      
      const newAnalytics = await response.json()
      setAnalytics(prev => [newAnalytics, ...prev])
      return newAnalytics
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [employeeId, period])

  return { analytics, loading, error, refetch: fetchAnalytics, createAnalytics }
}

export function useWorkloadPredictions(employeeId?: string) {
  const [predictions, setPredictions] = useState<WorkloadPrediction[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPredictions = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const params = new URLSearchParams()
      if (employeeId) params.append('employeeId', employeeId)
      
      const response = await fetch(`/api/workload/predictions?${params}`)
      if (!response.ok) throw new Error('Failed to fetch predictions')
      
      const data = await response.json()
      setPredictions(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [employeeId])

  const generatePrediction = async (empId: string) => {
    try {
      const response = await fetch(`/api/workload/predictions?generate=true&employeeId=${empId}`)
      if (!response.ok) throw new Error('Failed to generate prediction')
      
      const newPrediction = await response.json()
      setPredictions(prev => [newPrediction, ...prev])
      return newPrediction
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  useEffect(() => {
    fetchPredictions()
  }, [employeeId])

  return { predictions, loading, error, refetch: fetchPredictions, generatePrediction }
}

// Utility functions
export function calculateEfficiencyScore(sessions: WorkloadSession[]): number {
  if (sessions.length === 0) return 0
  
  const totalEfficiency = sessions.reduce((sum, session) => sum + (session.efficiency || 0), 0)
  return Math.round(totalEfficiency / sessions.length)
}

export function calculateWorkingHours(sessions: WorkloadSession[]): number {
  return sessions.reduce((total, session) => total + (session.duration || 0), 0) / 60 // Convert minutes to hours
}

export function getActivityBreakdown(sessions: WorkloadSession[]) {
  const breakdown = {
    working: 0,
    idle: 0,
    break: 0,
    meeting: 0
  }
  
  sessions.forEach(session => {
    const duration = session.duration || 0
    breakdown[session.activityType] += duration
  })
  
  return breakdown
}

export function getRiskLevelColor(riskLevel: string): string {
  switch (riskLevel) {
    case 'low': return 'text-green-600 bg-green-100'
    case 'medium': return 'text-yellow-600 bg-yellow-100'
    case 'high': return 'text-red-600 bg-red-100'
    default: return 'text-gray-600 bg-gray-100'
  }
}

export function getEfficiencyColor(efficiency: number): string {
  if (efficiency >= 90) return 'text-green-600'
  if (efficiency >= 75) return 'text-yellow-600'
  return 'text-red-600'
}

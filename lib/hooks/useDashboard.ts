'use client'

import { useState, useEffect } from 'react'
import { apiGet } from '@/lib/api/client'

interface DashboardStats {
  totalInventory: number
  activeMachines: number
  employeesOnShift: number
  qcPassRate: string
  attendanceRate: string
}

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiGet<{ success: boolean; data: DashboardStats }>('/dashboard/stats')
      if (response.success) {
        setStats(response.data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard stats')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  }
}

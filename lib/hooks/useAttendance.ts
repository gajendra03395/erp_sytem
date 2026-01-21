'use client'

import { useState, useEffect } from 'react'
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api/client'
import type { AttendanceRecord, CreateAttendanceRecord, UpdateAttendanceRecord } from '@/types/attendance'

export function useAttendance() {
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRecords = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiGet<{ success: boolean; data: AttendanceRecord[] }>('/attendance')
      if (response.success) {
        setRecords(response.data)
      } else {
        throw new Error('Failed to fetch attendance records')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch attendance records')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecords()
  }, [])

  const addRecord = async (record: CreateAttendanceRecord) => {
    const response = await apiPost<{ success: boolean; data: AttendanceRecord; error?: string }>('/attendance', record)
    if (!response.success) {
      throw new Error(response.error || 'Failed to add attendance record')
    }
    await fetchRecords()
    return response.data
  }

  const updateRecord = async (id: string, updates: UpdateAttendanceRecord) => {
    const response = await apiPut<{ success: boolean; data: AttendanceRecord; error?: string }>(`/attendance/${id}`, updates)
    if (!response.success) {
      throw new Error(response.error || 'Failed to update attendance record')
    }
    await fetchRecords()
    return response.data
  }

  const deleteRecord = async (id: string) => {
    const response = await apiDelete<{ success: boolean; error?: string }>(`/attendance/${id}`)
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete attendance record')
    }
    await fetchRecords()
  }

  return {
    records,
    loading,
    error,
    addRecord,
    updateRecord,
    deleteRecord,
    refetch: fetchRecords,
  }
}

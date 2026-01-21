'use client'

import { useState, useEffect } from 'react'
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api/client'
import type { QualityControl, CreateQC, UpdateQC } from '@/types/qc'

export function useQC() {
  const [records, setRecords] = useState<QualityControl[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRecords = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiGet<{ success: boolean; data: QualityControl[] }>('/quality-control')
      if (response.success) {
        setRecords(response.data)
      } else {
        throw new Error('Failed to fetch QC records')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch QC records')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecords()
  }, [])

  const addRecord = async (record: CreateQC) => {
    try {
      const response = await apiPost<{ success: boolean; data: QualityControl; error?: string }>('/quality-control', record)
      if (!response.success) {
        throw new Error(response.error || 'Failed to add QC record')
      }
      await fetchRecords()
      return response.data
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to add QC record')
    }
  }

  const updateRecord = async (id: string, updates: UpdateQC) => {
    try {
      const response = await apiPut<{ success: boolean; data: QualityControl; error?: string }>(`/quality-control/${id}`, updates)
      if (!response.success) {
        throw new Error(response.error || 'Failed to update QC record')
      }
      await fetchRecords()
      return response.data
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update QC record')
    }
  }

  const deleteRecord = async (id: string) => {
    try {
      const response = await apiDelete<{ success: boolean; error?: string }>(`/quality-control/${id}`)
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete QC record')
      }
      await fetchRecords()
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete QC record')
    }
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

'use client'

import { useState, useEffect } from 'react'
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api/client'
import type { Machine, CreateMachine, UpdateMachine } from '@/types/machine'

export function useMachines() {
  const [machines, setMachines] = useState<Machine[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMachines = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiGet<{ success: boolean; data: Machine[] }>('/machines')
      if (response.success) {
        setMachines(response.data)
      } else {
        throw new Error('Failed to fetch machines')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch machines')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMachines()
  }, [])

  const addMachine = async (machine: CreateMachine) => {
    try {
      const response = await apiPost<{ success: boolean; data: Machine; error?: string }>('/machines', machine)
      if (!response.success) {
        throw new Error(response.error || 'Failed to add machine')
      }
      await fetchMachines()
      return response.data
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to add machine')
    }
  }

  const updateMachine = async (id: string, updates: UpdateMachine) => {
    try {
      const response = await apiPut<{ success: boolean; data: Machine; error?: string }>(`/machines/${id}`, updates)
      if (!response.success) {
        throw new Error(response.error || 'Failed to update machine')
      }
      await fetchMachines()
      return response.data
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update machine')
    }
  }

  const deleteMachine = async (id: string) => {
    try {
      const response = await apiDelete<{ success: boolean; error?: string }>(`/machines/${id}`)
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete machine')
      }
      await fetchMachines()
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete machine')
    }
  }

  return {
    machines,
    loading,
    error,
    addMachine,
    updateMachine,
    deleteMachine,
    refetch: fetchMachines,
  }
}

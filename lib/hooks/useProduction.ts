import { useState, useEffect } from 'react'
import { WorkOrder, BOMItem, CreateWorkOrderRequest, UpdateWorkOrderRequest, CreateBOMRequest, UpdateBOMRequest } from '@/types/production'
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api/client'

export function useWorkOrders() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchWorkOrders()
  }, [])

  const fetchWorkOrders = async () => {
    try {
      setLoading(true)
      const response = await apiGet<{success: boolean; data: WorkOrder[]}>('/production/work-orders')
      setWorkOrders(response?.data || [])
      setError(null)
    } catch (err) {
      setError('Failed to fetch work orders')
      console.error(err)
      setWorkOrders([]) // Set empty array on error
    } finally {
      setLoading(false)
    }
  }

  const createWorkOrder = async (data: CreateWorkOrderRequest) => {
    try {
      const response = await apiPost<{success: boolean; data: WorkOrder}>('/production/work-orders', data)
      setWorkOrders(prev => [...prev, response.data])
      return response.data
    } catch (err) {
      setError('Failed to create work order')
      throw err
    }
  }

  const updateWorkOrder = async (id: string, data: UpdateWorkOrderRequest) => {
    try {
      const response = await apiPut<{success: boolean; data: WorkOrder}>(`/production/work-orders/${id}`, data)
      setWorkOrders(prev => prev.map(wo => wo.id === id ? response.data : wo))
      return response.data
    } catch (err) {
      setError('Failed to update work order')
      throw err
    }
  }

  const deleteWorkOrder = async (id: string) => {
    try {
      await apiDelete(`/production/work-orders/${id}`)
      setWorkOrders(prev => prev.filter(wo => wo.id !== id))
    } catch (err) {
      setError('Failed to delete work order')
      throw err
    }
  }

  return {
    workOrders,
    loading,
    error,
    refetch: fetchWorkOrders,
    createWorkOrder,
    updateWorkOrder,
    deleteWorkOrder,
  }
}

export function useBOMs() {
  const [boms, setBOMs] = useState<BOMItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchBOMs()
  }, [])

  const fetchBOMs = async () => {
    try {
      setLoading(true)
      const response = await apiGet<{success: boolean; data: BOMItem[]}>('/production/bom')
      setBOMs(response?.data || [])
      setError(null)
    } catch (err) {
      setError('Failed to fetch BOMs')
      console.error(err)
      setBOMs([]) // Set empty array on error
    } finally {
      setLoading(false)
    }
  }

  const createBOM = async (data: CreateBOMRequest) => {
    try {
      const response = await apiPost<{success: boolean; data: BOMItem}>('/production/bom', data)
      setBOMs(prev => [...prev, response.data])
      return response.data
    } catch (err) {
      setError('Failed to create BOM')
      throw err
    }
  }

  const updateBOM = async (id: string, data: UpdateBOMRequest) => {
    try {
      const response = await apiPut<{success: boolean; data: BOMItem}>(`/production/bom/${id}`, data)
      setBOMs(prev => prev.map(bom => bom.id === id ? response.data : bom))
      return response.data
    } catch (err) {
      setError('Failed to update BOM')
      throw err
    }
  }

  const deleteBOM = async (id: string) => {
    try {
      await apiDelete(`/production/bom/${id}`)
      setBOMs(prev => prev.filter(bom => bom.id !== id))
    } catch (err) {
      setError('Failed to delete BOM')
      throw err
    }
  }

  return {
    boms,
    loading,
    error,
    refetch: fetchBOMs,
    createBOM,
    updateBOM,
    deleteBOM,
  }
}

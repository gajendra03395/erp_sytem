import { useState, useEffect } from 'react'
import { Warehouse, StockTransfer, CreateWarehouseRequest, UpdateWarehouseRequest, CreateStockTransferRequest, UpdateStockTransferRequest } from '@/types/warehouse'
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api/client'

export function useWarehouses() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchWarehouses()
  }, [])

  const fetchWarehouses = async () => {
    try {
      setLoading(true)
      const response = await apiGet<Warehouse[]>('/warehouse/warehouses')
      setWarehouses(response)
      setError(null)
    } catch (err) {
      setError('Failed to fetch warehouses')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const createWarehouse = async (data: CreateWarehouseRequest) => {
    try {
      const response = await apiPost<Warehouse>('/warehouse/warehouses', data)
      setWarehouses(prev => [...prev, response])
      return response
    } catch (err) {
      setError('Failed to create warehouse')
      throw err
    }
  }

  const updateWarehouse = async (id: string, data: UpdateWarehouseRequest) => {
    try {
      const response = await apiPut<Warehouse>(`/warehouse/warehouses/${id}`, data)
      setWarehouses(prev => prev.map(w => w.id === id ? response : w))
      return response
    } catch (err) {
      setError('Failed to update warehouse')
      throw err
    }
  }

  const deleteWarehouse = async (id: string) => {
    try {
      await apiDelete(`/warehouse/warehouses/${id}`)
      setWarehouses(prev => prev.filter(w => w.id !== id))
    } catch (err) {
      setError('Failed to delete warehouse')
      throw err
    }
  }

  return {
    warehouses,
    loading,
    error,
    refetch: fetchWarehouses,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse,
  }
}

export function useStockTransfers() {
  const [stockTransfers, setStockTransfers] = useState<StockTransfer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStockTransfers()
  }, [])

  const fetchStockTransfers = async () => {
    try {
      setLoading(true)
      const response = await apiGet<StockTransfer[]>('/warehouse/transfers')
      setStockTransfers(response)
      setError(null)
    } catch (err) {
      setError('Failed to fetch stock transfers')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const createStockTransfer = async (data: Omit<CreateStockTransferRequest, 'requested_by'>) => {
    try {
      const response = await apiPost<StockTransfer>('/warehouse/transfers', data)
      setStockTransfers(prev => [...prev, response])
      return response
    } catch (err) {
      setError('Failed to create stock transfer')
      throw err
    }
  }

  const updateStockTransfer = async (id: string, data: UpdateStockTransferRequest) => {
    try {
      const response = await apiPut<StockTransfer>(`/warehouse/transfers/${id}`, data)
      setStockTransfers(prev => prev.map(t => t.id === id ? response : t))
      return response
    } catch (err) {
      setError('Failed to update stock transfer')
      throw err
    }
  }

  const deleteStockTransfer = async (id: string) => {
    try {
      await apiDelete(`/warehouse/transfers/${id}`)
      setStockTransfers(prev => prev.filter(t => t.id !== id))
    } catch (err) {
      setError('Failed to delete stock transfer')
      throw err
    }
  }

  return {
    stockTransfers,
    loading,
    error,
    refetch: fetchStockTransfers,
    createStockTransfer,
    updateStockTransfer,
    deleteStockTransfer,
  }
}

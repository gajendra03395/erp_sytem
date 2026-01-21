import { useState, useEffect } from 'react'
import { Asset, MaintenanceRecord, CreateAssetRequest, UpdateAssetRequest, CreateMaintenanceRecordRequest, UpdateMaintenanceRecordRequest } from '@/types/assets'
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api/client'

export function useAssets() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAssets()
  }, [])

  const fetchAssets = async () => {
    try {
      setLoading(true)
      const response = await apiGet<Asset[]>('/assets/assets')
      setAssets(response)
      setError(null)
    } catch (err) {
      setError('Failed to fetch assets')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const createAsset = async (data: CreateAssetRequest) => {
    try {
      const response = await apiPost<Asset>('/assets/assets', data)
      setAssets(prev => [...prev, response])
      return response
    } catch (err) {
      setError('Failed to create asset')
      throw err
    }
  }

  const updateAsset = async (id: string, data: UpdateAssetRequest) => {
    try {
      const response = await apiPut<Asset>(`/assets/assets/${id}`, data)
      setAssets(prev => prev.map(a => a.id === id ? response : a))
      return response
    } catch (err) {
      setError('Failed to update asset')
      throw err
    }
  }

  const deleteAsset = async (id: string) => {
    try {
      await apiDelete(`/assets/assets/${id}`)
      setAssets(prev => prev.filter(a => a.id !== id))
    } catch (err) {
      setError('Failed to delete asset')
      throw err
    }
  }

  return {
    assets,
    loading,
    error,
    refetch: fetchAssets,
    createAsset,
    updateAsset,
    deleteAsset,
  }
}

export function useMaintenanceRecords() {
  const [records, setRecords] = useState<MaintenanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchRecords()
  }, [])

  const fetchRecords = async () => {
    try {
      setLoading(true)
      const response = await apiGet<MaintenanceRecord[]>('/assets/maintenance')
      setRecords(response)
      setError(null)
    } catch (err) {
      setError('Failed to fetch maintenance records')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const createRecord = async (data: CreateMaintenanceRecordRequest) => {
    try {
      const response = await apiPost<MaintenanceRecord>('/assets/maintenance', data)
      setRecords(prev => [...prev, response])
      return response
    } catch (err) {
      setError('Failed to create maintenance record')
      throw err
    }
  }

  const updateRecord = async (id: string, data: UpdateMaintenanceRecordRequest) => {
    try {
      const response = await apiPut<MaintenanceRecord>(`/assets/maintenance/${id}`, data)
      setRecords(prev => prev.map(r => r.id === id ? response : r))
      return response
    } catch (err) {
      setError('Failed to update maintenance record')
      throw err
    }
  }

  const deleteRecord = async (id: string) => {
    try {
      await apiDelete(`/assets/maintenance/${id}`)
      setRecords(prev => prev.filter(r => r.id !== id))
    } catch (err) {
      setError('Failed to delete maintenance record')
      throw err
    }
  }

  return {
    records,
    loading,
    error,
    refetch: fetchRecords,
    createRecord,
    updateRecord,
    deleteRecord,
  }
}

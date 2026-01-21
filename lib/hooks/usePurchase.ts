import { useState, useEffect } from 'react'
import { Vendor, PurchaseOrder, CreateVendorRequest, UpdateVendorRequest, CreatePurchaseOrderRequest, UpdatePurchaseOrderRequest } from '@/types/purchase'
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api/client'

export function useVendors() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchVendors()
  }, [])

  const fetchVendors = async () => {
    try {
      setLoading(true)
      const response = await apiGet<Vendor[]>('/purchase/vendors')
      setVendors(response)
      setError(null)
    } catch (err) {
      setError('Failed to fetch vendors')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const createVendor = async (data: CreateVendorRequest) => {
    try {
      const response = await apiPost<Vendor>('/purchase/vendors', data)
      setVendors(prev => [...prev, response])
      return response
    } catch (err) {
      setError('Failed to create vendor')
      throw err
    }
  }

  const updateVendor = async (id: string, data: UpdateVendorRequest) => {
    try {
      const response = await apiPut<Vendor>(`/purchase/vendors/${id}`, data)
      setVendors(prev => prev.map(v => v.id === id ? response : v))
      return response
    } catch (err) {
      setError('Failed to update vendor')
      throw err
    }
  }

  const deleteVendor = async (id: string) => {
    try {
      await apiDelete(`/purchase/vendors/${id}`)
      setVendors(prev => prev.filter(v => v.id !== id))
    } catch (err) {
      setError('Failed to delete vendor')
      throw err
    }
  }

  return {
    vendors,
    loading,
    error,
    refetch: fetchVendors,
    createVendor,
    updateVendor,
    deleteVendor,
  }
}

export function usePurchaseOrders() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPurchaseOrders()
  }, [])

  const fetchPurchaseOrders = async () => {
    try {
      setLoading(true)
      const response = await apiGet<PurchaseOrder[]>('/purchase/orders')
      setPurchaseOrders(response)
      setError(null)
    } catch (err) {
      setError('Failed to fetch purchase orders')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const createPurchaseOrder = async (data: CreatePurchaseOrderRequest) => {
    try {
      const response = await apiPost<PurchaseOrder>('/purchase/orders', data)
      setPurchaseOrders(prev => [...prev, response])
      return response
    } catch (err) {
      setError('Failed to create purchase order')
      throw err
    }
  }

  const updatePurchaseOrder = async (id: string, data: UpdatePurchaseOrderRequest) => {
    try {
      const response = await apiPut<PurchaseOrder>(`/purchase/orders/${id}`, data)
      setPurchaseOrders(prev => prev.map(po => po.id === id ? response : po))
      return response
    } catch (err) {
      setError('Failed to update purchase order')
      throw err
    }
  }

  const deletePurchaseOrder = async (id: string) => {
    try {
      await apiDelete(`/purchase/orders/${id}`)
      setPurchaseOrders(prev => prev.filter(po => po.id !== id))
    } catch (err) {
      setError('Failed to delete purchase order')
      throw err
    }
  }

  return {
    purchaseOrders,
    loading,
    error,
    refetch: fetchPurchaseOrders,
    createPurchaseOrder,
    updatePurchaseOrder,
    deletePurchaseOrder,
  }
}

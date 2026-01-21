'use client'

import { useState, useEffect } from 'react'
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api/client'
import type { InventoryItem, CreateInventoryItem, UpdateInventoryItem, StockTransaction } from '@/types/inventory'

export function useInventory() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchItems = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch from API
      const response = await apiGet<{ success: boolean; data: InventoryItem[] }>('/inventory')
      
      if (response.success) {
        setItems(response.data)
      } else {
        throw new Error('Failed to fetch inventory')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch inventory')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const addItem = async (item: CreateInventoryItem) => {
    try {
      // Create item via API
      const response = await apiPost<{ success: boolean; data: InventoryItem; error?: string }>('/inventory', item)
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to add inventory item')
      }

      // Refresh inventory list
      await fetchItems()
      
      return response.data
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to add inventory item')
    }
  }

  const updateItem = async (id: string, updates: UpdateInventoryItem) => {
    try {
      const response = await apiPut<{ success: boolean; data: InventoryItem; error?: string }>(`/inventory/${id}`, updates)
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to update inventory item')
      }

      // Refresh inventory list
      await fetchItems()
      
      return response.data
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update inventory item')
    }
  }

  const deleteItem = async (id: string) => {
    try {
      const response = await apiDelete<{ success: boolean; error?: string }>(`/inventory/${id}`)
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete inventory item')
      }

      // Refresh inventory list
      await fetchItems()
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete inventory item')
    }
  }

  const addStock = async (transaction: StockTransaction) => {
    try {
      // This would be a separate API endpoint for stock transactions
      // For now, we'll just update the item's stock level
      const item = items.find(i => i.item_name === transaction.item_name)
      if (!item) {
        throw new Error('Item not found')
      }

      const newStockLevel = item.stock_level + transaction.quantity
      await updateItem(item.id, { stock_level: newStockLevel })
      
      return {} as InventoryItem
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to add stock')
    }
  }

  return {
    items,
    loading,
    error,
    addItem,
    updateItem,
    deleteItem,
    addStock,
    refetch: fetchItems,
  }
}

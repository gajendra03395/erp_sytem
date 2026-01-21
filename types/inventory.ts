export type InventoryCategory = 'raw_material' | 'finished_good'

export interface InventoryItem {
  id: string
  item_name: string
  category: InventoryCategory
  stock_level: number
  unit: string
  reorder_point: number
  supplier?: string
  last_stock_date?: Date
  created_at: Date
  updated_at: Date
}

export interface CreateInventoryItem {
  item_name: string
  category: InventoryCategory
  stock_level: number
  unit: string
  reorder_point: number
  supplier?: string
  last_stock_date?: Date
}

export interface StockTransaction {
  item_name: string
  quantity: number
  supplier: string
  date: Date
}

export interface UpdateInventoryItem {
  item_name?: string
  category?: InventoryCategory
  stock_level?: number
  unit?: string
  reorder_point?: number
}

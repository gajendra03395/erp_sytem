export interface Warehouse {
  id: string
  warehouse_code: string
  name: string
  address: string
  city: string
  state: string
  country: string
  postal_code: string
  manager_id?: string
  contact_phone: string
  contact_email: string
  total_capacity: number
  used_capacity: number
  status: 'active' | 'inactive' | 'maintenance'
  type: 'main' | 'branch' | 'virtual'
  temperature_controlled: boolean
  security_level: 'low' | 'medium' | 'high'
  operating_hours: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface WarehouseZone {
  id: string
  warehouse_id: string
  zone_code: string
  name: string
  type: 'storage' | 'picking' | 'packing' | 'receiving' | 'shipping'
  capacity: number
  used_capacity: number
  temperature_range?: string
  special_requirements?: string
  status: 'active' | 'inactive' | 'maintenance'
  created_at: string
  updated_at: string
}

export interface WarehouseLocation {
  id: string
  warehouse_id: string
  zone_id: string
  location_code: string
  aisle: string
  shelf: string
  bin: string
  capacity: number
  used_capacity: number
  location_type: 'bulk' | 'pallet' | 'shelf' | 'bin' | 'floor'
  status: 'available' | 'occupied' | 'reserved' | 'blocked'
  created_at: string
  updated_at: string
}

export interface StockTransfer {
  id: string
  transfer_number: string
  from_warehouse_id: string
  to_warehouse_id: string
  product_sku: string
  product_name: string
  quantity: number
  unit: string
  status: 'pending' | 'in_transit' | 'received' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  requested_date: string
  expected_date: string
  actual_date?: string
  requested_by: string
  approved_by?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface StockAdjustment {
  id: string
  adjustment_number: string
  warehouse_id: string
  product_sku: string
  product_name: string
  adjustment_type: 'increase' | 'decrease'
  quantity: number
  unit: string
  reason: 'damage' | 'theft' | 'expired' | 'count_adjustment' | 'return' | 'other'
  notes?: string
  approved_by?: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
}

export interface WarehouseInventory {
  id: string
  warehouse_id: string
  product_sku: string
  product_name: string
  quantity_on_hand: number
  quantity_reserved: number
  quantity_available: number
  reorder_level: number
  max_stock: number
  min_stock: number
  average_cost: number
  total_value: number
  last_count_date?: string
  location_id?: string
  zone_id?: string
  created_at: string
  updated_at: string
}

export interface CreateWarehouseRequest {
  warehouse_code: string
  name: string
  address: string
  city: string
  state: string
  country: string
  postal_code: string
  manager_id?: string
  contact_phone: string
  contact_email: string
  total_capacity: number
  type: 'main' | 'branch' | 'virtual'
  temperature_controlled: boolean
  security_level: 'low' | 'medium' | 'high'
  operating_hours: string
  notes?: string
}

export interface UpdateWarehouseRequest {
  warehouse_code?: string
  name?: string
  address?: string
  city?: string
  state?: string
  country?: string
  postal_code?: string
  manager_id?: string
  contact_phone?: string
  contact_email?: string
  total_capacity?: number
  used_capacity?: number
  status?: 'active' | 'inactive' | 'maintenance'
  type?: 'main' | 'branch' | 'virtual'
  temperature_controlled?: boolean
  security_level?: 'low' | 'medium' | 'high'
  operating_hours?: string
  notes?: string
}

export interface CreateStockTransferRequest {
  from_warehouse_id: string
  to_warehouse_id: string
  product_sku: string
  product_name: string
  quantity: number
  unit: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  expected_date: string
  requested_by: string
  notes?: string
}

export interface UpdateStockTransferRequest {
  to_warehouse_id?: string
  quantity?: number
  status?: 'pending' | 'in_transit' | 'received' | 'cancelled'
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  expected_date?: string
  actual_date?: string
  approved_by?: string
  notes?: string
}

export interface CreateStockAdjustmentRequest {
  warehouse_id: string
  product_sku: string
  product_name: string
  adjustment_type: 'increase' | 'decrease'
  quantity: number
  unit: string
  reason: 'damage' | 'theft' | 'expired' | 'count_adjustment' | 'return' | 'other'
  notes?: string
}

export interface UpdateStockAdjustmentRequest {
  adjustment_type?: 'increase' | 'decrease'
  quantity?: number
  reason?: 'damage' | 'theft' | 'expired' | 'count_adjustment' | 'return' | 'other'
  notes?: string
  approved_by?: string
  status?: 'pending' | 'approved' | 'rejected'
}

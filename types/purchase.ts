export interface Vendor {
  id: string
  vendor_code: string
  name: string
  contact_person: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  country: string
  postal_code: string
  tax_id: string
  payment_terms: string
  category: string
  status: 'active' | 'inactive' | 'suspended'
  rating: number
  notes?: string
  created_at: string
  updated_at: string
}

export interface PurchaseOrder {
  id: string
  po_number: string
  vendor_id: string
  order_date: string
  expected_delivery_date: string
  actual_delivery_date?: string
  status: 'draft' | 'sent' | 'confirmed' | 'partial' | 'received' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  subtotal: number
  tax_amount: number
  total_amount: number
  currency: string
  payment_terms: string
  shipping_method: string
  tracking_number?: string
  notes?: string
  items: PurchaseOrderItem[]
  created_at: string
  updated_at: string
}

export interface PurchaseOrderItem {
  id: string
  product_name: string
  sku: string
  description?: string
  quantity: number
  unit: string
  unit_price: number
  total_price: number
  received_quantity: number
  remaining_quantity: number
}

export interface CreateVendorRequest {
  vendor_code: string
  name: string
  contact_person: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  country: string
  postal_code: string
  tax_id: string
  payment_terms: string
  category: string
  rating?: number
  notes?: string
}

export interface UpdateVendorRequest {
  vendor_code?: string
  name?: string
  contact_person?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  country?: string
  postal_code?: string
  tax_id?: string
  payment_terms?: string
  category?: string
  status?: 'active' | 'inactive' | 'suspended'
  rating?: number
  notes?: string
}

export interface CreatePurchaseOrderRequest {
  vendor_id: string
  order_date: string
  expected_delivery_date: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  currency: string
  payment_terms: string
  shipping_method: string
  notes?: string
  items: Omit<PurchaseOrderItem, 'id' | 'total_price' | 'received_quantity' | 'remaining_quantity'>[]
}

export interface UpdatePurchaseOrderRequest {
  vendor_id?: string
  order_date?: string
  expected_delivery_date?: string
  actual_delivery_date?: string
  status?: 'draft' | 'sent' | 'confirmed' | 'partial' | 'received' | 'cancelled'
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  subtotal?: number
  tax_amount?: number
  total_amount?: number
  currency?: string
  payment_terms?: string
  shipping_method?: string
  tracking_number?: string
  notes?: string
  items?: PurchaseOrderItem[]
}

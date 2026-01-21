export interface Lead {
  id: string
  lead_number: string
  first_name: string
  last_name: string
  email: string
  phone: string
  company?: string
  position?: string
  source: 'website' | 'referral' | 'social_media' | 'email' | 'phone' | 'walk_in' | 'other'
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost' | 'closed'
  priority: 'low' | 'medium' | 'high'
  estimated_value?: number
  probability: number
  assigned_to?: string
  notes?: string
  tags: string[]
  created_at: string
  updated_at: string
}

export interface Opportunity {
  id: string
  opportunity_number: string
  lead_id?: string
  customer_id?: string
  name: string
  description?: string
  stage: 'prospecting' | 'qualification' | 'needs_analysis' | 'value_proposition' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost'
  probability: number
  estimated_value: number
  actual_value?: number
  expected_close_date: string
  actual_close_date?: string
  assigned_to?: string
  products: OpportunityProduct[]
  notes?: string
  tags: string[]
  created_at: string
  updated_at: string
}

export interface OpportunityProduct {
  id: string
  product_name: string
  quantity: number
  unit_price: number
  total_price: number
  discount_rate: number
}

export interface Customer {
  id: string
  customer_code: string
  name: string
  email: string
  phone: string
  company?: string
  industry?: string
  website?: string
  billing_address: string
  shipping_address?: string
  tax_id?: string
  credit_limit?: number
  account_manager?: string
  status: 'active' | 'inactive' | 'prospect'
  notes?: string
  tags: string[]
  created_at: string
  updated_at: string
}

export interface SalesOrder {
  id: string
  order_number: string
  customer_id: string
  opportunity_id?: string
  order_date: string
  expected_delivery_date: string
  actual_delivery_date?: string
  status: 'draft' | 'confirmed' | 'in_progress' | 'shipped' | 'delivered' | 'cancelled'
  priority: 'low' | 'medium' | 'high'
  subtotal: number
  tax_amount: number
  discount_amount: number
  total_amount: number
  currency: string
  payment_terms: string
  shipping_method: string
  tracking_number?: string
  notes?: string
  items: SalesOrderItem[]
  created_at: string
  updated_at: string
}

export interface SalesOrderItem {
  id: string
  product_name: string
  sku: string
  description?: string
  quantity: number
  unit: string
  unit_price: number
  total_price: number
  discount_rate: number
  shipped_quantity: number
  remaining_quantity: number
}

export interface Activity {
  id: string
  type: 'call' | 'email' | 'meeting' | 'task' | 'note'
  subject: string
  description?: string
  related_to: 'lead' | 'opportunity' | 'customer' | 'sales_order'
  related_id: string
  assigned_to?: string
  status: 'pending' | 'completed' | 'cancelled'
  due_date?: string
  completed_date?: string
  created_at: string
  updated_at: string
}

export interface CreateLeadRequest {
  first_name: string
  last_name: string
  email: string
  phone: string
  company?: string
  position?: string
  source: 'website' | 'referral' | 'social_media' | 'email' | 'phone' | 'walk_in' | 'other'
  priority: 'low' | 'medium' | 'high'
  estimated_value?: number
  assigned_to?: string
  notes?: string
  tags?: string[]
}

export interface UpdateLeadRequest {
  first_name?: string
  last_name?: string
  email?: string
  phone?: string
  company?: string
  position?: string
  source?: 'website' | 'referral' | 'social_media' | 'email' | 'phone' | 'walk_in' | 'other'
  status?: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost' | 'closed'
  priority?: 'low' | 'medium' | 'high'
  estimated_value?: number
  probability?: number
  assigned_to?: string
  notes?: string
  tags?: string[]
}

export interface CreateOpportunityRequest {
  lead_id?: string
  customer_id?: string
  name: string
  description?: string
  stage: 'prospecting' | 'qualification' | 'needs_analysis' | 'value_proposition' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost'
  probability: number
  estimated_value: number
  expected_close_date: string
  assigned_to?: string
  products: Omit<OpportunityProduct, 'id' | 'total_price'>[]
  notes?: string
  tags?: string[]
}

export interface UpdateOpportunityRequest {
  name?: string
  description?: string
  stage?: 'prospecting' | 'qualification' | 'needs_analysis' | 'value_proposition' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost'
  probability?: number
  estimated_value?: number
  actual_value?: number
  expected_close_date?: string
  actual_close_date?: string
  assigned_to?: string
  products?: OpportunityProduct[]
  notes?: string
  tags?: string[]
}

export interface CreateCustomerRequest {
  customer_code: string
  name: string
  email: string
  phone: string
  company?: string
  industry?: string
  website?: string
  billing_address: string
  shipping_address?: string
  tax_id?: string
  credit_limit?: number
  account_manager?: string
  status?: 'active' | 'inactive' | 'prospect'
  notes?: string
  tags?: string[]
}

export interface UpdateCustomerRequest {
  customer_code?: string
  name?: string
  email?: string
  phone?: string
  company?: string
  industry?: string
  website?: string
  billing_address?: string
  shipping_address?: string
  tax_id?: string
  credit_limit?: number
  account_manager?: string
  status?: 'active' | 'inactive' | 'prospect'
  notes?: string
  tags?: string[]
}

export interface CreateSalesOrderRequest {
  customer_id: string
  opportunity_id?: string
  order_date: string
  expected_delivery_date: string
  priority: 'low' | 'medium' | 'high'
  currency: string
  payment_terms: string
  shipping_method: string
  notes?: string
  items: Omit<SalesOrderItem, 'id' | 'total_price' | 'shipped_quantity' | 'remaining_quantity'>[]
}

export interface UpdateSalesOrderRequest {
  customer_id?: string
  opportunity_id?: string
  order_date?: string
  expected_delivery_date?: string
  actual_delivery_date?: string
  status?: 'draft' | 'confirmed' | 'in_progress' | 'shipped' | 'delivered' | 'cancelled'
  priority?: 'low' | 'medium' | 'high'
  subtotal?: number
  tax_amount?: number
  discount_amount?: number
  total_amount?: number
  currency?: string
  payment_terms?: string
  shipping_method?: string
  tracking_number?: string
  notes?: string
  items?: SalesOrderItem[]
}

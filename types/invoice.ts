export interface Invoice {
  id: string
  invoice_number: string
  customer_id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  billing_address: string
  shipping_address?: string
  invoice_date: string
  due_date: string
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  currency: string
  subtotal: number
  tax_amount: number
  discount_amount: number
  total_amount: number
  paid_amount: number
  balance_amount: number
  payment_terms: string
  notes?: string
  items: InvoiceItem[]
  payments: Payment[]
  created_at: string
  updated_at: string
}

export interface InvoiceItem {
  id: string
  product_name: string
  description?: string
  quantity: number
  unit: string
  unit_price: number
  total_price: number
  tax_rate: number
  discount_rate: number
}

export interface Payment {
  id: string
  amount: number
  payment_date: string
  payment_method: 'cash' | 'card' | 'bank_transfer' | 'check' | 'online'
  transaction_id?: string
  notes?: string
}

export interface CreateInvoiceRequest {
  customer_id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  billing_address: string
  shipping_address?: string
  invoice_date: string
  due_date: string
  currency: string
  payment_terms: string
  notes?: string
  items: Omit<InvoiceItem, 'id' | 'total_price'>[]
}

export interface UpdateInvoiceRequest {
  customer_id?: string
  customer_name?: string
  customer_email?: string
  customer_phone?: string
  billing_address?: string
  shipping_address?: string
  invoice_date?: string
  due_date?: string
  status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  currency?: string
  subtotal?: number
  tax_amount?: number
  discount_amount?: number
  total_amount?: number
  paid_amount?: number
  balance_amount?: number
  payment_terms?: string
  notes?: string
  items?: InvoiceItem[]
  payments?: Payment[]
}

export interface Customer {
  id: string
  customer_code: string
  name: string
  email: string
  phone: string
  billing_address: string
  shipping_address?: string
  company?: string
  tax_id?: string
  credit_limit?: number
  status: 'active' | 'inactive' | 'suspended'
  notes?: string
  created_at: string
  updated_at: string
}

export interface CreateCustomerRequest {
  customer_code: string
  name: string
  email: string
  phone: string
  billing_address: string
  shipping_address?: string
  company?: string
  tax_id?: string
  credit_limit?: number
  notes?: string
}

export interface UpdateCustomerRequest {
  customer_code?: string
  name?: string
  email?: string
  phone?: string
  billing_address?: string
  shipping_address?: string
  company?: string
  tax_id?: string
  credit_limit?: number
  status?: 'active' | 'inactive' | 'suspended'
  notes?: string
}

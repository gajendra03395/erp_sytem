import { Invoice, Customer, CreateInvoiceRequest, UpdateInvoiceRequest, CreateCustomerRequest, UpdateCustomerRequest } from '@/types/invoice'
import { promises as fs } from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const INVOICES_FILE = path.join(DATA_DIR, 'invoices.json')
const CUSTOMERS_FILE = path.join(DATA_DIR, 'customers.json')

export async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

export async function readInvoices(): Promise<Invoice[]> {
  await ensureDataDir()
  try {
    const data = await fs.readFile(INVOICES_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

export async function writeInvoices(invoices: Invoice[]): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(INVOICES_FILE, JSON.stringify(invoices, null, 2))
}

export async function createInvoice(data: CreateInvoiceRequest): Promise<Invoice> {
  const invoices = await readInvoices()
  
  // Calculate totals
  const items = data.items.map(item => {
    const totalPrice = item.quantity * item.unit_price
    const taxAmount = totalPrice * (item.tax_rate / 100)
    const discountAmount = totalPrice * (item.discount_rate / 100)
    return {
      ...item,
      id: `inv_item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      total_price: totalPrice,
    }
  })
  
  const subtotal = items.reduce((sum, item) => sum + item.total_price, 0)
  const taxAmount = items.reduce((sum, item) => sum + (item.total_price * (item.tax_rate / 100)), 0)
  const discountAmount = items.reduce((sum, item) => sum + (item.total_price * (item.discount_rate / 100)), 0)
  const totalAmount = subtotal + taxAmount - discountAmount
  
  const newInvoice: Invoice = {
    id: `invoice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    invoice_number: `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(4, '0')}`,
    ...data,
    subtotal,
    tax_amount: taxAmount,
    discount_amount: discountAmount,
    total_amount: totalAmount,
    paid_amount: 0,
    balance_amount: totalAmount,
    status: 'draft',
    items,
    payments: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  invoices.push(newInvoice)
  await writeInvoices(invoices)
  return newInvoice
}

export async function updateInvoice(id: string, data: UpdateInvoiceRequest): Promise<Invoice | null> {
  const invoices = await readInvoices()
  const index = invoices.findIndex(inv => inv.id === id)
  if (index === -1) return null
  
  let updatedInvoice = { ...invoices[index] }
  
  if (data.items) {
    const items = data.items.map((item, index) => {
      const existingItem = updatedInvoice.items[index]
      return {
        id: item.id || existingItem?.id || `inv_item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        product_name: item.product_name,
        description: item.description,
        quantity: item.quantity,
        unit: item.unit,
        unit_price: item.unit_price,
        total_price: item.quantity * item.unit_price,
        tax_rate: item.tax_rate,
        discount_rate: item.discount_rate,
      }
    })
    const subtotal = items.reduce((sum, item) => sum + item.total_price, 0)
    const taxAmount = items.reduce((sum, item) => sum + (item.total_price * (item.tax_rate / 100)), 0)
    const discountAmount = items.reduce((sum, item) => sum + (item.total_price * (item.discount_rate / 100)), 0)
    const totalAmount = subtotal + taxAmount - discountAmount
    
    updatedInvoice = {
      ...updatedInvoice,
      items,
      subtotal,
      tax_amount: taxAmount,
      discount_amount: discountAmount,
      total_amount: totalAmount,
      balance_amount: totalAmount - (data.paid_amount || updatedInvoice.paid_amount),
    }
  }
  
  updatedInvoice = {
    ...updatedInvoice,
    ...data,
    updated_at: new Date().toISOString(),
  }
  
  invoices[index] = updatedInvoice
  await writeInvoices(invoices)
  return updatedInvoice
}

export async function deleteInvoice(id: string): Promise<boolean> {
  const invoices = await readInvoices()
  const filtered = invoices.filter(inv => inv.id !== id)
  if (filtered.length === invoices.length) return false
  await writeInvoices(filtered)
  return true
}

export async function readCustomers(): Promise<Customer[]> {
  await ensureDataDir()
  try {
    const data = await fs.readFile(CUSTOMERS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

export async function writeCustomers(customers: Customer[]): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(CUSTOMERS_FILE, JSON.stringify(customers, null, 2))
}

export async function createCustomer(data: CreateCustomerRequest): Promise<Customer> {
  const customers = await readCustomers()
  const newCustomer: Customer = {
    id: `customer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...data,
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  customers.push(newCustomer)
  await writeCustomers(customers)
  return newCustomer
}

export async function updateCustomer(id: string, data: UpdateCustomerRequest): Promise<Customer | null> {
  const customers = await readCustomers()
  const index = customers.findIndex(c => c.id === id)
  if (index === -1) return null
  
  customers[index] = {
    ...customers[index],
    ...data,
    updated_at: new Date().toISOString(),
  }
  await writeCustomers(customers)
  return customers[index]
}

export async function deleteCustomer(id: string): Promise<boolean> {
  const customers = await readCustomers()
  const filtered = customers.filter(c => c.id !== id)
  if (filtered.length === customers.length) return false
  await writeCustomers(filtered)
  return true
}

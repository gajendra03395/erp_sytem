import { Lead, Opportunity, Customer, SalesOrder, CreateLeadRequest, UpdateLeadRequest, CreateOpportunityRequest, UpdateOpportunityRequest, CreateCustomerRequest, UpdateCustomerRequest, CreateSalesOrderRequest, UpdateSalesOrderRequest } from '@/types/crm'
import { promises as fs } from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const LEADS_FILE = path.join(DATA_DIR, 'leads.json')
const OPPORTUNITIES_FILE = path.join(DATA_DIR, 'opportunities.json')
const CUSTOMERS_FILE = path.join(DATA_DIR, 'crm-customers.json')
const SALES_ORDERS_FILE = path.join(DATA_DIR, 'sales-orders.json')

export async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

export async function readLeads(): Promise<Lead[]> {
  await ensureDataDir()
  try {
    const data = await fs.readFile(LEADS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

export async function writeLeads(leads: Lead[]): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(LEADS_FILE, JSON.stringify(leads, null, 2))
}

export async function createLead(data: CreateLeadRequest): Promise<Lead> {
  const leads = await readLeads()
  const newLead: Lead = {
    id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    lead_number: `LD-${new Date().getFullYear()}-${String(leads.length + 1).padStart(4, '0')}`,
    ...data,
    status: 'new',
    probability: 25,
    tags: data.tags || [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  leads.push(newLead)
  await writeLeads(leads)
  return newLead
}

export async function updateLead(id: string, data: UpdateLeadRequest): Promise<Lead | null> {
  const leads = await readLeads()
  const index = leads.findIndex(l => l.id === id)
  if (index === -1) return null
  
  leads[index] = {
    ...leads[index],
    ...data,
    updated_at: new Date().toISOString(),
  }
  await writeLeads(leads)
  return leads[index]
}

export async function deleteLead(id: string): Promise<boolean> {
  const leads = await readLeads()
  const filtered = leads.filter(l => l.id !== id)
  if (filtered.length === leads.length) return false
  await writeLeads(filtered)
  return true
}

export async function readOpportunities(): Promise<Opportunity[]> {
  await ensureDataDir()
  try {
    const data = await fs.readFile(OPPORTUNITIES_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

export async function writeOpportunities(opportunities: Opportunity[]): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(OPPORTUNITIES_FILE, JSON.stringify(opportunities, null, 2))
}

export async function createOpportunity(data: CreateOpportunityRequest): Promise<Opportunity> {
  const opportunities = await readOpportunities()
  
  const products = data.products.map(product => ({
    ...product,
    id: `opp_prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    total_price: product.quantity * product.unit_price,
  }))
  
  const newOpportunity: Opportunity = {
    id: `opportunity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    opportunity_number: `OPP-${new Date().getFullYear()}-${String(opportunities.length + 1).padStart(4, '0')}`,
    ...data,
    products,
    tags: data.tags || [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  opportunities.push(newOpportunity)
  await writeOpportunities(opportunities)
  return newOpportunity
}

export async function updateOpportunity(id: string, data: UpdateOpportunityRequest): Promise<Opportunity | null> {
  const opportunities = await readOpportunities()
  const index = opportunities.findIndex(o => o.id === id)
  if (index === -1) return null
  
  let updatedOpportunity = { ...opportunities[index] }
  
  if (data.products) {
    const products = data.products.map((product, index) => {
      const existingProduct = updatedOpportunity.products[index]
      return {
        id: product.id || existingProduct?.id || `opp_prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        product_name: product.product_name,
        quantity: product.quantity,
        unit_price: product.unit_price,
        total_price: product.quantity * product.unit_price,
        discount_rate: product.discount_rate,
      }
    })
    updatedOpportunity = {
      ...updatedOpportunity,
      products,
    }
  }
  
  updatedOpportunity = {
    ...updatedOpportunity,
    ...data,
    updated_at: new Date().toISOString(),
  }
  
  opportunities[index] = updatedOpportunity
  await writeOpportunities(opportunities)
  return updatedOpportunity
}

export async function deleteOpportunity(id: string): Promise<boolean> {
  const opportunities = await readOpportunities()
  const filtered = opportunities.filter(o => o.id !== id)
  if (filtered.length === opportunities.length) return false
  await writeOpportunities(filtered)
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
    status: data.status || 'prospect',
    tags: data.tags || [],
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

export async function readSalesOrders(): Promise<SalesOrder[]> {
  await ensureDataDir()
  try {
    const data = await fs.readFile(SALES_ORDERS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

export async function writeSalesOrders(salesOrders: SalesOrder[]): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(SALES_ORDERS_FILE, JSON.stringify(salesOrders, null, 2))
}

export async function createSalesOrder(data: CreateSalesOrderRequest): Promise<SalesOrder> {
  const salesOrders = await readSalesOrders()
  
  const items = data.items.map(item => ({
    ...item,
    id: `so_item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    total_price: item.quantity * item.unit_price,
    shipped_quantity: 0,
    remaining_quantity: item.quantity,
  }))
  
  const subtotal = items.reduce((sum, item) => sum + item.total_price, 0)
  const taxAmount = subtotal * 0.1
  const discountAmount = items.reduce((sum, item) => sum + (item.total_price * (item.discount_rate / 100)), 0)
  const totalAmount = subtotal + taxAmount - discountAmount
  
  const newSalesOrder: SalesOrder = {
    id: `sales_order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    order_number: `SO-${new Date().getFullYear()}-${String(salesOrders.length + 1).padStart(4, '0')}`,
    ...data,
    subtotal,
    tax_amount: taxAmount,
    discount_amount: discountAmount,
    total_amount: totalAmount,
    status: 'draft',
    items,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  salesOrders.push(newSalesOrder)
  await writeSalesOrders(salesOrders)
  return newSalesOrder
}

export async function updateSalesOrder(id: string, data: UpdateSalesOrderRequest): Promise<SalesOrder | null> {
  const salesOrders = await readSalesOrders()
  const index = salesOrders.findIndex(so => so.id === id)
  if (index === -1) return null
  
  let updatedSO = { ...salesOrders[index] }
  
  if (data.items) {
    const items = data.items.map((item, index) => {
      const existingItem = updatedSO.items[index]
      return {
        id: item.id || existingItem?.id || `so_item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        product_name: item.product_name,
        sku: item.sku,
        description: item.description,
        quantity: item.quantity,
        unit: item.unit,
        unit_price: item.unit_price,
        total_price: item.quantity * item.unit_price,
        discount_rate: item.discount_rate,
        shipped_quantity: item.shipped_quantity || existingItem?.shipped_quantity || 0,
        remaining_quantity: item.quantity - (item.shipped_quantity || existingItem?.shipped_quantity || 0),
      }
    })
    const subtotal = items.reduce((sum, item) => sum + item.total_price, 0)
    const taxAmount = subtotal * 0.1
    const discountAmount = items.reduce((sum, item) => sum + (item.total_price * (item.discount_rate / 100)), 0)
    const totalAmount = subtotal + taxAmount - discountAmount
    
    updatedSO = {
      ...updatedSO,
      items,
      subtotal,
      tax_amount: taxAmount,
      discount_amount: discountAmount,
      total_amount: totalAmount,
    }
  }
  
  updatedSO = {
    ...updatedSO,
    ...data,
    updated_at: new Date().toISOString(),
  }
  
  salesOrders[index] = updatedSO
  await writeSalesOrders(salesOrders)
  return updatedSO
}

export async function deleteSalesOrder(id: string): Promise<boolean> {
  const salesOrders = await readSalesOrders()
  const filtered = salesOrders.filter(so => so.id !== id)
  if (filtered.length === salesOrders.length) return false
  await writeSalesOrders(filtered)
  return true
}

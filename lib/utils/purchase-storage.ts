import { Vendor, PurchaseOrder, CreateVendorRequest, UpdateVendorRequest, CreatePurchaseOrderRequest, UpdatePurchaseOrderRequest } from '@/types/purchase'
import { promises as fs } from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const VENDORS_FILE = path.join(DATA_DIR, 'vendors.json')
const PURCHASE_ORDERS_FILE = path.join(DATA_DIR, 'purchase-orders.json')

export async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

export async function readVendors(): Promise<Vendor[]> {
  await ensureDataDir()
  try {
    const data = await fs.readFile(VENDORS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

export async function writeVendors(vendors: Vendor[]): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(VENDORS_FILE, JSON.stringify(vendors, null, 2))
}

export async function createVendor(data: CreateVendorRequest): Promise<Vendor> {
  const vendors = await readVendors()
  const newVendor: Vendor = {
    id: `vendor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...data,
    status: 'active',
    rating: data.rating || 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  vendors.push(newVendor)
  await writeVendors(vendors)
  return newVendor
}

export async function updateVendor(id: string, data: UpdateVendorRequest): Promise<Vendor | null> {
  const vendors = await readVendors()
  const index = vendors.findIndex(v => v.id === id)
  if (index === -1) return null
  
  vendors[index] = {
    ...vendors[index],
    ...data,
    updated_at: new Date().toISOString(),
  }
  await writeVendors(vendors)
  return vendors[index]
}

export async function deleteVendor(id: string): Promise<boolean> {
  const vendors = await readVendors()
  const filtered = vendors.filter(v => v.id !== id)
  if (filtered.length === vendors.length) return false
  await writeVendors(filtered)
  return true
}

export async function readPurchaseOrders(): Promise<PurchaseOrder[]> {
  await ensureDataDir()
  try {
    const data = await fs.readFile(PURCHASE_ORDERS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

export async function writePurchaseOrders(purchaseOrders: PurchaseOrder[]): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(PURCHASE_ORDERS_FILE, JSON.stringify(purchaseOrders, null, 2))
}

export async function createPurchaseOrder(data: CreatePurchaseOrderRequest): Promise<PurchaseOrder> {
  const purchaseOrders = await readPurchaseOrders()
  
  // Calculate totals
  const items = data.items.map(item => ({
    ...item,
    id: `poi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    total_price: item.quantity * item.unit_price,
    received_quantity: 0,
    remaining_quantity: item.quantity,
  }))
  
  const subtotal = items.reduce((sum, item) => sum + item.total_price, 0)
  const taxAmount = subtotal * 0.1 // 10% tax
  const totalAmount = subtotal + taxAmount
  
  const newPurchaseOrder: PurchaseOrder = {
    id: `po_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    po_number: `PO-${new Date().getFullYear()}-${String(purchaseOrders.length + 1).padStart(4, '0')}`,
    ...data,
    subtotal,
    tax_amount: taxAmount,
    total_amount: totalAmount,
    status: 'draft',
    items,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  purchaseOrders.push(newPurchaseOrder)
  await writePurchaseOrders(purchaseOrders)
  return newPurchaseOrder
}

export async function updatePurchaseOrder(id: string, data: UpdatePurchaseOrderRequest): Promise<PurchaseOrder | null> {
  const purchaseOrders = await readPurchaseOrders()
  const index = purchaseOrders.findIndex(po => po.id === id)
  if (index === -1) return null
  
  let updatedPO = { ...purchaseOrders[index] }
  
  if (data.items) {
    const items = data.items.map((item, index) => {
      const existingItem = updatedPO.items[index]
      return {
        id: item.id || existingItem?.id || `poi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        product_name: item.product_name,
        sku: item.sku,
        description: item.description,
        quantity: item.quantity,
        unit: item.unit,
        unit_price: item.unit_price,
        total_price: item.quantity * item.unit_price,
        received_quantity: item.received_quantity || existingItem?.received_quantity || 0,
        remaining_quantity: item.quantity - (item.received_quantity || existingItem?.received_quantity || 0),
      }
    })
    const subtotal = items.reduce((sum, item) => sum + item.total_price, 0)
    const taxAmount = subtotal * 0.1
    const totalAmount = subtotal + taxAmount
    
    updatedPO = {
      ...updatedPO,
      items,
      subtotal,
      tax_amount: taxAmount,
      total_amount: totalAmount,
    }
  }
  
  updatedPO = {
    ...updatedPO,
    ...data,
    updated_at: new Date().toISOString(),
  }
  
  purchaseOrders[index] = updatedPO
  await writePurchaseOrders(purchaseOrders)
  return updatedPO
}

export async function deletePurchaseOrder(id: string): Promise<boolean> {
  const purchaseOrders = await readPurchaseOrders()
  const filtered = purchaseOrders.filter(po => po.id !== id)
  if (filtered.length === purchaseOrders.length) return false
  await writePurchaseOrders(filtered)
  return true
}

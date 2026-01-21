import { Warehouse, WarehouseZone, WarehouseLocation, StockTransfer, StockAdjustment, WarehouseInventory, CreateWarehouseRequest, UpdateWarehouseRequest, CreateStockTransferRequest, UpdateStockTransferRequest, CreateStockAdjustmentRequest, UpdateStockAdjustmentRequest } from '@/types/warehouse'
import { promises as fs } from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const WAREHOUSES_FILE = path.join(DATA_DIR, 'warehouses.json')
const ZONES_FILE = path.join(DATA_DIR, 'warehouse-zones.json')
const LOCATIONS_FILE = path.join(DATA_DIR, 'warehouse-locations.json')
const TRANSFERS_FILE = path.join(DATA_DIR, 'stock-transfers.json')
const ADJUSTMENTS_FILE = path.join(DATA_DIR, 'stock-adjustments.json')
const INVENTORY_FILE = path.join(DATA_DIR, 'warehouse-inventory.json')

export async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

export async function readWarehouses(): Promise<Warehouse[]> {
  await ensureDataDir()
  try {
    const data = await fs.readFile(WAREHOUSES_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

export async function writeWarehouses(warehouses: Warehouse[]): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(WAREHOUSES_FILE, JSON.stringify(warehouses, null, 2))
}

export async function createWarehouse(data: CreateWarehouseRequest): Promise<Warehouse> {
  const warehouses = await readWarehouses()
  const newWarehouse: Warehouse = {
    id: `warehouse_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...data,
    used_capacity: 0,
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  warehouses.push(newWarehouse)
  await writeWarehouses(warehouses)
  return newWarehouse
}

export async function updateWarehouse(id: string, data: UpdateWarehouseRequest): Promise<Warehouse | null> {
  const warehouses = await readWarehouses()
  const index = warehouses.findIndex(w => w.id === id)
  if (index === -1) return null
  
  warehouses[index] = {
    ...warehouses[index],
    ...data,
    updated_at: new Date().toISOString(),
  }
  await writeWarehouses(warehouses)
  return warehouses[index]
}

export async function deleteWarehouse(id: string): Promise<boolean> {
  const warehouses = await readWarehouses()
  const filtered = warehouses.filter(w => w.id !== id)
  if (filtered.length === warehouses.length) return false
  await writeWarehouses(filtered)
  return true
}

export async function readStockTransfers(): Promise<StockTransfer[]> {
  await ensureDataDir()
  try {
    const data = await fs.readFile(TRANSFERS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

export async function writeStockTransfers(transfers: StockTransfer[]): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(TRANSFERS_FILE, JSON.stringify(transfers, null, 2))
}

export async function createStockTransfer(data: CreateStockTransferRequest): Promise<StockTransfer> {
  const transfers = await readStockTransfers()
  const newTransfer: StockTransfer = {
    id: `transfer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    transfer_number: `ST-${new Date().getFullYear()}-${String(transfers.length + 1).padStart(4, '0')}`,
    ...data,
    status: 'pending',
    requested_date: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  transfers.push(newTransfer)
  await writeStockTransfers(transfers)
  return newTransfer
}

export async function updateStockTransfer(id: string, data: UpdateStockTransferRequest): Promise<StockTransfer | null> {
  const transfers = await readStockTransfers()
  const index = transfers.findIndex(t => t.id === id)
  if (index === -1) return null
  
  transfers[index] = {
    ...transfers[index],
    ...data,
    updated_at: new Date().toISOString(),
  }
  await writeStockTransfers(transfers)
  return transfers[index]
}

export async function deleteStockTransfer(id: string): Promise<boolean> {
  const transfers = await readStockTransfers()
  const filtered = transfers.filter(t => t.id !== id)
  if (filtered.length === transfers.length) return false
  await writeStockTransfers(filtered)
  return true
}

export async function readStockAdjustments(): Promise<StockAdjustment[]> {
  await ensureDataDir()
  try {
    const data = await fs.readFile(ADJUSTMENTS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

export async function writeStockAdjustments(adjustments: StockAdjustment[]): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(ADJUSTMENTS_FILE, JSON.stringify(adjustments, null, 2))
}

export async function createStockAdjustment(data: CreateStockAdjustmentRequest): Promise<StockAdjustment> {
  const adjustments = await readStockAdjustments()
  const newAdjustment: StockAdjustment = {
    id: `adjustment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    adjustment_number: `SA-${new Date().getFullYear()}-${String(adjustments.length + 1).padStart(4, '0')}`,
    ...data,
    status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  adjustments.push(newAdjustment)
  await writeStockAdjustments(adjustments)
  return newAdjustment
}

export async function updateStockAdjustment(id: string, data: UpdateStockAdjustmentRequest): Promise<StockAdjustment | null> {
  const adjustments = await readStockAdjustments()
  const index = adjustments.findIndex(a => a.id === id)
  if (index === -1) return null
  
  adjustments[index] = {
    ...adjustments[index],
    ...data,
    updated_at: new Date().toISOString(),
  }
  await writeStockAdjustments(adjustments)
  return adjustments[index]
}

export async function deleteStockAdjustment(id: string): Promise<boolean> {
  const adjustments = await readStockAdjustments()
  const filtered = adjustments.filter(a => a.id !== id)
  if (filtered.length === adjustments.length) return false
  await writeStockAdjustments(filtered)
  return true
}

export async function readWarehouseInventory(): Promise<WarehouseInventory[]> {
  await ensureDataDir()
  try {
    const data = await fs.readFile(INVENTORY_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

export async function writeWarehouseInventory(inventory: WarehouseInventory[]): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(INVENTORY_FILE, JSON.stringify(inventory, null, 2))
}

export async function updateWarehouseInventory(
  warehouseId: string,
  productSku: string,
  quantity: number,
  adjustmentType: 'increase' | 'decrease'
): Promise<WarehouseInventory | null> {
  const inventory = await readWarehouseInventory()
  const index = inventory.findIndex(item => 
    item.warehouse_id === warehouseId && item.product_sku === productSku
  )
  
  if (index === -1) {
    // Create new inventory record
    const newItem: WarehouseInventory = {
      id: `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      warehouse_id: warehouseId,
      product_sku: productSku,
      product_name: 'Unknown Product',
      quantity_on_hand: adjustmentType === 'increase' ? quantity : 0,
      quantity_reserved: 0,
      quantity_available: adjustmentType === 'increase' ? quantity : 0,
      reorder_level: 10,
      max_stock: 1000,
      min_stock: 5,
      average_cost: 0,
      total_value: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    inventory.push(newItem)
    await writeWarehouseInventory(inventory)
    return newItem
  } else {
    // Update existing record
    const item = inventory[index]
    const adjustment = adjustmentType === 'increase' ? quantity : -quantity
    item.quantity_on_hand += adjustment
    item.quantity_available = item.quantity_on_hand - item.quantity_reserved
    item.total_value = item.quantity_on_hand * item.average_cost
    item.updated_at = new Date().toISOString()
    
    await writeWarehouseInventory(inventory)
    return item
  }
}

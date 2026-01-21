import { WorkOrder, BOMItem, ProductionSchedule, CreateWorkOrderRequest, UpdateWorkOrderRequest, CreateBOMRequest, UpdateBOMRequest } from '@/types/production'
import { promises as fs } from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const WORK_ORDERS_FILE = path.join(DATA_DIR, 'work-orders.json')
const BOM_FILE = path.join(DATA_DIR, 'bom.json')
const SCHEDULE_FILE = path.join(DATA_DIR, 'production-schedule.json')

export async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

export async function readWorkOrders(): Promise<WorkOrder[]> {
  await ensureDataDir()
  try {
    const data = await fs.readFile(WORK_ORDERS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

export async function writeWorkOrders(workOrders: WorkOrder[]): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(WORK_ORDERS_FILE, JSON.stringify(workOrders, null, 2))
}

export async function createWorkOrder(data: CreateWorkOrderRequest): Promise<WorkOrder> {
  const workOrders = await readWorkOrders()
  const newWorkOrder: WorkOrder = {
    id: `wo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...data,
    status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  workOrders.push(newWorkOrder)
  await writeWorkOrders(workOrders)
  return newWorkOrder
}

export async function updateWorkOrder(id: string, data: UpdateWorkOrderRequest): Promise<WorkOrder | null> {
  const workOrders = await readWorkOrders()
  const index = workOrders.findIndex(wo => wo.id === id)
  if (index === -1) return null
  
  workOrders[index] = {
    ...workOrders[index],
    ...data,
    updated_at: new Date().toISOString(),
  }
  await writeWorkOrders(workOrders)
  return workOrders[index]
}

export async function deleteWorkOrder(id: string): Promise<boolean> {
  const workOrders = await readWorkOrders()
  const filtered = workOrders.filter(wo => wo.id !== id)
  if (filtered.length === workOrders.length) return false
  await writeWorkOrders(filtered)
  return true
}

export async function readBOMs(): Promise<BOMItem[]> {
  await ensureDataDir()
  try {
    const data = await fs.readFile(BOM_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

export async function writeBOMs(boms: BOMItem[]): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(BOM_FILE, JSON.stringify(boms, null, 2))
}

export async function createBOM(data: CreateBOMRequest): Promise<BOMItem> {
  const boms = await readBOMs()
  const components = data.components.map(comp => ({
    ...comp,
    total_cost: comp.quantity * comp.unit_cost
  }))
  const totalCost = components.reduce((sum, comp) => sum + comp.total_cost, 0)
  
  const newBOM: BOMItem = {
    id: `bom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...data,
    components,
    total_cost: totalCost,
    version: '1.0',
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  boms.push(newBOM)
  await writeBOMs(boms)
  return newBOM
}

export async function updateBOM(id: string, data: UpdateBOMRequest): Promise<BOMItem | null> {
  const boms = await readBOMs()
  const index = boms.findIndex(bom => bom.id === id)
  if (index === -1) return null
  
  const updatedBOM: BOMItem = { ...boms[index] }
  
  if (data.components) {
    const components = data.components.map(comp => ({
      ...comp,
      total_cost: comp.quantity * comp.unit_cost
    }))
    const totalCost = components.reduce((sum, comp) => sum + comp.total_cost, 0)
    updatedBOM.components = components
    updatedBOM.total_cost = totalCost
  }
  
  // Apply other updates
  if (data.bom_code !== undefined) updatedBOM.bom_code = data.bom_code
  if (data.product_name !== undefined) updatedBOM.product_name = data.product_name
  if (data.product_sku !== undefined) updatedBOM.product_sku = data.product_sku
  if (data.currency !== undefined) updatedBOM.currency = data.currency
  if (data.active !== undefined) updatedBOM.active = data.active
  if (data.total_cost !== undefined && !data.components) updatedBOM.total_cost = data.total_cost
  
  updatedBOM.updated_at = new Date().toISOString()
  
  boms[index] = updatedBOM
  await writeBOMs(boms)
  return updatedBOM
}

export async function deleteBOM(id: string): Promise<boolean> {
  const boms = await readBOMs()
  const filtered = boms.filter(bom => bom.id !== id)
  if (filtered.length === boms.length) return false
  await writeBOMs(filtered)
  return true
}

export async function readProductionSchedule(): Promise<ProductionSchedule[]> {
  await ensureDataDir()
  try {
    const data = await fs.readFile(SCHEDULE_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

export async function writeProductionSchedule(schedule: ProductionSchedule[]): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(SCHEDULE_FILE, JSON.stringify(schedule, null, 2))
}

import { Asset, AssetCategory, MaintenanceRecord, AssetDisposal, CreateAssetRequest, UpdateAssetRequest, CreateMaintenanceRecordRequest, UpdateMaintenanceRecordRequest, CreateAssetDisposalRequest, UpdateAssetDisposalRequest } from '@/types/assets'
import { promises as fs } from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const ASSETS_FILE = path.join(DATA_DIR, 'assets.json')
const CATEGORIES_FILE = path.join(DATA_DIR, 'asset-categories.json')
const MAINTENANCE_FILE = path.join(DATA_DIR, 'maintenance-records.json')
const DISPOSALS_FILE = path.join(DATA_DIR, 'asset-disposals.json')

export async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

export async function readAssets(): Promise<Asset[]> {
  await ensureDataDir()
  try {
    const data = await fs.readFile(ASSETS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

export async function writeAssets(assets: Asset[]): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(ASSETS_FILE, JSON.stringify(assets, null, 2))
}

export async function createAsset(data: CreateAssetRequest): Promise<Asset> {
  const assets = await readAssets()
  
  // Calculate depreciation
  const annualDepreciation = calculateAnnualDepreciation(
    data.purchase_cost,
    data.salvage_value,
    data.useful_life_years,
    data.depreciation_method
  )
  
  const newAsset: Asset = {
    id: `asset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...data,
    current_value: data.purchase_cost,
    accumulated_depreciation: 0,
    annual_depreciation: annualDepreciation,
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  assets.push(newAsset)
  await writeAssets(assets)
  return newAsset
}

export async function updateAsset(id: string, data: UpdateAssetRequest): Promise<Asset | null> {
  const assets = await readAssets()
  const index = assets.findIndex(a => a.id === id)
  if (index === -1) return null
  
  const asset = assets[index]
  let updatedAsset = { ...asset, ...data }
  
  // Recalculate depreciation if parameters changed
  if (data.purchase_cost !== undefined || data.salvage_value !== undefined || data.useful_life_years !== undefined || data.depreciation_method !== undefined) {
    const purchaseCost = data.purchase_cost !== undefined ? data.purchase_cost : asset.purchase_cost
    const salvageValue = data.salvage_value !== undefined ? data.salvage_value : asset.salvage_value
    const usefulLifeYears = data.useful_life_years !== undefined ? data.useful_life_years : asset.useful_life_years
    const depreciationMethod = data.depreciation_method !== undefined ? data.depreciation_method : asset.depreciation_method
    
    const annualDepreciation = calculateAnnualDepreciation(
      purchaseCost,
      salvageValue,
      usefulLifeYears,
      depreciationMethod
    )
    
    updatedAsset = {
      ...updatedAsset,
      annual_depreciation: annualDepreciation,
      updated_at: new Date().toISOString(),
    }
  }
  
  assets[index] = updatedAsset
  await writeAssets(assets)
  return updatedAsset
}

export async function deleteAsset(id: string): Promise<boolean> {
  const assets = await readAssets()
  const filtered = assets.filter(a => a.id !== id)
  if (filtered.length === assets.length) return false
  await writeAssets(filtered)
  return true
}

export async function readMaintenanceRecords(): Promise<MaintenanceRecord[]> {
  await ensureDataDir()
  try {
    const data = await fs.readFile(MAINTENANCE_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

export async function writeMaintenanceRecords(records: MaintenanceRecord[]): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(MAINTENANCE_FILE, JSON.stringify(records, null, 2))
}

export async function createMaintenanceRecord(data: CreateMaintenanceRecordRequest): Promise<MaintenanceRecord> {
  const records = await readMaintenanceRecords()
  
  const partsUsed = data.parts_used?.map(part => ({
    ...part,
    id: `part_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    total_cost: part.quantity * part.unit_cost,
  })) || []
  
  const newRecord: MaintenanceRecord = {
    id: `maintenance_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...data,
    parts_used: partsUsed,
    status: 'scheduled',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  records.push(newRecord)
  await writeMaintenanceRecords(records)
  return newRecord
}

export async function updateMaintenanceRecord(id: string, data: UpdateMaintenanceRecordRequest): Promise<MaintenanceRecord | null> {
  const records = await readMaintenanceRecords()
  const index = records.findIndex(r => r.id === id)
  if (index === -1) return null
  
  let updatedRecord = { ...records[index] }
  
  if (data.parts_used) {
    const partsUsed = data.parts_used.map(part => ({
      part_name: part.part_name,
      quantity: part.quantity,
      unit_cost: part.unit_cost,
      id: part.id || `part_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      total_cost: part.quantity * part.unit_cost,
    }))
    updatedRecord = {
      ...updatedRecord,
      parts_used: partsUsed,
    }
  }
  
  updatedRecord = {
    ...updatedRecord,
    ...data,
    updated_at: new Date().toISOString(),
  }
  
  records[index] = updatedRecord
  await writeMaintenanceRecords(records)
  return updatedRecord
}

export async function deleteMaintenanceRecord(id: string): Promise<boolean> {
  const records = await readMaintenanceRecords()
  const filtered = records.filter(r => r.id !== id)
  if (filtered.length === records.length) return false
  await writeMaintenanceRecords(filtered)
  return true
}

export async function readAssetDisposals(): Promise<AssetDisposal[]> {
  await ensureDataDir()
  try {
    const data = await fs.readFile(DISPOSALS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

export async function writeAssetDisposals(disposals: AssetDisposal[]): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(DISPOSALS_FILE, JSON.stringify(disposals, null, 2))
}

export async function createAssetDisposal(data: CreateAssetDisposalRequest): Promise<AssetDisposal> {
  const disposals = await readAssetDisposals()
  const netProceeds = data.disposal_value - data.disposal_cost
  
  const newDisposal: AssetDisposal = {
    id: `disposal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...data,
    net_proceeds: netProceeds,
    status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  disposals.push(newDisposal)
  await writeAssetDisposals(disposals)
  return newDisposal
}

export async function updateAssetDisposal(id: string, data: UpdateAssetDisposalRequest): Promise<AssetDisposal | null> {
  const disposals = await readAssetDisposals()
  const index = disposals.findIndex(d => d.id === id)
  if (index === -1) return null
  
  let updatedDisposal = { ...disposals[index] }
  
  if (data.disposal_value !== undefined || data.disposal_cost !== undefined) {
    const disposalValue = data.disposal_value ?? updatedDisposal.disposal_value
    const disposalCost = data.disposal_cost ?? updatedDisposal.disposal_cost
    updatedDisposal = {
      ...updatedDisposal,
      disposal_value: disposalValue,
      disposal_cost: disposalCost,
      net_proceeds: disposalValue - disposalCost,
    }
  }
  
  updatedDisposal = {
    ...updatedDisposal,
    ...data,
    updated_at: new Date().toISOString(),
  }
  
  disposals[index] = updatedDisposal
  await writeAssetDisposals(disposals)
  return updatedDisposal
}

export async function deleteAssetDisposal(id: string): Promise<boolean> {
  const disposals = await readAssetDisposals()
  const filtered = disposals.filter(d => d.id !== id)
  if (filtered.length === disposals.length) return false
  await writeAssetDisposals(filtered)
  return true
}

function calculateAnnualDepreciation(
  purchaseCost: number,
  salvageValue: number,
  usefulLifeYears: number,
  method: 'straight_line' | 'declining_balance' | 'sum_of_years' | 'units_of_production'
): number {
  const depreciableAmount = purchaseCost - salvageValue
  
  switch (method) {
    case 'straight_line':
      return depreciableAmount / usefulLifeYears
    
    case 'declining_balance':
      return (purchaseCost * 2) / usefulLifeYears
    
    case 'sum_of_years':
      const sumOfYears = (usefulLifeYears * (usefulLifeYears + 1)) / 2
      return (depreciableAmount * usefulLifeYears) / sumOfYears
    
    case 'units_of_production':
    default:
      return depreciableAmount / usefulLifeYears // Default to straight line
  }
}

export async function updateAssetDepreciation(): Promise<void> {
  const assets = await readAssets()
  const currentDate = new Date()
  
  const updatedAssets = assets.map(asset => {
    if (asset.status !== 'active') return asset
    
    const purchaseDate = new Date(asset.purchase_date)
    const yearsElapsed = (currentDate.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24 * 365)
    
    if (yearsElapsed >= asset.useful_life_years) {
      return {
        ...asset,
        current_value: asset.salvage_value,
        accumulated_depreciation: asset.purchase_cost - asset.salvage_value,
      }
    }
    
    const totalDepreciation = asset.annual_depreciation * Math.min(yearsElapsed, asset.useful_life_years)
    const currentValue = Math.max(asset.purchase_cost - totalDepreciation, asset.salvage_value)
    
    return {
      ...asset,
      current_value: currentValue,
      accumulated_depreciation: totalDepreciation,
    }
  })
  
  await writeAssets(updatedAssets)
}

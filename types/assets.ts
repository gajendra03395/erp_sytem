export interface Asset {
  id: string
  asset_code: string
  name: string
  description?: string
  category: string
  subcategory?: string
  brand?: string
  model?: string
  serial_number?: string
  purchase_date: string
  purchase_cost: number
  current_value: number
  depreciation_method: 'straight_line' | 'declining_balance' | 'sum_of_years' | 'units_of_production'
  useful_life_years: number
  salvage_value: number
  accumulated_depreciation: number
  annual_depreciation: number
  status: 'active' | 'inactive' | 'disposed' | 'under_maintenance' | 'lost'
  location?: string
  department?: string
  assigned_to?: string
  warranty_expiry?: string
  maintenance_schedule?: string
  last_maintenance_date?: string
  next_maintenance_date?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface AssetCategory {
  id: string
  name: string
  description?: string
  parent_id?: string
  depreciation_method: 'straight_line' | 'declining_balance' | 'sum_of_years' | 'units_of_production'
  useful_life_years: number
  salvage_value_percentage: number
  created_at: string
  updated_at: string
}

export interface MaintenanceRecord {
  id: string
  asset_id: string
  maintenance_type: 'preventive' | 'corrective' | 'emergency' | 'calibration'
  description: string
  scheduled_date: string
  completed_date?: string
  cost: number
  performed_by?: string
  parts_used?: MaintenancePart[]
  notes?: string
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  created_at: string
  updated_at: string
}

export interface MaintenancePart {
  id: string
  part_name: string
  quantity: number
  unit_cost: number
  total_cost: number
}

export interface AssetDisposal {
  id: string
  asset_id: string
  disposal_type: 'sale' | 'scrap' | 'donation' | 'theft' | 'loss' | 'other'
  disposal_date: string
  disposal_value: number
  disposal_cost: number
  net_proceeds: number
  buyer_name?: string
  buyer_contact?: string
  notes?: string
  approved_by?: string
  status: 'pending' | 'approved' | 'completed' | 'rejected'
  created_at: string
  updated_at: string
}

export interface AssetTransfer {
  id: string
  asset_id: string
  from_location?: string
  from_department?: string
  from_assigned_to?: string
  to_location?: string
  to_department?: string
  to_assigned_to?: string
  transfer_date: string
  reason?: string
  notes?: string
  status: 'pending' | 'approved' | 'completed' | 'rejected'
  approved_by?: string
  created_at: string
  updated_at: string
}

export interface CreateAssetRequest {
  asset_code: string
  name: string
  description?: string
  category: string
  subcategory?: string
  brand?: string
  model?: string
  serial_number?: string
  purchase_date: string
  purchase_cost: number
  depreciation_method: 'straight_line' | 'declining_balance' | 'sum_of_years' | 'units_of_production'
  useful_life_years: number
  salvage_value: number
  location?: string
  department?: string
  assigned_to?: string
  warranty_expiry?: string
  maintenance_schedule?: string
  notes?: string
}

export interface UpdateAssetRequest {
  asset_code?: string
  name?: string
  description?: string
  category?: string
  subcategory?: string
  brand?: string
  model?: string
  serial_number?: string
  purchase_cost?: number
  current_value?: number
  depreciation_method?: 'straight_line' | 'declining_balance' | 'sum_of_years' | 'units_of_production'
  useful_life_years?: number
  salvage_value?: number
  status?: 'active' | 'inactive' | 'disposed' | 'under_maintenance' | 'lost'
  location?: string
  department?: string
  assigned_to?: string
  warranty_expiry?: string
  maintenance_schedule?: string
  last_maintenance_date?: string
  next_maintenance_date?: string
  notes?: string
}

export interface CreateMaintenanceRecordRequest {
  asset_id: string
  maintenance_type: 'preventive' | 'corrective' | 'emergency' | 'calibration'
  description: string
  scheduled_date: string
  cost: number
  performed_by?: string
  parts_used?: Omit<MaintenancePart, 'id' | 'total_cost'>[]
  notes?: string
}

export interface UpdateMaintenanceRecordRequest {
  maintenance_type?: 'preventive' | 'corrective' | 'emergency' | 'calibration'
  description?: string
  scheduled_date?: string
  completed_date?: string
  cost?: number
  performed_by?: string
  parts_used?: MaintenancePart[]
  notes?: string
  status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
}

export interface CreateAssetDisposalRequest {
  asset_id: string
  disposal_type: 'sale' | 'scrap' | 'donation' | 'theft' | 'loss' | 'other'
  disposal_date: string
  disposal_value: number
  disposal_cost: number
  buyer_name?: string
  buyer_contact?: string
  notes?: string
}

export interface UpdateAssetDisposalRequest {
  disposal_type?: 'sale' | 'scrap' | 'donation' | 'theft' | 'loss' | 'other'
  disposal_date?: string
  disposal_value?: number
  disposal_cost?: number
  buyer_name?: string
  buyer_contact?: string
  notes?: string
  approved_by?: string
  status?: 'pending' | 'approved' | 'completed' | 'rejected'
}

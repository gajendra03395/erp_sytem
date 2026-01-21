export interface WorkOrder {
  id: string
  order_no: string
  product_name: string
  product_sku: string
  quantity: number
  unit: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  start_date: string
  due_date: string
  completion_date?: string
  assigned_to?: string
  bom_id?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface BOMItem {
  id: string
  bom_code: string
  product_name: string
  product_sku: string
  version: string
  components: BOMComponent[]
  total_cost: number
  currency: string
  active: boolean
  created_at: string
  updated_at: string
}

export interface BOMComponent {
  material_id: string
  material_name: string
  quantity: number
  unit: string
  unit_cost: number
  total_cost: number
}

export interface ProductionSchedule {
  id: string
  work_order_id: string
  machine_id: string
  employee_id?: string
  planned_start: string
  planned_end: string
  actual_start?: string
  actual_end?: string
  status: 'scheduled' | 'in_progress' | 'completed' | 'delayed'
  notes?: string
}

export interface CreateWorkOrderRequest {
  order_no: string
  product_name: string
  product_sku: string
  quantity: number
  unit: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  start_date: string
  due_date: string
  assigned_to?: string
  bom_id?: string
  notes?: string
}

export interface UpdateWorkOrderRequest {
  product_name?: string
  product_sku?: string
  quantity?: number
  unit?: string
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  start_date?: string
  due_date?: string
  completion_date?: string
  assigned_to?: string
  bom_id?: string
  notes?: string
}

export interface CreateBOMRequest {
  bom_code: string
  product_name: string
  product_sku: string
  components: Omit<BOMComponent, 'total_cost'>[]
  currency: string
}

export interface UpdateBOMRequest {
  bom_code?: string
  product_name?: string
  product_sku?: string
  components?: Omit<BOMComponent, 'total_cost'>[]
  total_cost?: number
  currency?: string
  active?: boolean
}

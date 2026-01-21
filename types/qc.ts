export type QCResult = 'pass' | 'fail' | 'pending'

export interface QualityControl {
  id: string
  batch_no: string
  product_name: string
  quantity_inspected: number
  result: QCResult
  inspector_name: string
  inspector_id: string // Reference to employee
  inspection_date: Date
  defect_reason?: string // Required if result is 'fail'
  notes?: string
  created_at: Date
  updated_at: Date
}

export interface CreateQC {
  batch_no: string
  product_name: string
  quantity_inspected: number
  result: QCResult
  inspector_name: string
  inspector_id: string
  inspection_date: Date
  defect_reason?: string
  notes?: string
}

export interface UpdateQC {
  batch_no?: string
  result?: QCResult
  inspector_name?: string
  inspector_id?: string
  inspection_date?: Date
  notes?: string
}

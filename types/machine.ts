export type MachineStatus = 'running' | 'under_maintenance' | 'idle'

export interface Machine {
  id: string
  machine_name: string
  machine_type: string
  status: MachineStatus
  last_service_date: Date
  next_service_date?: Date
  location?: string
  notes?: string
  created_at: Date
  updated_at: Date
}

export interface CreateMachine {
  machine_name: string
  machine_type: string
  status?: MachineStatus
  last_service_date: Date
  next_service_date?: Date
  location?: string
  notes?: string
}

export interface UpdateMachine {
  machine_name?: string
  machine_type?: string
  status?: MachineStatus
  last_service_date?: Date
  next_service_date?: Date
  location?: string
  notes?: string
}

export interface MaintenanceLog {
  id: string
  machine_id: string
  machine_name: string
  service_date: Date
  service_type: string
  technician_name?: string
  notes?: string
  cost?: number
  created_at: Date
}

export interface CreateMaintenanceLog {
  machine_id: string
  machine_name: string
  service_date: Date
  service_type: string
  technician_name?: string
  notes?: string
  cost?: number
}

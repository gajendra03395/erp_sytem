export type EmployeeDepartment = 'production' | 'qc' | 'maintenance' | 'admin'

export type EmployeeStatus = 'active' | 'inactive' | 'on_leave'

export type EmployeeRole = 'ADMIN' | 'SUPERVISOR' | 'OPERATOR' | 'SUPERUSER'

export type EmployeeShift = 'Day' | 'Night'

export interface Employee {
  id: string
  name: string
  email: string
  department: EmployeeDepartment
  role: EmployeeRole
  status: EmployeeStatus
  employee_id: string // Unique employee ID
  phone?: string
  shift: EmployeeShift
  created_at: Date
  updated_at: Date
}

export interface CreateEmployee {
  name: string
  email: string
  department: EmployeeDepartment
  role: EmployeeRole
  status?: EmployeeStatus
  employee_id: string
  phone?: string
  shift: EmployeeShift
}

export interface UpdateEmployee {
  name?: string
  email?: string
  department?: EmployeeDepartment
  role?: EmployeeRole
  status?: EmployeeStatus
  phone?: string
  shift?: EmployeeShift
}

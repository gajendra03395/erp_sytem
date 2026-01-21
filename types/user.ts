export type UserRole = 'admin' | 'employee'

export interface User {
  id: string
  email: string
  password_hash: string
  role: UserRole
  employee_id?: string // Reference to employee if role is 'employee'
  created_at: Date
  updated_at: Date
}

export interface CreateUser {
  email: string
  password: string
  role: UserRole
  employee_id?: string
}

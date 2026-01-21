export interface Employee {
  id: string
  employee_code: string
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  country: string
  postal_code: string
  department: string
  designation: string
  employment_type: 'full_time' | 'part_time' | 'contract' | 'intern'
  hire_date: string
  termination_date?: string
  status: 'active' | 'inactive' | 'terminated'
  bank_account: string
  bank_name: string
  tax_id: string
  social_security_number: string
  basic_salary: number
  allowances: Allowance[]
  deductions: Deduction[]
  created_at: string
  updated_at: string
}

export interface Allowance {
  id: string
  name: string
  amount: number
  type: 'fixed' | 'percentage'
  is_taxable: boolean
}

export interface Deduction {
  id: string
  name: string
  amount: number
  type: 'fixed' | 'percentage'
}

export interface Payroll {
  id: string
  payroll_number: string
  employee_id: string
  pay_period_start: string
  pay_period_end: string
  payment_date: string
  basic_salary: number
  gross_salary: number
  total_allowances: number
  total_deductions: number
  net_salary: number
  tax_deduction: number
  other_deductions: number
  overtime_hours: number
  overtime_rate: number
  overtime_amount: number
  leave_days: number
  leave_deduction: number
  bonus: number
  status: 'draft' | 'calculated' | 'approved' | 'paid' | 'cancelled'
  notes?: string
  created_at: string
  updated_at: string
}

export interface Attendance {
  id: string
  employee_id: string
  date: string
  check_in: string
  check_out?: string
  break_time?: number
  overtime_hours?: number
  status: 'present' | 'absent' | 'late' | 'half_day' | 'leave'
  notes?: string
  created_at: string
  updated_at: string
}

export interface Leave {
  id: string
  employee_id: string
  leave_type: 'sick' | 'casual' | 'annual' | 'maternity' | 'paternity' | 'unpaid'
  start_date: string
  end_date: string
  days: number
  status: 'pending' | 'approved' | 'rejected' | 'cancelled'
  reason?: string
  approved_by?: string
  approved_date?: string
  created_at: string
  updated_at: string
}

export interface CreateEmployeeRequest {
  employee_code: string
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  country: string
  postal_code: string
  department: string
  designation: string
  employment_type: 'full_time' | 'part_time' | 'contract' | 'intern'
  hire_date: string
  bank_account: string
  bank_name: string
  tax_id: string
  social_security_number: string
  basic_salary: number
  allowances?: Allowance[]
  deductions?: Deduction[]
}

export interface UpdateEmployeeRequest {
  employee_code?: string
  first_name?: string
  last_name?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  country?: string
  postal_code?: string
  department?: string
  designation?: string
  employment_type?: 'full_time' | 'part_time' | 'contract' | 'intern'
  termination_date?: string
  status?: 'active' | 'inactive' | 'terminated'
  bank_account?: string
  bank_name?: string
  tax_id?: string
  social_security_number?: string
  basic_salary?: number
  allowances?: Allowance[]
  deductions?: Deduction[]
}

export interface CreatePayrollRequest {
  employee_id: string
  pay_period_start: string
  pay_period_end: string
  payment_date: string
  overtime_hours?: number
  overtime_rate?: number
  leave_days?: number
  bonus?: number
  notes?: string
}

export interface UpdatePayrollRequest {
  pay_period_start?: string
  pay_period_end?: string
  payment_date?: string
  basic_salary?: number
  gross_salary?: number
  total_allowances?: number
  total_deductions?: number
  net_salary?: number
  tax_deduction?: number
  other_deductions?: number
  overtime_hours?: number
  overtime_rate?: number
  overtime_amount?: number
  leave_days?: number
  leave_deduction?: number
  bonus?: number
  status?: 'draft' | 'calculated' | 'approved' | 'paid' | 'cancelled'
  notes?: string
}

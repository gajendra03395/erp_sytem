import { Employee, Payroll, Attendance, Leave, CreateEmployeeRequest, UpdateEmployeeRequest, CreatePayrollRequest, UpdatePayrollRequest } from '@/types/payroll'
import { promises as fs } from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const EMPLOYEES_FILE = path.join(DATA_DIR, 'employees.json')
const PAYROLLS_FILE = path.join(DATA_DIR, 'payrolls.json')
const ATTENDANCE_FILE = path.join(DATA_DIR, 'attendance.json')
const LEAVES_FILE = path.join(DATA_DIR, 'leaves.json')

export async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

export async function readEmployees(): Promise<Employee[]> {
  await ensureDataDir()
  try {
    const data = await fs.readFile(EMPLOYEES_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

export async function writeEmployees(employees: Employee[]): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(EMPLOYEES_FILE, JSON.stringify(employees, null, 2))
}

export async function createEmployee(data: CreateEmployeeRequest): Promise<Employee> {
  const employees = await readEmployees()
  const newEmployee: Employee = {
    id: `employee_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...data,
    status: 'active',
    allowances: data.allowances || [],
    deductions: data.deductions || [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  employees.push(newEmployee)
  await writeEmployees(employees)
  return newEmployee
}

export async function updateEmployee(id: string, data: UpdateEmployeeRequest): Promise<Employee | null> {
  const employees = await readEmployees()
  const index = employees.findIndex(e => e.id === id)
  if (index === -1) return null
  
  employees[index] = {
    ...employees[index],
    ...data,
    updated_at: new Date().toISOString(),
  }
  await writeEmployees(employees)
  return employees[index]
}

export async function deleteEmployee(id: string): Promise<boolean> {
  const employees = await readEmployees()
  const filtered = employees.filter(e => e.id !== id)
  if (filtered.length === employees.length) return false
  await writeEmployees(filtered)
  return true
}

export async function readPayrolls(): Promise<Payroll[]> {
  await ensureDataDir()
  try {
    const data = await fs.readFile(PAYROLLS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

export async function writePayrolls(payrolls: Payroll[]): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(PAYROLLS_FILE, JSON.stringify(payrolls, null, 2))
}

export async function createPayroll(data: CreatePayrollRequest): Promise<Payroll> {
  const payrolls = await readPayrolls()
  const employees = await readEmployees()
  const employee = employees.find(e => e.id === data.employee_id)
  
  if (!employee) {
    throw new Error('Employee not found')
  }
  
  // Calculate salary components
  const basicSalary = employee.basic_salary
  const totalAllowances = employee.allowances.reduce((sum, allowance) => {
    return sum + (allowance.type === 'percentage' ? basicSalary * (allowance.amount / 100) : allowance.amount)
  }, 0)
  const grossSalary = basicSalary + totalAllowances
  
  const overtimeAmount = (data.overtime_hours || 0) * (data.overtime_rate || 0)
  const leaveDeduction = (data.leave_days || 0) * (basicSalary / 30)
  const totalEarnings = grossSalary + overtimeAmount + (data.bonus || 0) - leaveDeduction
  
  const taxDeduction = totalEarnings * 0.1 // 10% tax
  const totalDeductions = employee.deductions.reduce((sum, deduction) => {
    return sum + (deduction.type === 'percentage' ? basicSalary * (deduction.amount / 100) : deduction.amount)
  }, 0) + taxDeduction
  
  const netSalary = totalEarnings - totalDeductions
  
  const newPayroll: Payroll = {
    id: `payroll_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    payroll_number: `PAY-${new Date().getFullYear()}-${String(payrolls.length + 1).padStart(4, '0')}`,
    ...data,
    basic_salary: basicSalary,
    gross_salary: grossSalary,
    total_allowances: totalAllowances,
    total_deductions: totalDeductions,
    net_salary: netSalary,
    tax_deduction: taxDeduction,
    other_deductions: totalDeductions - taxDeduction,
    overtime_hours: data.overtime_hours || 0,
    overtime_rate: data.overtime_rate || 0,
    overtime_amount: overtimeAmount,
    leave_days: data.leave_days || 0,
    leave_deduction: leaveDeduction,
    bonus: data.bonus || 0,
    status: 'draft',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  payrolls.push(newPayroll)
  await writePayrolls(payrolls)
  return newPayroll
}

export async function updatePayroll(id: string, data: UpdatePayrollRequest): Promise<Payroll | null> {
  const payrolls = await readPayrolls()
  const index = payrolls.findIndex(p => p.id === id)
  if (index === -1) return null
  
  payrolls[index] = {
    ...payrolls[index],
    ...data,
    updated_at: new Date().toISOString(),
  }
  await writePayrolls(payrolls)
  return payrolls[index]
}

export async function deletePayroll(id: string): Promise<boolean> {
  const payrolls = await readPayrolls()
  const filtered = payrolls.filter(p => p.id !== id)
  if (filtered.length === payrolls.length) return false
  await writePayrolls(filtered)
  return true
}

export async function readAttendance(): Promise<Attendance[]> {
  await ensureDataDir()
  try {
    const data = await fs.readFile(ATTENDANCE_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

export async function writeAttendance(attendance: Attendance[]): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(ATTENDANCE_FILE, JSON.stringify(attendance, null, 2))
}

export async function readLeaves(): Promise<Leave[]> {
  await ensureDataDir()
  try {
    const data = await fs.readFile(LEAVES_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

export async function writeLeaves(leaves: Leave[]): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(LEAVES_FILE, JSON.stringify(leaves, null, 2))
}

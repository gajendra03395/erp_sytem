import fs from 'fs'
import path from 'path'
import type { Employee, CreateEmployee, UpdateEmployee } from '@/types/employee'

const EMPLOYEES_FILE = path.join(process.cwd(), 'public', 'employees.json')

// Get all employees from file
export function getStoredEmployees(): Employee[] {
  try {
    if (fs.existsSync(EMPLOYEES_FILE)) {
      const data = fs.readFileSync(EMPLOYEES_FILE, 'utf-8')
      const employees = JSON.parse(data)
      // Convert date strings back to Date objects
      return employees.map((emp: any) => ({
        ...emp,
        created_at: new Date(emp.created_at),
        updated_at: new Date(emp.updated_at),
      }))
    }
  } catch (err) {
    console.error('Error reading employees:', err)
  }
  return []
}

// Save employees to file
export function saveEmployees(employees: Employee[]): void {
  try {
    // Ensure public directory exists
    const publicDir = path.dirname(EMPLOYEES_FILE)
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true })
    }
    
    fs.writeFileSync(EMPLOYEES_FILE, JSON.stringify(employees, null, 2))
  } catch (err) {
    console.error('Error saving employees:', err)
    throw new Error('Failed to save employees')
  }
}

// Add new employee
export function addStoredEmployee(employeeData: CreateEmployee): Employee {
  const employees = getStoredEmployees()
  
  // Check if employee_id already exists
  if (employees.some(emp => emp.employee_id === employeeData.employee_id)) {
    throw new Error(`Employee ID ${employeeData.employee_id} already exists`)
  }
  
  // Check if email already exists
  if (employees.some(emp => emp.email === employeeData.email)) {
    throw new Error(`Email ${employeeData.email} already exists`)
  }
  
  const newEmployee: Employee = {
    id: Date.now().toString(),
    ...employeeData,
    status: employeeData.status || 'active',
    created_at: new Date(),
    updated_at: new Date(),
  }
  
  const updatedEmployees = [...employees, newEmployee]
  saveEmployees(updatedEmployees)
  
  return newEmployee
}

// Update employee
export function updateStoredEmployee(id: string, updates: UpdateEmployee): Employee {
  const employees = getStoredEmployees()
  const employeeIndex = employees.findIndex(emp => emp.id === id)
  
  if (employeeIndex === -1) {
    throw new Error('Employee not found')
  }
  
  const updatedEmployee = {
    ...employees[employeeIndex],
    ...updates,
    updated_at: new Date(),
  }
  
  employees[employeeIndex] = updatedEmployee
  saveEmployees(employees)
  
  return updatedEmployee
}

// Delete employee
export function deleteStoredEmployee(id: string): void {
  const employees = getStoredEmployees()
  const updatedEmployees = employees.filter(emp => emp.id !== id)
  
  if (employees.length === updatedEmployees.length) {
    throw new Error('Employee not found')
  }
  
  saveEmployees(updatedEmployees)
}

// Get employee by ID
export function getStoredEmployeeById(id: string): Employee | null {
  const employees = getStoredEmployees()
  return employees.find(emp => emp.id === id) || null
}

// Get employee by employee_id
export function getStoredEmployeeByEmployeeId(employee_id: string): Employee | null {
  const employees = getStoredEmployees()
  return employees.find(emp => emp.employee_id === employee_id) || null
}

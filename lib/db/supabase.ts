// Supabase Database Helper Functions

import { createClient } from '@supabase/supabase-js'
import type {
  InventoryItem,
  CreateInventoryItem,
  UpdateInventoryItem,
  Employee,
  CreateEmployee,
  UpdateEmployee,
  Machine,
  CreateMachine,
  UpdateMachine,
  QualityControl,
  CreateQC,
  UpdateQC,
} from '@/types'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ============================================
// INVENTORY FUNCTIONS
// ============================================
export async function getInventoryItems() {
  const { data, error } = await supabase
    .from('inventory')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as InventoryItem[]
}

export async function getInventoryItemById(id: string) {
  const { data, error } = await supabase
    .from('inventory')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as InventoryItem
}

export async function createInventoryItem(item: CreateInventoryItem) {
  const { data, error } = await supabase
    .from('inventory')
    .insert([item])
    .select()
    .single()

  if (error) throw error
  return data as InventoryItem
}

export async function updateInventoryItem(id: string, updates: UpdateInventoryItem) {
  const { data, error } = await supabase
    .from('inventory')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as InventoryItem
}

export async function deleteInventoryItem(id: string) {
  const { error } = await supabase
    .from('inventory')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ============================================
// EMPLOYEE FUNCTIONS
// ============================================
export async function getEmployees() {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Employee[]
}

export async function getEmployeeById(id: string) {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Employee
}

export async function getEmployeesByDepartment(department: string) {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .eq('department', department)
    .order('name', { ascending: true })

  if (error) throw error
  return data as Employee[]
}

export async function createEmployee(employee: CreateEmployee) {
  const { data, error } = await supabase
    .from('employees')
    .insert([employee])
    .select()
    .single()

  if (error) throw error
  return data as Employee
}

export async function updateEmployee(id: string, updates: UpdateEmployee) {
  const { data, error } = await supabase
    .from('employees')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Employee
}

export async function deleteEmployee(id: string) {
  const { error } = await supabase
    .from('employees')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ============================================
// MACHINE FUNCTIONS
// ============================================
export async function getMachines() {
  const { data, error } = await supabase
    .from('machines')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Machine[]
}

export async function getMachineById(id: string) {
  const { data, error } = await supabase
    .from('machines')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Machine
}

export async function getMachinesByStatus(status: string) {
  const { data, error } = await supabase
    .from('machines')
    .select('*')
    .eq('status', status)
    .order('machine_name', { ascending: true })

  if (error) throw error
  return data as Machine[]
}

export async function createMachine(machine: CreateMachine) {
  const { data, error } = await supabase
    .from('machines')
    .insert([machine])
    .select()
    .single()

  if (error) throw error
  return data as Machine
}

export async function updateMachine(id: string, updates: UpdateMachine) {
  const { data, error } = await supabase
    .from('machines')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Machine
}

export async function deleteMachine(id: string) {
  const { error } = await supabase
    .from('machines')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ============================================
// QUALITY CONTROL FUNCTIONS
// ============================================
export async function getQCRecords() {
  const { data, error } = await supabase
    .from('quality_control')
    .select('*')
    .order('inspection_date', { ascending: false })

  if (error) throw error
  return data as QualityControl[]
}

export async function getQCRecordById(id: string) {
  const { data, error } = await supabase
    .from('quality_control')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as QualityControl
}

export async function getQCRecordsByResult(result: string) {
  const { data, error } = await supabase
    .from('quality_control')
    .select('*')
    .eq('result', result)
    .order('inspection_date', { ascending: false })

  if (error) throw error
  return data as QualityControl[]
}

export async function createQCRecord(qc: CreateQC) {
  const { data, error } = await supabase
    .from('quality_control')
    .insert([qc])
    .select()
    .single()

  if (error) throw error
  return data as QualityControl
}

export async function updateQCRecord(id: string, updates: UpdateQC) {
  const { data, error } = await supabase
    .from('quality_control')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as QualityControl
}

export async function deleteQCRecord(id: string) {
  const { error } = await supabase
    .from('quality_control')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ============================================
// DASHBOARD STATS FUNCTIONS
// ============================================
export async function getDashboardStats() {
  // Get total inventory count
  const { count: inventoryCount } = await supabase
    .from('inventory')
    .select('*', { count: 'exact', head: true })

  // Get active machines count
  const { count: activeMachinesCount } = await supabase
    .from('machines')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'running')

  // Get employees on shift count
  const { count: employeesOnShiftCount } = await supabase
    .from('employees')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')

  // Get QC pass rate
  const { data: qcRecords } = await supabase
    .from('quality_control')
    .select('result')

  const totalQC = qcRecords?.length || 0
  const passCount = qcRecords?.filter(r => r.result === 'pass').length || 0
  const passRate = totalQC > 0 ? ((passCount / totalQC) * 100).toFixed(1) : '0.0'

  return {
    totalInventory: inventoryCount || 0,
    activeMachines: activeMachinesCount || 0,
    employeesOnShift: employeesOnShiftCount || 0,
    qcPassRate: `${passRate}%`,
  }
}

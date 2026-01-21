import fs from 'fs'
import path from 'path'

// Expense interfaces
export interface Expense {
  id: string
  description: string
  amount: number
  category: string
  department: string
  date: Date
  status: 'pending' | 'approved' | 'rejected'
  approved_by?: string
  approved_at?: Date
  created_at: Date
  updated_at: Date
}

export interface CreateExpense {
  description: string
  amount: number
  category: string
  department: string
  date: Date
  status?: 'pending' | 'approved' | 'rejected'
}

export interface UpdateExpense {
  description?: string
  amount?: number
  category?: string
  department?: string
  date?: Date
  status?: 'pending' | 'approved' | 'rejected'
  approved_by?: string
  approved_at?: Date
}

const EXPENSES_FILE = path.join(process.cwd(), 'public', 'expenses.json')

// Get all expenses from file
export function getStoredExpenses(): Expense[] {
  try {
    if (fs.existsSync(EXPENSES_FILE)) {
      const data = fs.readFileSync(EXPENSES_FILE, 'utf-8')
      const expenses = JSON.parse(data)
      // Convert date strings back to Date objects
      return expenses.map((expense: any) => ({
        ...expense,
        date: new Date(expense.date),
        approved_at: expense.approved_at ? new Date(expense.approved_at) : undefined,
        created_at: new Date(expense.created_at),
        updated_at: new Date(expense.updated_at),
      }))
    }
  } catch (err) {
    console.error('Error reading expenses:', err)
  }
  return []
}

// Save expenses to file
export function saveExpenses(expenses: Expense[]): void {
  try {
    // Ensure public directory exists
    const publicDir = path.dirname(EXPENSES_FILE)
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true })
    }
    
    fs.writeFileSync(EXPENSES_FILE, JSON.stringify(expenses, null, 2))
  } catch (err) {
    console.error('Error saving expenses:', err)
    throw new Error('Failed to save expenses')
  }
}

// Add new expense
export function addStoredExpense(expenseData: CreateExpense): Expense {
  const expenses = getStoredExpenses()
  
  const newExpense: Expense = {
    id: Date.now().toString(),
    ...expenseData,
    status: expenseData.status || 'pending',
    created_at: new Date(),
    updated_at: new Date(),
  }
  
  const updatedExpenses = [...expenses, newExpense]
  saveExpenses(updatedExpenses)
  
  return newExpense
}

// Update expense
export function updateStoredExpense(id: string, updates: UpdateExpense): Expense {
  const expenses = getStoredExpenses()
  const expenseIndex = expenses.findIndex(expense => expense.id === id)
  
  if (expenseIndex === -1) {
    throw new Error('Expense not found')
  }
  
  const updatedExpense = {
    ...expenses[expenseIndex],
    ...updates,
    updated_at: new Date(),
  }
  
  expenses[expenseIndex] = updatedExpense
  saveExpenses(expenses)
  
  return updatedExpense
}

// Delete expense
export function deleteStoredExpense(id: string): void {
  const expenses = getStoredExpenses()
  const updatedExpenses = expenses.filter(expense => expense.id !== id)
  
  if (expenses.length === updatedExpenses.length) {
    throw new Error('Expense not found')
  }
  
  saveExpenses(updatedExpenses)
}

// Get expense by ID
export function getStoredExpenseById(id: string): Expense | null {
  const expenses = getStoredExpenses()
  return expenses.find(expense => expense.id === id) || null
}

// Get expenses by department
export function getStoredExpensesByDepartment(department: string): Expense[] {
  const expenses = getStoredExpenses()
  return expenses.filter(expense => expense.department === department)
}

// Get expenses by status
export function getStoredExpensesByStatus(status: 'pending' | 'approved' | 'rejected'): Expense[] {
  const expenses = getStoredExpenses()
  return expenses.filter(expense => expense.status === status)
}

// Get expenses by date range
export function getStoredExpensesByDateRange(startDate: Date, endDate: Date): Expense[] {
  const expenses = getStoredExpenses()
  return expenses.filter(expense => 
    expense.date >= startDate && expense.date <= endDate
  )
}

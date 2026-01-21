import fs from 'fs'
import path from 'path'

// Budget interfaces
export interface Budget {
  id: string
  department: string
  category: string
  planned_amount: number
  actual_amount: number
  period: string
  year: number
  status: 'active' | 'completed' | 'exceeded'
  created_at: Date
  updated_at: Date
}

export interface CreateBudget {
  department: string
  category: string
  planned_amount: number
  period: string
  year: number
  status?: 'active' | 'completed' | 'exceeded'
}

export interface UpdateBudget {
  department?: string
  category?: string
  planned_amount?: number
  actual_amount?: number
  period?: string
  year?: number
  status?: 'active' | 'completed' | 'exceeded'
}

const BUDGETS_FILE = path.join(process.cwd(), 'public', 'budgets.json')

// Get all budgets from file
export function getStoredBudgets(): Budget[] {
  try {
    if (fs.existsSync(BUDGETS_FILE)) {
      const data = fs.readFileSync(BUDGETS_FILE, 'utf-8')
      const budgets = JSON.parse(data)
      // Convert date strings back to Date objects
      return budgets.map((budget: any) => ({
        ...budget,
        created_at: new Date(budget.created_at),
        updated_at: new Date(budget.updated_at),
      }))
    }
  } catch (err) {
    console.error('Error reading budgets:', err)
  }
  return []
}

// Save budgets to file
export function saveBudgets(budgets: Budget[]): void {
  try {
    // Ensure public directory exists
    const publicDir = path.dirname(BUDGETS_FILE)
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true })
    }
    
    fs.writeFileSync(BUDGETS_FILE, JSON.stringify(budgets, null, 2))
  } catch (err) {
    console.error('Error saving budgets:', err)
    throw new Error('Failed to save budgets')
  }
}

// Add new budget
export function addStoredBudget(budgetData: CreateBudget): Budget {
  const budgets = getStoredBudgets()
  
  const newBudget: Budget = {
    id: Date.now().toString(),
    ...budgetData,
    actual_amount: 0,
    status: budgetData.status || 'active',
    created_at: new Date(),
    updated_at: new Date(),
  }
  
  const updatedBudgets = [...budgets, newBudget]
  saveBudgets(updatedBudgets)
  
  return newBudget
}

// Update budget
export function updateStoredBudget(id: string, updates: UpdateBudget): Budget {
  const budgets = getStoredBudgets()
  const budgetIndex = budgets.findIndex(budget => budget.id === id)
  
  if (budgetIndex === -1) {
    throw new Error('Budget not found')
  }
  
  const updatedBudget = {
    ...budgets[budgetIndex],
    ...updates,
    updated_at: new Date(),
  }
  
  budgets[budgetIndex] = updatedBudget
  saveBudgets(budgets)
  
  return updatedBudget
}

// Delete budget
export function deleteStoredBudget(id: string): void {
  const budgets = getStoredBudgets()
  const updatedBudgets = budgets.filter(budget => budget.id !== id)
  
  if (budgets.length === updatedBudgets.length) {
    throw new Error('Budget not found')
  }
  
  saveBudgets(updatedBudgets)
}

// Get budget by ID
export function getStoredBudgetById(id: string): Budget | null {
  const budgets = getStoredBudgets()
  return budgets.find(budget => budget.id === id) || null
}

// Get budgets by department
export function getStoredBudgetsByDepartment(department: string): Budget[] {
  const budgets = getStoredBudgets()
  return budgets.filter(budget => budget.department === department)
}

// Get budgets by year
export function getStoredBudgetsByYear(year: number): Budget[] {
  const budgets = getStoredBudgets()
  return budgets.filter(budget => budget.year === year)
}

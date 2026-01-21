// Simple Mock Database for Testing with Server-Side Persistence

// Account interfaces
export interface Account {
  id: string
  account_code: string
  account_name: string
  account_type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense'
  parent_account?: string
  description?: string
  balance: number
  status: 'active' | 'inactive'
  created_at: Date
  updated_at: Date
}

export interface CreateAccount {
  account_code: string
  account_name: string
  account_type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense'
  parent_account?: string
  description?: string
  balance?: number
  status?: 'active' | 'inactive'
}

export interface UpdateAccount {
  account_code?: string
  account_name?: string
  account_type?: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense'
  parent_account?: string
  description?: string
  balance?: number
  status?: 'active' | 'inactive'
}

// Bank Account interfaces
export interface BankAccount {
  id: string
  account_name: string
  account_number: string
  bank_name: string
  account_type: 'checking' | 'savings' | 'credit'
  balance: number
  status: 'active' | 'inactive'
  created_at: Date
  updated_at: Date
}

export interface CreateBankAccount {
  account_name: string
  account_number: string
  bank_name: string
  account_type: 'checking' | 'savings' | 'credit'
  balance?: number
  status?: 'active' | 'inactive'
}

export interface UpdateBankAccount {
  account_name?: string
  account_number?: string
  bank_name?: string
  account_type?: 'checking' | 'savings' | 'credit'
  balance?: number
  status?: 'active' | 'inactive'
}

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

// Customer interfaces
export interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  company?: string
  status: 'active' | 'inactive'
  created_at: Date
  updated_at: Date
}

export interface CreateCustomer {
  name: string
  email: string
  phone?: string
  address?: string
  company?: string
  status?: 'active' | 'inactive'
}

export interface UpdateCustomer {
  name?: string
  email?: string
  phone?: string
  address?: string
  company?: string
  status?: 'active' | 'inactive'
}

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

// Journal Entry interfaces
export interface JournalEntry {
  id: string
  entry_date: Date
  account_id: string
  debit_amount: number
  credit_amount: number
  description: string
  reference: string
  created_at: Date
  updated_at: Date
}

export interface CreateJournalEntry {
  entry_date: Date
  account_id: string
  debit_amount: number
  credit_amount: number
  description: string
  reference: string
}

export interface UpdateJournalEntry {
  entry_date?: Date
  account_id?: string
  debit_amount?: number
  credit_amount?: number
  description?: string
  reference?: string
}

// Tax Configuration interfaces
export interface TaxConfiguration {
  id: string
  name: string
  rate: number
  type: 'sales' | 'purchase' | 'income'
  status: 'active' | 'inactive'
  created_at: Date
  updated_at: Date
}

export interface CreateTaxConfiguration {
  name: string
  rate: number
  type: 'sales' | 'purchase' | 'income'
  status?: 'active' | 'inactive'
}

export interface UpdateTaxConfiguration {
  name?: string
  rate?: number
  type?: 'sales' | 'purchase' | 'income'
  status?: 'active' | 'inactive'
}

// Vendor interfaces
export interface Vendor {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  category?: string
  payment_terms?: string
  status: 'active' | 'inactive'
  created_at: Date
  updated_at: Date
}

export interface CreateVendor {
  name: string
  email: string
  phone?: string
  address?: string
  category?: string
  payment_terms?: string
  status?: 'active' | 'inactive'
}

export interface UpdateVendor {
  name?: string
  email?: string
  phone?: string
  address?: string
  category?: string
  payment_terms?: string
  status?: 'active' | 'inactive'
}

// Barcode interfaces
export interface Barcode {
  id: string
  value: string
  item_id: string
  type: string
  status: 'active' | 'inactive'
  created_at: Date
  updated_at: Date
}

export interface CreateBarcode {
  value: string
  item_id: string
  type: string
  status?: 'active' | 'inactive'
}

export interface UpdateBarcode {
  value?: string
  item_id?: string
  type?: string
  status?: 'active' | 'inactive'
}

// Stock Alert interfaces
export interface StockAlert {
  id: string
  item_id: string
  alert_type: 'low_stock' | 'out_of_stock' | 'overstock'
  threshold: number
  current_stock: number
  status: 'unresolved' | 'resolved'
  created_at: Date
  updated_at: Date
}

export interface CreateStockAlert {
  item_id: string
  alert_type: 'low_stock' | 'out_of_stock' | 'overstock'
  threshold: number
  current_stock: number
}

export interface UpdateStockAlert {
  item_id?: string
  alert_type?: 'low_stock' | 'out_of_stock' | 'overstock'
  threshold?: number
  current_stock?: number
  status?: 'unresolved' | 'resolved'
}

// Stock Movement interfaces
export interface StockMovement {
  id: string
  item_id: string
  movement_type: 'in' | 'out' | 'transfer'
  quantity: number
  reference?: string
  created_at: Date
  updated_at: Date
}

export interface CreateStockMovement {
  item_id: string
  movement_type: 'in' | 'out' | 'transfer'
  quantity: number
  reference?: string
}

// In-memory storage for testing
let inventoryStore: any[] = []
let employeeStore: any[] = []
let customerStore: any[] = []
let vendorStore: any[] = []
let budgetStore: any[] = []
let expenseStore: any[] = []
let accountStore: any[] = []

// Global storage that persists between requests
const globalStore = globalThis as any

// Initialize stores from global storage or create new ones
if (!globalStore.inventoryStore) {
  globalStore.inventoryStore = []
  globalStore.employeeStore = []
  globalStore.customerStore = []
  globalStore.vendorStore = []
  globalStore.budgetStore = []
  globalStore.expenseStore = []
  globalStore.accountStore = []
  globalStore.taxConfigurations = []
  globalStore.barcodes = []
  globalStore.stockAlerts = []
  globalStore.stockMovements = []
  globalStore.warehouses = []
  globalStore.bankAccounts = []
  globalStore.journalEntries = []
}

inventoryStore = globalStore.inventoryStore
employeeStore = globalStore.employeeStore
customerStore = globalStore.customerStore
vendorStore = globalStore.vendorStore
budgetStore = globalStore.budgetStore
expenseStore = globalStore.expenseStore
accountStore = globalStore.accountStore

// ============================================
// INVENTORY FUNCTIONS
// ============================================
export async function getInventoryItems() {
  return inventoryStore
}

export async function getInventoryItemById(id: string) {
  return inventoryStore.find(item => item.id === id)
}

export async function createInventoryItem(item: any) {
  const newItem = { id: Date.now().toString(), ...item }
  inventoryStore.push(newItem)
  return newItem
}

export async function updateInventoryItem(id: string, updates: any) {
  console.log('Updating inventory item:', id, updates)
  console.log('Current inventory store:', inventoryStore)
  
  const index = inventoryStore.findIndex(item => item.id === id)
  console.log('Found index:', index)
  
  if (index !== -1) {
    inventoryStore[index] = { ...inventoryStore[index], ...updates }
    console.log('Updated item:', inventoryStore[index])
    console.log('Updated inventory store:', inventoryStore)
    return inventoryStore[index]
  }
  
  console.log('Item not found with id:', id)
  return null
}

export async function deleteInventoryItem(id: string) {
  const index = inventoryStore.findIndex(item => item.id === id)
  if (index !== -1) {
    inventoryStore.splice(index, 1)
  }
}

// ============================================
// EMPLOYEE FUNCTIONS
// ============================================
export async function getEmployees() {
  return employeeStore
}

export async function getEmployeeById(id: string) {
  return employeeStore.find(emp => emp.id === id)
}

export async function createEmployee(employee: any) {
  const newEmployee = { id: Date.now().toString(), ...employee }
  employeeStore.push(newEmployee)
  return newEmployee
}

export async function updateEmployee(id: string, updates: any) {
  const index = employeeStore.findIndex(emp => emp.id === id)
  if (index !== -1) {
    employeeStore[index] = { ...employeeStore[index], ...updates }
    return employeeStore[index]
  }
  return null
}

export async function deleteEmployee(id: string) {
  const index = employeeStore.findIndex(emp => emp.id === id)
  if (index !== -1) {
    employeeStore.splice(index, 1)
  }
}

// ============================================
// CUSTOMER FUNCTIONS
// ============================================
export async function getCustomers() {
  return customerStore
}

export async function getCustomerById(id: string) {
  return customerStore.find(cust => cust.id === id)
}

export async function createCustomer(customer: any) {
  const newCustomer = { id: Date.now().toString(), ...customer }
  customerStore.push(newCustomer)
  return newCustomer
}

export async function updateCustomer(id: string, updates: any) {
  const index = customerStore.findIndex(cust => cust.id === id)
  if (index !== -1) {
    customerStore[index] = { ...customerStore[index], ...updates }
    return customerStore[index]
  }
  return null
}

export async function deleteCustomer(id: string) {
  const index = customerStore.findIndex(cust => cust.id === id)
  if (index !== -1) {
    customerStore.splice(index, 1)
  }
}

// ============================================
// VENDOR FUNCTIONS
// ============================================
export async function getVendors() {
  return vendorStore
}

export async function getVendorById(id: string) {
  return vendorStore.find(vend => vend.id === id)
}

export async function createVendor(vendor: any) {
  const newVendor = { id: Date.now().toString(), ...vendor }
  vendorStore.push(newVendor)
  return newVendor
}

export async function updateVendor(id: string, updates: any) {
  const index = vendorStore.findIndex(vend => vend.id === id)
  if (index !== -1) {
    vendorStore[index] = { ...vendorStore[index], ...updates }
    return vendorStore[index]
  }
  return null
}

export async function deleteVendor(id: string) {
  const index = vendorStore.findIndex(vend => vend.id === id)
  if (index !== -1) {
    vendorStore.splice(index, 1)
  }
}

// ============================================
// BUDGET FUNCTIONS
// ============================================
export async function getBudgets() {
  return budgetStore
}

export async function getBudgetById(id: string) {
  return budgetStore.find(bud => bud.id === id)
}

export async function createBudget(budget: any) {
  const newBudget = { 
    id: Date.now().toString(), 
    ...budget,
    actual_amount: budget.actual_amount || 0,
    status: budget.status || 'active',
    created_at: new Date(),
    updated_at: new Date()
  }
  budgetStore.push(newBudget)
  return newBudget
}

export async function updateBudget(id: string, updates: any) {
  const index = budgetStore.findIndex(bud => bud.id === id)
  if (index !== -1) {
    budgetStore[index] = { ...budgetStore[index], ...updates }
    return budgetStore[index]
  }
  return null
}

export async function deleteBudget(id: string) {
  const index = budgetStore.findIndex(bud => bud.id === id)
  if (index !== -1) {
    budgetStore.splice(index, 1)
  }
}

// ============================================
// EXPENSE FUNCTIONS
// ============================================
export async function getExpenses() {
  return expenseStore
}

export async function getExpenseById(id: string) {
  return expenseStore.find(exp => exp.id === id)
}

export async function createExpense(expense: any) {
  const newExpense = { id: Date.now().toString(), ...expense }
  expenseStore.push(newExpense)
  return newExpense
}

export async function updateExpense(id: string, updates: any) {
  const index = expenseStore.findIndex(exp => exp.id === id)
  if (index !== -1) {
    expenseStore[index] = { ...expenseStore[index], ...updates }
    return expenseStore[index]
  }
  return null
}

export async function deleteExpense(id: string) {
  const index = expenseStore.findIndex(exp => exp.id === id)
  if (index !== -1) {
    expenseStore.splice(index, 1)
  }
}

// ============================================
// FINANCIAL FUNCTIONS
// ============================================
export async function getAccounts() {
  return accountStore
}

export async function getAccountById(id: string) {
  return accountStore.find(acc => acc.id === id)
}

export async function createAccount(account: any) {
  const newAccount = { id: Date.now().toString(), ...account }
  accountStore.push(newAccount)
  return newAccount
}

export async function updateAccount(id: string, updates: any) {
  const index = accountStore.findIndex(acc => acc.id === id)
  if (index !== -1) {
    accountStore[index] = { ...accountStore[index], ...updates }
    return accountStore[index]
  }
  return null
}

export async function deleteAccount(id: string) {
  const index = accountStore.findIndex(acc => acc.id === id)
  if (index !== -1) {
    accountStore.splice(index, 1)
  }
}

// ============================================
// FINANCIAL STATS FUNCTIONS
// ============================================
export async function getFinancialStats() {
  const inventory = await getInventoryItems()
  const employees = await getEmployees()
  const budgets = await getBudgets()
  const expenses = await getExpenses()
  
  return {
    totalInventory: inventory.length,
    totalEmployees: employees.length,
    totalBudgets: budgets.length,
    totalExpenses: expenses.reduce((sum, exp) => sum + exp.amount, 0),
    totalBudgetAmount: budgets.reduce((sum, bud) => sum + bud.planned_amount, 0),
    totalRevenue: 100000, // Mock revenue data
    totalAssets: 500000, // Mock assets data
    totalLiabilities: 100000, // Mock liabilities data
    totalReceivables: 50000, // Mock receivables data
    totalPayables: 20000, // Mock payables data
  }
}

// ============================================
// TAX CONFIGURATION FUNCTIONS
// ============================================
export async function getTaxConfigurations() {
  return globalStore.taxConfigurations || []
}

export async function createTaxConfiguration(taxConfig: any) {
  if (!globalStore.taxConfigurations) {
    globalStore.taxConfigurations = []
  }
  const newConfig = { id: Date.now().toString(), ...taxConfig }
  globalStore.taxConfigurations.push(newConfig)
  return newConfig
}

export async function updateTaxConfiguration(id: string, updates: any) {
  if (!globalStore.taxConfigurations) return null
  const index = globalStore.taxConfigurations.findIndex((config: any) => config.id === id)
  if (index !== -1) {
    globalStore.taxConfigurations[index] = { ...globalStore.taxConfigurations[index], ...updates }
    return globalStore.taxConfigurations[index]
  }
  return null
}

export async function deleteTaxConfiguration(id: string) {
  if (!globalStore.taxConfigurations) return
  globalStore.taxConfigurations = globalStore.taxConfigurations.filter((config: any) => config.id !== id)
}

// ============================================
// TRIAL BALANCE FUNCTIONS
// ============================================
export async function getTrialBalance() {
  const accounts = await getAccounts()
  return {
    accounts: accounts.map(acc => ({
      ...acc,
      debit_balance: acc.account_type === 'asset' || acc.account_type === 'expense' ? acc.balance : 0,
      credit_balance: acc.account_type === 'liability' || acc.account_type === 'equity' || acc.account_type === 'revenue' ? acc.balance : 0
    })),
    total_debits: accounts.filter(acc => acc.account_type === 'asset' || acc.account_type === 'expense').reduce((sum, acc) => sum + acc.balance, 0),
    total_credits: accounts.filter(acc => acc.account_type === 'liability' || acc.account_type === 'equity' || acc.account_type === 'revenue').reduce((sum, acc) => sum + acc.balance, 0)
  }
}

// ============================================
// BARCODE FUNCTIONS
// ============================================
export async function getBarcodes() {
  return globalStore.barcodes || []
}

export async function getBarcodeByValue(value: string) {
  const barcodes = globalStore.barcodes || []
  return barcodes.find((barcode: any) => barcode.value === value)
}

export async function createBarcode(barcode: any) {
  if (!globalStore.barcodes) {
    globalStore.barcodes = []
  }
  const newBarcode = { id: Date.now().toString(), ...barcode }
  globalStore.barcodes.push(newBarcode)
  return newBarcode
}

export async function updateBarcode(id: string, updates: any) {
  if (!globalStore.barcodes) return null
  const index = globalStore.barcodes.findIndex((barcode: any) => barcode.id === id)
  if (index !== -1) {
    globalStore.barcodes[index] = { ...globalStore.barcodes[index], ...updates }
    return globalStore.barcodes[index]
  }
  return null
}

export async function deleteBarcode(id: string) {
  if (!globalStore.barcodes) return
  globalStore.barcodes = globalStore.barcodes.filter((barcode: any) => barcode.id !== id)
}

// ============================================
// STOCK ALERT FUNCTIONS
// ============================================
export async function getStockAlerts() {
  return globalStore.stockAlerts || []
}

export async function getUnresolvedStockAlerts() {
  const alerts = globalStore.stockAlerts || []
  return alerts.filter((alert: any) => alert.status === 'unresolved')
}

export async function createStockAlert(alert: any) {
  if (!globalStore.stockAlerts) {
    globalStore.stockAlerts = []
  }
  const newAlert = { id: Date.now().toString(), ...alert, status: 'unresolved' }
  globalStore.stockAlerts.push(newAlert)
  return newAlert
}

export async function updateStockAlert(id: string, updates: any) {
  if (!globalStore.stockAlerts) return null
  const index = globalStore.stockAlerts.findIndex((alert: any) => alert.id === id)
  if (index !== -1) {
    globalStore.stockAlerts[index] = { ...globalStore.stockAlerts[index], ...updates }
    return globalStore.stockAlerts[index]
  }
  return null
}

export async function deleteStockAlert(id: string) {
  if (!globalStore.stockAlerts) return
  globalStore.stockAlerts = globalStore.stockAlerts.filter((alert: any) => alert.id !== id)
}

// ============================================
// STOCK MOVEMENT FUNCTIONS
// ============================================
export async function getStockMovements() {
  return globalStore.stockMovements || []
}

export async function getStockMovementsByItem(itemId: string) {
  const movements = globalStore.stockMovements || []
  return movements.filter((movement: any) => movement.item_id === itemId)
}

export async function createStockMovement(movement: any) {
  if (!globalStore.stockMovements) {
    globalStore.stockMovements = []
  }
  const newMovement = { id: Date.now().toString(), ...movement, created_at: new Date() }
  globalStore.stockMovements.push(newMovement)
  return newMovement
}

export async function deleteStockMovement(id: string) {
  if (!globalStore.stockMovements) return
  globalStore.stockMovements = globalStore.stockMovements.filter((movement: any) => movement.id !== id)
}

// ============================================
// WAREHOUSE FUNCTIONS
// ============================================
export async function getWarehouses() {
  return globalStore.warehouses || []
}

export async function createWarehouse(warehouse: any) {
  if (!globalStore.warehouses) {
    globalStore.warehouses = []
  }
  const newWarehouse = { id: Date.now().toString(), ...warehouse }
  globalStore.warehouses.push(newWarehouse)
  return newWarehouse
}

export async function updateWarehouse(id: string, updates: any) {
  if (!globalStore.warehouses) return null
  const index = globalStore.warehouses.findIndex((warehouse: any) => warehouse.id === id)
  if (index !== -1) {
    globalStore.warehouses[index] = { ...globalStore.warehouses[index], ...updates }
    return globalStore.warehouses[index]
  }
  return null
}

export async function deleteWarehouse(id: string) {
  if (!globalStore.warehouses) return
  globalStore.warehouses = globalStore.warehouses.filter((warehouse: any) => warehouse.id !== id)
}

// ============================================
// BANK ACCOUNT FUNCTIONS
// ============================================
export async function getBankAccounts() {
  return globalStore.bankAccounts || []
}

export async function getActiveBankAccounts() {
  const accounts = globalStore.bankAccounts || []
  return accounts.filter((account: any) => account.status === 'active')
}

export async function createBankAccount(account: any) {
  if (!globalStore.bankAccounts) {
    globalStore.bankAccounts = []
  }
  const newAccount = { id: Date.now().toString(), ...account }
  globalStore.bankAccounts.push(newAccount)
  return newAccount
}

export async function updateBankAccount(id: string, updates: any) {
  if (!globalStore.bankAccounts) return null
  const index = globalStore.bankAccounts.findIndex((account: any) => account.id === id)
  if (index !== -1) {
    globalStore.bankAccounts[index] = { ...globalStore.bankAccounts[index], ...updates }
    return globalStore.bankAccounts[index]
  }
  return null
}

export async function deleteBankAccount(id: string) {
  if (!globalStore.bankAccounts) return
  globalStore.bankAccounts = globalStore.bankAccounts.filter((account: any) => account.id !== id)
}

// ============================================
// BUDGET BY YEAR FUNCTIONS
// ============================================
export async function getBudgetsByYear(year: number) {
  const budgets = await getBudgets()
  return budgets.filter((budget: any) => budget.year === year)
}

// ============================================
// EXPENSE BY STATUS FUNCTIONS
// ============================================
export async function getExpensesByStatus(status: string) {
  const expenses = await getExpenses()
  return expenses.filter((expense: any) => expense.status === status)
}

// ============================================
// JOURNAL ENTRY FUNCTIONS
// ============================================
export async function getJournalEntries() {
  return globalStore.journalEntries || []
}

export async function createJournalEntry(entry: any) {
  if (!globalStore.journalEntries) {
    globalStore.journalEntries = []
  }
  const newEntry = { id: Date.now().toString(), ...entry, created_at: new Date() }
  globalStore.journalEntries.push(newEntry)
  return newEntry
}

export async function updateJournalEntry(id: string, updates: any) {
  if (!globalStore.journalEntries) return null
  const index = globalStore.journalEntries.findIndex((entry: any) => entry.id === id)
  if (index !== -1) {
    globalStore.journalEntries[index] = { ...globalStore.journalEntries[index], ...updates }
    return globalStore.journalEntries[index]
  }
  return null
}

export async function deleteJournalEntry(id: string) {
  if (!globalStore.journalEntries) return
  globalStore.journalEntries = globalStore.journalEntries.filter((entry: any) => entry.id !== id)
}

// ============================================
// ACTIVE TAX CONFIGURATIONS
// ============================================
export async function getActiveTaxConfigurations() {
  const configs = globalStore.taxConfigurations || []
  return configs.filter((config: any) => config.status === 'active')
}
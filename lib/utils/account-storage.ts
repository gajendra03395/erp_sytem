import fs from 'fs'
import path from 'path'

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

const ACCOUNTS_FILE = path.join(process.cwd(), 'public', 'accounts.json')

// Get all accounts from file
export function getStoredAccounts(): Account[] {
  try {
    if (fs.existsSync(ACCOUNTS_FILE)) {
      const data = fs.readFileSync(ACCOUNTS_FILE, 'utf-8')
      const accounts = JSON.parse(data)
      // Convert date strings back to Date objects
      return accounts.map((account: any) => ({
        ...account,
        created_at: new Date(account.created_at),
        updated_at: new Date(account.updated_at),
      }))
    }
  } catch (err) {
    console.error('Error reading accounts:', err)
  }
  return []
}

// Save accounts to file
export function saveAccounts(accounts: Account[]): void {
  try {
    // Ensure public directory exists
    const publicDir = path.dirname(ACCOUNTS_FILE)
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true })
    }
    
    fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify(accounts, null, 2))
  } catch (err) {
    console.error('Error saving accounts:', err)
    throw new Error('Failed to save accounts')
  }
}

// Add new account
export function addStoredAccount(accountData: CreateAccount): Account {
  const accounts = getStoredAccounts()
  
  // Check if account code already exists
  if (accounts.some(account => account.account_code === accountData.account_code)) {
    throw new Error(`Account with code ${accountData.account_code} already exists`)
  }
  
  const newAccount: Account = {
    id: Date.now().toString(),
    ...accountData,
    balance: accountData.balance || 0,
    status: accountData.status || 'active',
    created_at: new Date(),
    updated_at: new Date(),
  }
  
  const updatedAccounts = [...accounts, newAccount]
  saveAccounts(updatedAccounts)
  
  return newAccount
}

// Update account
export function updateStoredAccount(id: string, updates: UpdateAccount): Account {
  const accounts = getStoredAccounts()
  const accountIndex = accounts.findIndex(account => account.id === id)
  
  if (accountIndex === -1) {
    throw new Error('Account not found')
  }
  
  const updatedAccount = {
    ...accounts[accountIndex],
    ...updates,
    updated_at: new Date(),
  }
  
  accounts[accountIndex] = updatedAccount
  saveAccounts(accounts)
  
  return updatedAccount
}

// Delete account
export function deleteStoredAccount(id: string): void {
  const accounts = getStoredAccounts()
  const updatedAccounts = accounts.filter(account => account.id !== id)
  
  if (accounts.length === updatedAccounts.length) {
    throw new Error('Account not found')
  }
  
  saveAccounts(updatedAccounts)
}

// Get account by ID
export function getStoredAccountById(id: string): Account | null {
  const accounts = getStoredAccounts()
  return accounts.find(account => account.id === id) || null
}

// Get account by code
export function getStoredAccountByCode(account_code: string): Account | null {
  const accounts = getStoredAccounts()
  return accounts.find(account => account.account_code === account_code) || null
}

// Get accounts by type
export function getStoredAccountsByType(account_type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense'): Account[] {
  const accounts = getStoredAccounts()
  return accounts.filter(account => account.account_type === account_type)
}

// Get accounts by status
export function getStoredAccountsByStatus(status: 'active' | 'inactive'): Account[] {
  const accounts = getStoredAccounts()
  return accounts.filter(account => account.status === status)
}

// Get child accounts
export function getStoredChildAccounts(parent_account: string): Account[] {
  const accounts = getStoredAccounts()
  return accounts.filter(account => account.parent_account === parent_account)
}

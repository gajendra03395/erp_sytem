import fs from 'fs'
import path from 'path'

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

const CUSTOMERS_FILE = path.join(process.cwd(), 'public', 'customers.json')

// Get all customers from file
export function getStoredCustomers(): Customer[] {
  try {
    if (fs.existsSync(CUSTOMERS_FILE)) {
      const data = fs.readFileSync(CUSTOMERS_FILE, 'utf-8')
      const customers = JSON.parse(data)
      // Convert date strings back to Date objects
      return customers.map((customer: any) => ({
        ...customer,
        created_at: new Date(customer.created_at),
        updated_at: new Date(customer.updated_at),
      }))
    }
  } catch (err) {
    console.error('Error reading customers:', err)
  }
  return []
}

// Save customers to file
export function saveCustomers(customers: Customer[]): void {
  try {
    // Ensure public directory exists
    const publicDir = path.dirname(CUSTOMERS_FILE)
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true })
    }
    
    fs.writeFileSync(CUSTOMERS_FILE, JSON.stringify(customers, null, 2))
  } catch (err) {
    console.error('Error saving customers:', err)
    throw new Error('Failed to save customers')
  }
}

// Add new customer
export function addStoredCustomer(customerData: CreateCustomer): Customer {
  const customers = getStoredCustomers()
  
  // Check if email already exists
  if (customers.some(customer => customer.email === customerData.email)) {
    throw new Error(`Customer with email ${customerData.email} already exists`)
  }
  
  const newCustomer: Customer = {
    id: Date.now().toString(),
    ...customerData,
    status: customerData.status || 'active',
    created_at: new Date(),
    updated_at: new Date(),
  }
  
  const updatedCustomers = [...customers, newCustomer]
  saveCustomers(updatedCustomers)
  
  return newCustomer
}

// Update customer
export function updateStoredCustomer(id: string, updates: UpdateCustomer): Customer {
  const customers = getStoredCustomers()
  const customerIndex = customers.findIndex(customer => customer.id === id)
  
  if (customerIndex === -1) {
    throw new Error('Customer not found')
  }
  
  const updatedCustomer = {
    ...customers[customerIndex],
    ...updates,
    updated_at: new Date(),
  }
  
  customers[customerIndex] = updatedCustomer
  saveCustomers(customers)
  
  return updatedCustomer
}

// Delete customer
export function deleteStoredCustomer(id: string): void {
  const customers = getStoredCustomers()
  const updatedCustomers = customers.filter(customer => customer.id !== id)
  
  if (customers.length === updatedCustomers.length) {
    throw new Error('Customer not found')
  }
  
  saveCustomers(updatedCustomers)
}

// Get customer by ID
export function getStoredCustomerById(id: string): Customer | null {
  const customers = getStoredCustomers()
  return customers.find(customer => customer.id === id) || null
}

// Get customer by email
export function getStoredCustomerByEmail(email: string): Customer | null {
  const customers = getStoredCustomers()
  return customers.find(customer => customer.email === email) || null
}

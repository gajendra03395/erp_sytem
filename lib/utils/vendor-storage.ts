import fs from 'fs'
import path from 'path'

const VENDORS_FILE = path.join(process.cwd(), 'public', 'vendors.json')

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

// Get all vendors from file
export function getStoredVendors(): Vendor[] {
  try {
    if (fs.existsSync(VENDORS_FILE)) {
      const data = fs.readFileSync(VENDORS_FILE, 'utf-8')
      const vendors = JSON.parse(data)
      // Convert date strings back to Date objects
      return vendors.map((vendor: any) => ({
        ...vendor,
        created_at: new Date(vendor.created_at),
        updated_at: new Date(vendor.updated_at),
      }))
    }
  } catch (err) {
    console.error('Error reading vendors:', err)
  }
  return []
}

// Save vendors to file
export function saveVendors(vendors: Vendor[]): void {
  try {
    // Ensure public directory exists
    const publicDir = path.dirname(VENDORS_FILE)
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true })
    }
    
    fs.writeFileSync(VENDORS_FILE, JSON.stringify(vendors, null, 2))
  } catch (err) {
    console.error('Error saving vendors:', err)
    throw new Error('Failed to save vendors')
  }
}

// Add new vendor
export function addStoredVendor(vendorData: CreateVendor): Vendor {
  const vendors = getStoredVendors()
  
  // Check if email already exists
  if (vendors.some(vendor => vendor.email === vendorData.email)) {
    throw new Error(`Vendor with email ${vendorData.email} already exists`)
  }
  
  const newVendor: Vendor = {
    id: Date.now().toString(),
    ...vendorData,
    status: vendorData.status || 'active',
    created_at: new Date(),
    updated_at: new Date(),
  }
  
  const updatedVendors = [...vendors, newVendor]
  saveVendors(updatedVendors)
  
  return newVendor
}

// Update vendor
export function updateStoredVendor(id: string, updates: UpdateVendor): Vendor {
  const vendors = getStoredVendors()
  const vendorIndex = vendors.findIndex(vendor => vendor.id === id)
  
  if (vendorIndex === -1) {
    throw new Error('Vendor not found')
  }
  
  const updatedVendor = {
    ...vendors[vendorIndex],
    ...updates,
    updated_at: new Date(),
  }
  
  vendors[vendorIndex] = updatedVendor
  saveVendors(vendors)
  
  return updatedVendor
}

// Delete vendor
export function deleteStoredVendor(id: string): void {
  const vendors = getStoredVendors()
  const updatedVendors = vendors.filter(vendor => vendor.id !== id)
  
  if (vendors.length === updatedVendors.length) {
    throw new Error('Vendor not found')
  }
  
  saveVendors(updatedVendors)
}

// Get vendor by ID
export function getStoredVendorById(id: string): Vendor | null {
  const vendors = getStoredVendors()
  return vendors.find(vendor => vendor.id === id) || null
}

// Get vendor by email
export function getStoredVendorByEmail(email: string): Vendor | null {
  const vendors = getStoredVendors()
  return vendors.find(vendor => vendor.email === email) || null
}

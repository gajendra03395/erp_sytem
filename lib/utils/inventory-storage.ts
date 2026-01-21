import fs from 'fs'
import path from 'path'
import type { InventoryItem, CreateInventoryItem, UpdateInventoryItem } from '@/types/inventory'

const INVENTORY_FILE = path.join(process.cwd(), 'public', 'inventory.json')

// Get all inventory items from file
export function getStoredInventory(): InventoryItem[] {
  try {
    if (fs.existsSync(INVENTORY_FILE)) {
      const data = fs.readFileSync(INVENTORY_FILE, 'utf-8')
      const inventory = JSON.parse(data)
      // Convert date strings back to Date objects
      return inventory.map((item: any) => ({
        ...item,
        created_at: new Date(item.created_at),
        updated_at: new Date(item.updated_at),
      }))
    }
  } catch (err) {
    console.error('Error reading inventory:', err)
  }
  return []
}

// Save inventory items to file
export function saveInventory(items: InventoryItem[]): void {
  try {
    // Ensure public directory exists
    const publicDir = path.dirname(INVENTORY_FILE)
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true })
    }
    
    fs.writeFileSync(INVENTORY_FILE, JSON.stringify(items, null, 2))
  } catch (err) {
    console.error('Error saving inventory:', err)
    throw new Error('Failed to save inventory')
  }
}

// Add new inventory item
export function addStoredInventory(itemData: CreateInventoryItem): InventoryItem {
  const inventory = getStoredInventory()
  
  // Check if item name already exists
  if (inventory.some(item => item.item_name === itemData.item_name)) {
    throw new Error(`Item ${itemData.item_name} already exists`)
  }
  
  const newItem: InventoryItem = {
    id: Date.now().toString(),
    ...itemData,
    created_at: new Date(),
    updated_at: new Date(),
  }
  
  const updatedInventory = [...inventory, newItem]
  saveInventory(updatedInventory)
  
  return newItem
}

// Update inventory item
export function updateStoredInventory(id: string, updates: UpdateInventoryItem): InventoryItem {
  const inventory = getStoredInventory()
  const itemIndex = inventory.findIndex(item => item.id === id)
  
  if (itemIndex === -1) {
    throw new Error('Item not found')
  }
  
  const updatedItem = {
    ...inventory[itemIndex],
    ...updates,
    updated_at: new Date(),
  }
  
  inventory[itemIndex] = updatedItem
  saveInventory(inventory)
  
  return updatedItem
}

// Delete inventory item
export function deleteStoredInventory(id: string): void {
  const inventory = getStoredInventory()
  const updatedInventory = inventory.filter(item => item.id !== id)
  
  if (inventory.length === updatedInventory.length) {
    throw new Error('Item not found')
  }
  
  saveInventory(updatedInventory)
}

// Get inventory item by ID
export function getStoredInventoryItemById(id: string): InventoryItem | null {
  const inventory = getStoredInventory()
  return inventory.find(item => item.id === id) || null
}

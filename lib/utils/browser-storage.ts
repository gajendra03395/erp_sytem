// Universal browser-compatible storage utility
// This replaces all Node.js fs-based storage with localStorage

export interface StorageItem {
  id: string
  [key: string]: any
  created_at: Date
  updated_at: Date
}

// Check if we're in browser environment
const isBrowser = typeof window !== 'undefined'

// Generic storage functions
export class BrowserStorage {
  private static getStorageKey(prefix: string): string {
    return `erp_${prefix}_data`
  }

  static getAll<T extends StorageItem>(prefix: string): T[] {
    try {
      if (isBrowser) {
        const data = localStorage.getItem(this.getStorageKey(prefix))
        if (data) {
          const items = JSON.parse(data)
          return items.map((item: any) => ({
            ...item,
            created_at: new Date(item.created_at),
            updated_at: new Date(item.updated_at),
          }))
        }
      }
    } catch (err) {
      console.error(`Error reading ${prefix} storage:`, err)
    }
    return []
  }

  static save<T extends StorageItem>(prefix: string, items: T[]): void {
    try {
      if (isBrowser) {
        localStorage.setItem(this.getStorageKey(prefix), JSON.stringify(items, null, 2))
      }
    } catch (err) {
      console.error(`Error saving ${prefix} storage:`, err)
      throw new Error(`Failed to save ${prefix} data`)
    }
  }

  static add<T extends StorageItem>(prefix: string, itemData: Omit<T, 'id' | 'created_at' | 'updated_at'>): T {
    const items = this.getAll<T>(prefix)
    
    // Check for duplicates based on common fields
    const duplicateField = this.findDuplicateField(itemData)
    if (duplicateField && items.some(item => item[duplicateField] === itemData[duplicateField])) {
      throw new Error(`${duplicateField} already exists`)
    }
    
    const newItem: T = {
      id: Date.now().toString(),
      ...itemData,
      created_at: new Date(),
      updated_at: new Date(),
    } as T
    
    const updatedItems = [...items, newItem]
    this.save(prefix, updatedItems)
    
    return newItem
  }

  static update<T extends StorageItem>(prefix: string, id: string, updates: Partial<T>): T {
    const items = this.getAll<T>(prefix)
    const itemIndex = items.findIndex(item => item.id === id)
    
    if (itemIndex === -1) {
      throw new Error('Item not found')
    }
    
    const updatedItem = {
      ...items[itemIndex],
      ...updates,
      updated_at: new Date(),
    }
    
    items[itemIndex] = updatedItem
    this.save(prefix, items)
    
    return updatedItem
  }

  static delete(prefix: string, id: string): void {
    const items = this.getAll(prefix)
    const updatedItems = items.filter(item => item.id !== id)
    
    if (items.length === updatedItems.length) {
      throw new Error('Item not found')
    }
    
    this.save(prefix, updatedItems)
  }

  static findById<T extends StorageItem>(prefix: string, id: string): T | null {
    const items = this.getAll<T>(prefix)
    return items.find(item => item.id === id) || null
  }

  private static findDuplicateField(itemData: any): string | null {
    if (itemData.email) return 'email'
    if (itemData.employee_id) return 'employee_id'
    if (itemData.item_name) return 'item_name'
    if (itemData.name) return 'name'
    return null
  }
}

// Export specific storage functions for backward compatibility
export function createStorageFunctions(prefix: string) {
  return {
    getAll: () => BrowserStorage.getAll(prefix),
    add: (itemData: any) => BrowserStorage.add(prefix, itemData),
    update: (id: string, updates: any) => BrowserStorage.update(prefix, id, updates),
    delete: (id: string) => BrowserStorage.delete(prefix, id),
    findById: (id: string) => BrowserStorage.findById(prefix, id),
    save: (items: any[]) => BrowserStorage.save(prefix, items),
  }
}

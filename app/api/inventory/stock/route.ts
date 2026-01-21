import { NextRequest, NextResponse } from 'next/server'
import { getStoredInventory, updateStoredInventory } from '@/lib/utils/inventory-storage'
import type { StockTransaction } from '@/types/inventory'

export async function POST(request: NextRequest) {
  try {
    const transaction: StockTransaction = await request.json()
    
    // Find existing item or create new one
    const items = getStoredInventory()
    const existingItem = items.find(
      (item) => item.item_name.toLowerCase() === transaction.item_name.toLowerCase()
    )

    if (existingItem) {
      // Update existing item
      const updatedItem = updateStoredInventory(existingItem.id, {
        stock_level: existingItem.stock_level + transaction.quantity,
      })
      return NextResponse.json({ success: true, data: updatedItem }, { status: 200 })
    } else {
      // Create new item (you might want to create a separate endpoint for this)
      return NextResponse.json(
        { success: false, error: 'Item not found. Please create the item first.' },
        { status: 404 }
      )
    }
  } catch (error) {
    console.error('Error adding stock:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to add stock' },
      { status: 500 }
    )
  }
}

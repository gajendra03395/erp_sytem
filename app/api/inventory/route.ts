import { NextRequest, NextResponse } from 'next/server'
import { getStoredInventory, addStoredInventory, updateStoredInventory, deleteStoredInventory } from '@/lib/utils/inventory-storage'

// GET all inventory items
export async function GET() {
  try {
    console.log('Fetching inventory items...')
    const items = getStoredInventory()
    console.log('Inventory items fetched:', items)
    return NextResponse.json({
      success: true,
      data: items
    })
  } catch (error) {
    console.error('Error fetching inventory:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch inventory', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// POST new inventory item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const newItem = addStoredInventory(body)

    return NextResponse.json({
      success: true,
      data: newItem
    })
  } catch (error) {
    console.error('Error creating inventory item:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create inventory item' },
      { status: 500 }
    )
  }
}

// PUT update inventory item
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      )
    }
    
    const updatedItem = updateStoredInventory(id, updates)

    return NextResponse.json({
      success: true,
      data: updatedItem
    })
  } catch (error) {
    console.error('Error updating inventory item:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update inventory item' },
      { status: 500 }
    )
  }
}

// DELETE inventory item
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Inventory item ID is required' },
        { status: 400 }
      )
    }

    deleteStoredInventory(id)

    return NextResponse.json({
      success: true,
      message: 'Inventory item deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting inventory item:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete inventory item' },
      { status: 500 }
    )
  }
}

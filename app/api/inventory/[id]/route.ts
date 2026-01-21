import { NextRequest, NextResponse } from 'next/server'
import { updateStoredInventory, deleteStoredInventory, getStoredInventoryItemById } from '@/lib/utils/inventory-storage'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = getStoredInventoryItemById(params.id)
    if (!item) {
      return NextResponse.json(
        { success: false, error: 'Item not found' },
        { status: 404 }
      )
    }
    return NextResponse.json({ success: true, data: item })
  } catch (error) {
    console.error('Error fetching inventory item:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch inventory item' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const updates = await request.json()

    const updatedItem = updateStoredInventory(id, updates)

    return NextResponse.json({
      success: true,
      data: updatedItem,
    })
  } catch (error) {
    console.error('Error updating inventory item:', error)
    const message = error instanceof Error ? error.message : 'Failed to update inventory item'
    return NextResponse.json(
      { error: message },
      { status: 400 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    deleteStoredInventory(id)

    return NextResponse.json({
      success: true,
      message: 'Inventory item deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting inventory item:', error)
    const message = error instanceof Error ? error.message : 'Failed to delete inventory item'
    return NextResponse.json(
      { error: message },
      { status: 400 }
    )
  }
}

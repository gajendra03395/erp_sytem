import { NextRequest, NextResponse } from 'next/server'
import { getWarehouses, createWarehouse, updateWarehouse, deleteWarehouse } from '@/lib/db/prisma'

export async function GET() {
  try {
    const warehouses = await getWarehouses()
    return NextResponse.json({
      success: true,
      data: warehouses
    })
  } catch (error) {
    console.error('Error fetching warehouses:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch warehouses' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const newWarehouse = await createWarehouse(body)

    return NextResponse.json({
      success: true,
      data: newWarehouse
    })
  } catch (error) {
    console.error('Error creating warehouse:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create warehouse' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body
    
    const updatedWarehouse = await updateWarehouse(id, updates)

    return NextResponse.json({
      success: true,
      data: updatedWarehouse
    })
  } catch (error) {
    console.error('Error updating warehouse:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update warehouse' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Warehouse ID is required' },
        { status: 400 }
      )
    }

    await deleteWarehouse(id)

    return NextResponse.json({
      success: true,
      message: 'Warehouse deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting warehouse:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete warehouse' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { getStockMovements, getStockMovementsByItem, createStockMovement, deleteStockMovement } from '@/lib/db/prisma'
import type { StockMovement, CreateStockMovement } from '@/lib/db/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const itemId = searchParams.get('itemId')
    
    let movements
    if (itemId) {
      movements = await getStockMovementsByItem(itemId)
    } else {
      movements = await getStockMovements()
    }

    return NextResponse.json({
      success: true,
      data: movements
    })
  } catch (error) {
    console.error('Error fetching stock movements:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stock movements' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateStockMovement = await request.json()
    
    const newMovement: StockMovement = await createStockMovement(body)

    return NextResponse.json({
      success: true,
      data: newMovement
    })
  } catch (error) {
    console.error('Error creating stock movement:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create stock movement' },
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
        { success: false, error: 'Stock movement ID is required' },
        { status: 400 }
      )
    }

    await deleteStockMovement(id)

    return NextResponse.json({
      success: true,
      message: 'Stock movement deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting stock movement:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete stock movement' },
      { status: 500 }
    )
  }
}

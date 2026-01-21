import { NextRequest, NextResponse } from 'next/server'
import { getStockAlerts, getUnresolvedStockAlerts, createStockAlert, updateStockAlert, deleteStockAlert } from '@/lib/db/prisma'
import type { StockAlert, CreateStockAlert, UpdateStockAlert } from '@/lib/db/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const unresolved = searchParams.get('unresolved')
    
    let alerts
    if (unresolved === 'true') {
      alerts = await getUnresolvedStockAlerts()
    } else {
      alerts = await getStockAlerts()
    }

    return NextResponse.json({
      success: true,
      data: alerts
    })
  } catch (error) {
    console.error('Error fetching stock alerts:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stock alerts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateStockAlert = await request.json()
    
    const newAlert: StockAlert = await createStockAlert(body)

    return NextResponse.json({
      success: true,
      data: newAlert
    })
  } catch (error) {
    console.error('Error creating stock alert:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create stock alert' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body: { id: string } & UpdateStockAlert = await request.json()
    const { id, ...updates } = body
    
    const updatedAlert = await updateStockAlert(id, updates)

    return NextResponse.json({
      success: true,
      data: updatedAlert
    })
  } catch (error) {
    console.error('Error updating stock alert:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update stock alert' },
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
        { success: false, error: 'Stock alert ID is required' },
        { status: 400 }
      )
    }

    await deleteStockAlert(id)

    return NextResponse.json({
      success: true,
      message: 'Stock alert deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting stock alert:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete stock alert' },
      { status: 500 }
    )
  }
}

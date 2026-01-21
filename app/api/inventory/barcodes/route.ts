import { NextRequest, NextResponse } from 'next/server'
import { getBarcodes, getBarcodeByValue, createBarcode, updateBarcode, deleteBarcode } from '@/lib/db/prisma'
import type { Barcode, CreateBarcode, UpdateBarcode } from '@/lib/db/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const value = searchParams.get('value')
    
    if (value) {
      const barcode = await getBarcodeByValue(value)
      return NextResponse.json({
        success: true,
        data: barcode
      })
    } else {
      const barcodes = await getBarcodes()
      return NextResponse.json({
        success: true,
        data: barcodes
      })
    }
  } catch (error) {
    console.error('Error fetching barcodes:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch barcodes' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateBarcode = await request.json()
    
    const newBarcode: Barcode = await createBarcode(body)

    return NextResponse.json({
      success: true,
      data: newBarcode
    })
  } catch (error) {
    console.error('Error creating barcode:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create barcode' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body: { id: string } & UpdateBarcode = await request.json()
    const { id, ...updates } = body
    
    const updatedBarcode = await updateBarcode(id, updates)

    return NextResponse.json({
      success: true,
      data: updatedBarcode
    })
  } catch (error) {
    console.error('Error updating barcode:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update barcode' },
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
        { success: false, error: 'Barcode ID is required' },
        { status: 400 }
      )
    }

    await deleteBarcode(id)

    return NextResponse.json({
      success: true,
      message: 'Barcode deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting barcode:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete barcode' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { getVendors, createVendor, updateVendor, deleteVendor } from '@/lib/db/prisma'
import type { Vendor, CreateVendor, UpdateVendor } from '@/lib/db/prisma'

export async function GET() {
  try {
    const vendors = await getVendors()
    return NextResponse.json({
      success: true,
      data: vendors
    })
  } catch (error) {
    console.error('Error fetching vendors:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch vendors' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateVendor = await request.json()
    
    const newVendor: Vendor = await createVendor(body)

    return NextResponse.json({
      success: true,
      data: newVendor
    })
  } catch (error) {
    console.error('Error creating vendor:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create vendor' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body: { id: string } & UpdateVendor = await request.json()
    const { id, ...updates } = body
    
    const updatedVendor = await updateVendor(id, updates)

    return NextResponse.json({
      success: true,
      data: updatedVendor
    })
  } catch (error) {
    console.error('Error updating vendor:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update vendor' },
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
        { success: false, error: 'Vendor ID is required' },
        { status: 400 }
      )
    }

    await deleteVendor(id)

    return NextResponse.json({
      success: true,
      message: 'Vendor deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting vendor:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete vendor' },
      { status: 500 }
    )
  }
}

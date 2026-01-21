import { NextRequest, NextResponse } from 'next/server'
import { updateStoredVendor, deleteStoredVendor, getStoredVendorById } from '@/lib/utils/vendor-storage'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const vendor = getStoredVendorById(params.id)
    if (!vendor) {
      return NextResponse.json(
        { success: false, error: 'Vendor not found' },
        { status: 404 }
      )
    }
    return NextResponse.json({ success: true, data: vendor })
  } catch (error) {
    console.error('Error fetching vendor:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch vendor' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const updates = await request.json()
    const updatedVendor = updateStoredVendor(params.id, updates)
    return NextResponse.json({ success: true, data: updatedVendor })
  } catch (error) {
    console.error('Error updating vendor:', error)
    const message = error instanceof Error ? error.message : 'Failed to update vendor'
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    deleteStoredVendor(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting vendor:', error)
    const message = error instanceof Error ? error.message : 'Failed to delete vendor'
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { getStoredVendors, addStoredVendor } from '@/lib/utils/vendor-storage'

// GET all vendors
export async function GET() {
  try {
    const vendors = getStoredVendors()
    return NextResponse.json({
      success: true,
      data: vendors,
    })
  } catch (error) {
    console.error('Error fetching vendors:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vendors' },
      { status: 500 }
    )
  }
}

// POST new vendor
export async function POST(request: NextRequest) {
  try {
    const vendorData = await request.json()

    // Validate required fields
    if (!vendorData.name || !vendorData.email) {
      return NextResponse.json(
        { error: 'Missing required vendor information' },
        { status: 400 }
      )
    }

    // Add vendor to storage
    const newVendor = addStoredVendor(vendorData)

    return NextResponse.json({
      success: true,
      data: newVendor,
    }, { status: 201 })
  } catch (error) {
    console.error('Error adding vendor:', error)
    const message = error instanceof Error ? error.message : 'Failed to add vendor'
    return NextResponse.json(
      { error: message },
      { status: 400 }
    )
  }
}

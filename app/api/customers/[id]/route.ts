import { NextRequest, NextResponse } from 'next/server'
import { updateStoredCustomer, deleteStoredCustomer, getStoredCustomerById } from '@/lib/utils/customer-storage'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const customer = getStoredCustomerById(params.id)
    if (!customer) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      )
    }
    return NextResponse.json({ success: true, data: customer })
  } catch (error) {
    console.error('Error fetching customer:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch customer' },
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
    const updatedCustomer = updateStoredCustomer(params.id, updates)
    return NextResponse.json({ success: true, data: updatedCustomer })
  } catch (error) {
    console.error('Error updating customer:', error)
    const message = error instanceof Error ? error.message : 'Failed to update customer'
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
    deleteStoredCustomer(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting customer:', error)
    const message = error instanceof Error ? error.message : 'Failed to delete customer'
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    )
  }
}

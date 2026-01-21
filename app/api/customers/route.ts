import { NextRequest, NextResponse } from 'next/server'
import { getStoredCustomers, addStoredCustomer } from '@/lib/utils/customer-storage'

// GET all customers
export async function GET() {
  try {
    const customers = getStoredCustomers()
    return NextResponse.json({
      success: true,
      data: customers,
    })
  } catch (error) {
    console.error('Error fetching customers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    )
  }
}

// POST new customer
export async function POST(request: NextRequest) {
  try {
    const customerData = await request.json()

    // Validate required fields
    if (!customerData.name || !customerData.email) {
      return NextResponse.json(
        { error: 'Missing required customer information' },
        { status: 400 }
      )
    }

    // Add customer to storage
    const newCustomer = addStoredCustomer(customerData)

    return NextResponse.json({
      success: true,
      data: newCustomer,
    }, { status: 201 })
  } catch (error) {
    console.error('Error adding customer:', error)
    const message = error instanceof Error ? error.message : 'Failed to add customer'
    return NextResponse.json(
      { error: message },
      { status: 400 }
    )
  }
}

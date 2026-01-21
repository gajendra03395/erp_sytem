import { NextRequest, NextResponse } from 'next/server'
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from '@/lib/db/prisma'
import type { Customer, CreateCustomer, UpdateCustomer } from '@/lib/db/prisma'

export async function GET() {
  try {
    const customers = await getCustomers()
    return NextResponse.json({
      success: true,
      data: customers
    })
  } catch (error) {
    console.error('Error fetching customers:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch customers' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateCustomer = await request.json()
    
    const newCustomer: Customer = await createCustomer(body)

    return NextResponse.json({
      success: true,
      data: newCustomer
    })
  } catch (error) {
    console.error('Error creating customer:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create customer' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body: { id: string } & UpdateCustomer = await request.json()
    const { id, ...updates } = body
    
    const updatedCustomer = await updateCustomer(id, updates)

    return NextResponse.json({
      success: true,
      data: updatedCustomer
    })
  } catch (error) {
    console.error('Error updating customer:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update customer' },
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
        { success: false, error: 'Customer ID is required' },
        { status: 400 }
      )
    }

    await deleteCustomer(id)

    return NextResponse.json({
      success: true,
      message: 'Customer deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting customer:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete customer' },
      { status: 500 }
    )
  }
}

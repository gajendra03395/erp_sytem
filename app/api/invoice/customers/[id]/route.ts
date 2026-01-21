import { NextRequest, NextResponse } from 'next/server'
import { updateCustomer, deleteCustomer, readCustomers } from '@/lib/utils/invoice-storage'
import { hasPermission } from '@/lib/auth/permissions'
import { getAuthUser } from '@/lib/auth/server-auth'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser(request)
    if (!user || !hasPermission(user.role, 'view_inventory')) {
      return NextResponse.json({ error: user ? 'Forbidden' : 'Unauthorized' }, { status: user ? 403 : 401 })
    }

    const customers = await readCustomers()
    const customer = customers.find(c => c.id === params.id)
    return customer ? NextResponse.json(customer) : NextResponse.json({ error: 'Customer not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch customer' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser(request)
    if (!user || !hasPermission(user.role, 'edit_inventory')) {
      return NextResponse.json({ error: user ? 'Forbidden' : 'Unauthorized' }, { status: user ? 403 : 401 })
    }

    const body = await request.json()
    const customer = await updateCustomer(params.id, body)
    return customer ? NextResponse.json(customer) : NextResponse.json({ error: 'Customer not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser(request)
    if (!user || !hasPermission(user.role, 'delete_inventory')) {
      return NextResponse.json({ error: user ? 'Forbidden' : 'Unauthorized' }, { status: user ? 403 : 401 })
    }

    const success = await deleteCustomer(params.id)
    return success ? NextResponse.json({ message: 'Customer deleted' }) : NextResponse.json({ error: 'Customer not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete customer' }, { status: 500 })
  }
}

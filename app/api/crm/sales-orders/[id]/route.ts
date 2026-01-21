import { NextRequest, NextResponse } from 'next/server'
import { updateSalesOrder, deleteSalesOrder, readSalesOrders } from '@/lib/utils/crm-storage'
import { hasPermission } from '@/lib/auth/permissions'
import { getAuthUser } from '@/lib/auth/server-auth'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser(request)
    if (!user || !hasPermission(user.role, 'view_inventory')) {
      return NextResponse.json({ error: user ? 'Forbidden' : 'Unauthorized' }, { status: user ? 403 : 401 })
    }

    const salesOrders = await readSalesOrders()
    const salesOrder = salesOrders.find(so => so.id === params.id)
    return salesOrder ? NextResponse.json(salesOrder) : NextResponse.json({ error: 'Sales order not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch sales order' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser(request)
    if (!user || !hasPermission(user.role, 'edit_inventory')) {
      return NextResponse.json({ error: user ? 'Forbidden' : 'Unauthorized' }, { status: user ? 403 : 401 })
    }

    const body = await request.json()
    const salesOrder = await updateSalesOrder(params.id, body)
    return salesOrder ? NextResponse.json(salesOrder) : NextResponse.json({ error: 'Sales order not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update sales order' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser(request)
    if (!user || !hasPermission(user.role, 'delete_inventory')) {
      return NextResponse.json({ error: user ? 'Forbidden' : 'Unauthorized' }, { status: user ? 403 : 401 })
    }

    const success = await deleteSalesOrder(params.id)
    return success ? NextResponse.json({ message: 'Sales order deleted' }) : NextResponse.json({ error: 'Sales order not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete sales order' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { createSalesOrder, readSalesOrders } from '@/lib/utils/crm-storage'
import { hasPermission } from '@/lib/auth/permissions'
import { getAuthUser } from '@/lib/auth/server-auth'

export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!hasPermission(user.role, 'view_inventory')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const salesOrders = await readSalesOrders()
    return NextResponse.json(salesOrders)
  } catch (error) {
    console.error('Failed to fetch sales orders:', error)
    return NextResponse.json({ error: 'Failed to fetch sales orders' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getAuthUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!hasPermission(user.role, 'edit_inventory')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const salesOrder = await createSalesOrder(body)
    return NextResponse.json(salesOrder, { status: 201 })
  } catch (error) {
    console.error('Failed to create sales order:', error)
    return NextResponse.json({ error: 'Failed to create sales order' }, { status: 500 })
  }
}

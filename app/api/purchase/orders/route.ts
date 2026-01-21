import { NextRequest, NextResponse } from 'next/server'
import { createPurchaseOrder, readPurchaseOrders } from '@/lib/utils/purchase-storage'
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

    const purchaseOrders = await readPurchaseOrders()
    return NextResponse.json(purchaseOrders)
  } catch (error) {
    console.error('Failed to fetch purchase orders:', error)
    return NextResponse.json({ error: 'Failed to fetch purchase orders' }, { status: 500 })
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
    const purchaseOrder = await createPurchaseOrder(body)
    return NextResponse.json(purchaseOrder, { status: 201 })
  } catch (error) {
    console.error('Failed to create purchase order:', error)
    return NextResponse.json({ error: 'Failed to create purchase order' }, { status: 500 })
  }
}

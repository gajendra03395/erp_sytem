import { NextRequest, NextResponse } from 'next/server'
import { updatePurchaseOrder, deletePurchaseOrder, readPurchaseOrders } from '@/lib/utils/purchase-storage'
import { hasPermission } from '@/lib/auth/permissions'
import { getAuthUser } from '@/lib/auth/server-auth'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser(request)
    if (!user || !hasPermission(user.role, 'view_inventory')) {
      return NextResponse.json({ error: user ? 'Forbidden' : 'Unauthorized' }, { status: user ? 403 : 401 })
    }

    const purchaseOrders = await readPurchaseOrders()
    const purchaseOrder = purchaseOrders.find(po => po.id === params.id)
    return purchaseOrder ? NextResponse.json(purchaseOrder) : NextResponse.json({ error: 'Purchase order not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch purchase order' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser(request)
    if (!user || !hasPermission(user.role, 'edit_inventory')) {
      return NextResponse.json({ error: user ? 'Forbidden' : 'Unauthorized' }, { status: user ? 403 : 401 })
    }

    const body = await request.json()
    const purchaseOrder = await updatePurchaseOrder(params.id, body)
    return purchaseOrder ? NextResponse.json(purchaseOrder) : NextResponse.json({ error: 'Purchase order not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update purchase order' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser(request)
    if (!user || !hasPermission(user.role, 'delete_inventory')) {
      return NextResponse.json({ error: user ? 'Forbidden' : 'Unauthorized' }, { status: user ? 403 : 401 })
    }

    const success = await deletePurchaseOrder(params.id)
    return success ? NextResponse.json({ message: 'Purchase order deleted' }) : NextResponse.json({ error: 'Purchase order not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete purchase order' }, { status: 500 })
  }
}

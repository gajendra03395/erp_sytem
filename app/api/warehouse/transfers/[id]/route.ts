import { NextRequest, NextResponse } from 'next/server'
import { updateStockTransfer, deleteStockTransfer, readStockTransfers } from '@/lib/utils/warehouse-storage'
import { hasPermission } from '@/lib/auth/permissions'
import { getAuthUser } from '@/lib/auth/server-auth'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser(request)
    if (!user || !hasPermission(user.role, 'view_inventory')) {
      return NextResponse.json({ error: user ? 'Forbidden' : 'Unauthorized' }, { status: user ? 403 : 401 })
    }

    const transfers = await readStockTransfers()
    const transfer = transfers.find(t => t.id === params.id)
    return transfer ? NextResponse.json(transfer) : NextResponse.json({ error: 'Stock transfer not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stock transfer' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser(request)
    if (!user || !hasPermission(user.role, 'edit_inventory')) {
      return NextResponse.json({ error: user ? 'Forbidden' : 'Unauthorized' }, { status: user ? 403 : 401 })
    }

    const body = await request.json()
    const transfer = await updateStockTransfer(params.id, { ...body, approved_by: user.id })
    return transfer ? NextResponse.json(transfer) : NextResponse.json({ error: 'Stock transfer not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update stock transfer' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser(request)
    if (!user || !hasPermission(user.role, 'delete_inventory')) {
      return NextResponse.json({ error: user ? 'Forbidden' : 'Unauthorized' }, { status: user ? 403 : 401 })
    }

    const success = await deleteStockTransfer(params.id)
    return success ? NextResponse.json({ message: 'Stock transfer deleted' }) : NextResponse.json({ error: 'Stock transfer not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete stock transfer' }, { status: 500 })
  }
}

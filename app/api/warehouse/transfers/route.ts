import { NextRequest, NextResponse } from 'next/server'
import { createStockTransfer, readStockTransfers } from '@/lib/utils/warehouse-storage'
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

    const transfers = await readStockTransfers()
    return NextResponse.json(transfers)
  } catch (error) {
    console.error('Failed to fetch stock transfers:', error)
    return NextResponse.json({ error: 'Failed to fetch stock transfers' }, { status: 500 })
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
    const transfer = await createStockTransfer({ ...body, requested_by: user.id })
    return NextResponse.json(transfer, { status: 201 })
  } catch (error) {
    console.error('Failed to create stock transfer:', error)
    return NextResponse.json({ error: 'Failed to create stock transfer' }, { status: 500 })
  }
}

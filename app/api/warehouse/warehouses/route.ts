import { NextRequest, NextResponse } from 'next/server'
import { createWarehouse, readWarehouses } from '@/lib/utils/warehouse-storage'
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

    const warehouses = await readWarehouses()
    return NextResponse.json(warehouses)
  } catch (error) {
    console.error('Failed to fetch warehouses:', error)
    return NextResponse.json({ error: 'Failed to fetch warehouses' }, { status: 500 })
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
    const warehouse = await createWarehouse(body)
    return NextResponse.json(warehouse, { status: 201 })
  } catch (error) {
    console.error('Failed to create warehouse:', error)
    return NextResponse.json({ error: 'Failed to create warehouse' }, { status: 500 })
  }
}

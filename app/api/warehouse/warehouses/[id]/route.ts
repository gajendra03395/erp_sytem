import { NextRequest, NextResponse } from 'next/server'
import { updateWarehouse, deleteWarehouse, readWarehouses } from '@/lib/utils/warehouse-storage'
import { hasPermission } from '@/lib/auth/permissions'
import { getAuthUser } from '@/lib/auth/server-auth'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser(request)
    if (!user || !hasPermission(user.role, 'view_inventory')) {
      return NextResponse.json({ error: user ? 'Forbidden' : 'Unauthorized' }, { status: user ? 403 : 401 })
    }

    const warehouses = await readWarehouses()
    const warehouse = warehouses.find(w => w.id === params.id)
    return warehouse ? NextResponse.json(warehouse) : NextResponse.json({ error: 'Warehouse not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch warehouse' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser(request)
    if (!user || !hasPermission(user.role, 'edit_inventory')) {
      return NextResponse.json({ error: user ? 'Forbidden' : 'Unauthorized' }, { status: user ? 403 : 401 })
    }

    const body = await request.json()
    const warehouse = await updateWarehouse(params.id, body)
    return warehouse ? NextResponse.json(warehouse) : NextResponse.json({ error: 'Warehouse not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update warehouse' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser(request)
    if (!user || !hasPermission(user.role, 'delete_inventory')) {
      return NextResponse.json({ error: user ? 'Forbidden' : 'Unauthorized' }, { status: user ? 403 : 401 })
    }

    const success = await deleteWarehouse(params.id)
    return success ? NextResponse.json({ message: 'Warehouse deleted' }) : NextResponse.json({ error: 'Warehouse not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete warehouse' }, { status: 500 })
  }
}

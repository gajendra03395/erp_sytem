import { NextRequest, NextResponse } from 'next/server'
import { updateWorkOrder, deleteWorkOrder, readWorkOrders } from '@/lib/utils/production-storage'
import { hasPermission } from '@/lib/auth/permissions'
import { getAuthUser } from '@/lib/auth/server-auth'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!hasPermission(user.role, 'view_production')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const workOrders = await readWorkOrders()
    const workOrder = workOrders.find(wo => wo.id === params.id)
    
    if (!workOrder) {
      return NextResponse.json({ error: 'Work order not found' }, { status: 404 })
    }

    return NextResponse.json(workOrder)
  } catch (error) {
    console.error('Failed to fetch work order:', error)
    return NextResponse.json({ error: 'Failed to fetch work order' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!hasPermission(user.role, 'manage_production')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const workOrder = await updateWorkOrder(params.id, body)
    
    if (!workOrder) {
      return NextResponse.json({ error: 'Work order not found' }, { status: 404 })
    }

    return NextResponse.json(workOrder)
  } catch (error) {
    console.error('Failed to update work order:', error)
    return NextResponse.json({ error: 'Failed to update work order' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!hasPermission(user.role, 'manage_production')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const success = await deleteWorkOrder(params.id)
    
    if (!success) {
      return NextResponse.json({ error: 'Work order not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Work order deleted successfully' })
  } catch (error) {
    console.error('Failed to delete work order:', error)
    return NextResponse.json({ error: 'Failed to delete work order' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma-client'
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

    const workOrder = await prisma.workOrder.findUnique({
      where: { id: params.id }
    })
    
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
    const workOrder = await prisma.workOrder.update({
      where: { id: params.id },
      data: {
        ...(body.order_no && { orderNo: body.order_no }),
        ...(body.product_name && { productName: body.product_name }),
        ...(body.product_sku && { productSku: body.product_sku }),
        ...(body.quantity && { quantity: body.quantity }),
        ...(body.priority && { priority: body.priority }),
        ...(body.status && { status: body.status }),
        ...(body.start_date && { startDate: new Date(body.start_date).toISOString() }),
        ...(body.due_date && { dueDate: new Date(body.due_date).toISOString() }),
        ...(body.notes !== undefined && { notes: body.notes }),
        ...(body.assigned_to && { assignedTo: body.assigned_to }),
      }
    })
    
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

    const workOrder = await prisma.workOrder.delete({
      where: { id: params.id }
    })
    
    if (!workOrder) {
      return NextResponse.json({ error: 'Work order not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Work order deleted successfully' })
  } catch (error) {
    console.error('Failed to delete work order:', error)
    return NextResponse.json({ error: 'Failed to delete work order' }, { status: 500 })
  }
}

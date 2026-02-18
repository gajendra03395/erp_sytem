import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma-client'

export async function GET() {
  try {
    const workOrders = await prisma.workOrder.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json({ success: true, data: workOrders })
  } catch (error) {
    console.error('Error fetching work orders:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch work orders' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const newWorkOrder = await prisma.workOrder.create({
      data: {
        orderNo: body.order_no,
        productName: body.product_name,
        productSku: body.product_sku,
        quantity: body.quantity,
        priority: body.priority || 'MEDIUM',
        status: 'PENDING',
        startDate: body.start_date ? new Date(body.start_date).toISOString() : new Date().toISOString(),
        dueDate: body.due_date ? new Date(body.due_date).toISOString() : new Date().toISOString(),
        notes: body.notes || null,
        assignedTo: body.assigned_to || null,
      }
    })
    
    return NextResponse.json({ success: true, data: newWorkOrder })
  } catch (error) {
    console.error('Error creating work order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create work order' },
      { status: 500 }
    )
  }
}

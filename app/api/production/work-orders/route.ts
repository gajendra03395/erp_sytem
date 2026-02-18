import { NextRequest, NextResponse } from 'next/server'

// Mock work orders for production deployment fallback
const mockWorkOrders = [
  {
    id: '1',
    orderNo: 'WO-2024-001',
    productName: 'Steel Frame Assembly',
    productSku: 'PROD-001',
    quantity: 100,
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    startDate: new Date().toISOString(),
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Urgent order for client A',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    orderNo: 'WO-2024-002', 
    productName: 'Electronic Component',
    productSku: 'PROD-002',
    quantity: 500,
    status: 'PENDING',
    priority: 'MEDIUM',
    startDate: new Date().toISOString(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Regular production run',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    orderNo: 'WO-2024-003',
    productName: 'Plastic Housing', 
    productSku: 'PROD-003',
    quantity: 200,
    status: 'COMPLETED',
    priority: 'LOW',
    startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Completed ahead of schedule',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  }
]

export async function GET() {
  try {
    // Try database first, fallback to mock data
    try {
      const { prisma } = await import('@/lib/db/prisma-client')
      const workOrders = await prisma.workOrder.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      })
      
      return NextResponse.json({ success: true, data: workOrders })
    } catch (dbError) {
      console.log('Database not available, using mock work orders:', dbError)
      return NextResponse.json({ success: true, data: mockWorkOrders })
    }
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
    
    // Try database first, fallback to mock data
    try {
      const { prisma } = await import('@/lib/db/prisma-client')
      
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
    } catch (dbError) {
      console.log('Database not available, using mock add:', dbError)
      
      // Mock add
      const newWorkOrder = {
        id: Date.now().toString(),
        orderNo: body.order_no,
        productName: body.product_name,
        productSku: body.product_sku,
        quantity: body.quantity,
        status: 'PENDING',
        priority: body.priority || 'MEDIUM',
        startDate: body.start_date || new Date().toISOString(),
        dueDate: body.due_date || new Date().toISOString(),
        notes: body.notes,
        assignedTo: body.assigned_to,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      
      mockWorkOrders.push(newWorkOrder)
      
      return NextResponse.json({ success: true, data: newWorkOrder })
    }
  } catch (error) {
    console.error('Error creating work order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create work order' },
      { status: 500 }
    )
  }
}

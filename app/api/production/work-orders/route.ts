import { NextRequest, NextResponse } from 'next/server'

// Mock work orders data for development
const mockWorkOrders = [
  {
    id: '1',
    order_no: 'WO-2024-001',
    product_sku: 'PROD-001',
    product_name: 'Steel Frame Assembly',
    quantity: 100,
    unit: 'pcs',
    status: 'in_progress',
    priority: 'high',
    start_date: '2024-01-15',
    due_date: '2024-01-20',
    assigned_to: 'John Doe',
    bom_id: 'BOM-001',
    notes: 'Urgent order for client A',
    created_at: '2024-01-15T00:00:00.000Z',
    updated_at: '2024-01-15T00:00:00.000Z',
    bom: {
      id: 'BOM-001',
      bom_code: 'BOM-001',
      product_name: 'Steel Frame Assembly',
      product_sku: 'PROD-001',
      version: '1.0',
      total_cost: 1500.00,
      currency: 'USD',
      active: true
    }
  },
  {
    id: '2',
    order_no: 'WO-2024-002',
    product_sku: 'PROD-002',
    product_name: 'Electronic Component',
    quantity: 500,
    unit: 'pcs',
    status: 'pending',
    priority: 'medium',
    start_date: '2024-01-18',
    due_date: '2024-01-25',
    assigned_to: 'Jane Smith',
    bom_id: 'BOM-002',
    notes: 'Regular production run',
    created_at: '2024-01-16T00:00:00.000Z',
    updated_at: '2024-01-16T00:00:00.000Z',
    bom: {
      id: 'BOM-002',
      bom_code: 'BOM-002',
      product_name: 'Electronic Component',
      product_sku: 'PROD-002',
      version: '1.0',
      total_cost: 750.00,
      currency: 'USD',
      active: true
    }
  },
  {
    id: '3',
    order_no: 'WO-2024-003',
    product_sku: 'PROD-003',
    product_name: 'Plastic Housing',
    quantity: 200,
    unit: 'pcs',
    status: 'completed',
    priority: 'low',
    start_date: '2024-01-10',
    due_date: '2024-01-12',
    assigned_to: 'Mike Wilson',
    bom_id: 'BOM-003',
    notes: 'Completed ahead of schedule',
    created_at: '2024-01-10T00:00:00.000Z',
    updated_at: '2024-01-12T00:00:00.000Z',
    bom: {
      id: 'BOM-003',
      bom_code: 'BOM-003',
      product_name: 'Plastic Housing',
      product_sku: 'PROD-003',
      version: '1.0',
      total_cost: 300.00,
      currency: 'USD',
      active: true
    }
  }
]

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: mockWorkOrders,
    })
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
    
    const newWorkOrder = {
      id: Date.now().toString(),
      orderNo: `WO-2024-${String(mockWorkOrders.length + 1).padStart(3, '0')}`,
      ...body,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      bom: {
        id: body.bomId,
        bomCode: body.bomId,
        productName: body.productName,
        version: '1.0',
        totalCost: 0,
        currency: 'USD',
        active: true
      }
    }
    
    mockWorkOrders.push(newWorkOrder)
    
    return NextResponse.json({
      success: true,
      data: newWorkOrder,
    })
  } catch (error) {
    console.error('Error creating work order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create work order' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma-client'

// GET all employees
export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      include: {
        user: {
          select: {
            email: true,
            role: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json({
      success: true,
      data: employees,
    })
  } catch (error) {
    console.error('Error fetching employees:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch employees' },
      { status: 500 }
    )
  }
}

// POST new employee
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Check if employee with same email or employeeId already exists
    const existingEmployee = await prisma.employee.findFirst({
      where: {
        OR: [
          { email: body.email },
          { employeeId: body.employee_id }
        ]
      }
    })
    
    if (existingEmployee) {
      return NextResponse.json(
        { success: false, error: 'Employee with this email or ID already exists' },
        { status: 400 }
      )
    }
    
    // Create employee
    const newEmployee = await prisma.employee.create({
      data: {
        employeeId: body.employee_id,
        name: body.name,
        email: body.email,
        phone: body.phone || null,
        department: body.department || 'production',
        status: body.status || 'active',
        shift: body.shift || 'Day',
      },
      include: {
        user: {
          select: {
            email: true,
            role: true,
          }
        }
      }
    })
    
    return NextResponse.json({
      success: true,
      data: newEmployee,
    })
  } catch (error) {
    console.error('Error creating employee:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create employee' },
      { status: 500 }
    )
  }
}

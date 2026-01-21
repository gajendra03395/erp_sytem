import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma-client'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const employee = await prisma.employee.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            email: true,
            role: true,
          }
        }
      }
    })
    
    if (!employee) {
      return NextResponse.json(
        { success: false, error: 'Employee not found' },
        { status: 404 }
      )
    }
    return NextResponse.json({ success: true, data: employee })
  } catch (error) {
    console.error('Error fetching employee:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch employee' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const updates = await request.json()
    
    const updatedEmployee = await prisma.employee.update({
      where: { id: params.id },
      data: updates,
      include: {
        user: {
          select: {
            email: true,
            role: true,
          }
        }
      }
    })
    
    return NextResponse.json({ success: true, data: updatedEmployee })
  } catch (error) {
    console.error('Error updating employee:', error)
    const message = error instanceof Error ? error.message : 'Failed to update employee'
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // First get the employee to check if they have a user account
    const employee = await prisma.employee.findUnique({
      where: { id: params.id },
      include: { user: true }
    })
    
    if (!employee) {
      return NextResponse.json(
        { success: false, error: 'Employee not found' },
        { status: 404 }
      )
    }

    // Delete the employee (this will cascade delete the user if properly set up)
    await prisma.employee.delete({
      where: { id: params.id }
    })
    
    // If employee had a user, delete the user separately
    if (employee.user) {
      await prisma.user.delete({
        where: { id: employee.user.id }
      })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting employee:', error)
    const message = error instanceof Error ? error.message : 'Failed to delete employee'
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    )
  }
}

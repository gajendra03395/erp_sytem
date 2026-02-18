import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma-client'

export async function DELETE(request: NextRequest) {
  try {
    const { ids } = await request.json()

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Valid employee IDs array is required' },
        { status: 400 }
      )
    }

    // Delete employees and their associated users
    const deleteResult = await prisma.employee.deleteMany({
      where: {
        id: {
          in: ids
        }
      }
    })

    // Also delete any associated user accounts
    await prisma.user.deleteMany({
      where: {
        employeeId: {
          in: ids
        }
      }
    })

    return NextResponse.json({
      success: true,
      deleted: deleteResult.count,
      message: `${deleteResult.count} employee(s) deleted successfully`
    })

  } catch (error) {
    console.error('Bulk delete error:', error)
    return NextResponse.json(
      { error: 'Failed to process bulk delete' },
      { status: 500 }
    )
  }
}

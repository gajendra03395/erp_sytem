import { NextRequest, NextResponse } from 'next/server'
import { deleteEmployeeCredentials } from '@/lib/utils/credentials'

export async function DELETE(request: NextRequest) {
  try {
    const { employee_id } = await request.json()

    if (!employee_id) {
      return NextResponse.json(
        { error: 'Employee ID is required' },
        { status: 400 }
      )
    }

    // Delete credentials for the employee
    deleteEmployeeCredentials(employee_id)

    return NextResponse.json(
      {
        success: true,
        message: 'Login credentials deleted successfully',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting credentials:', error)
    return NextResponse.json(
      { error: 'Failed to delete login credentials' },
      { status: 500 }
    )
  }
}

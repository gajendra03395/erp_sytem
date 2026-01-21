import { NextRequest, NextResponse } from 'next/server'
import { addEmployeeCredentials } from '@/lib/utils/credentials'

export async function POST(request: NextRequest) {
  try {
    const employeeData = await request.json()

    // Validate required fields
    if (!employeeData.id || !employeeData.name || !employeeData.email || !employeeData.employee_id || !employeeData.role) {
      return NextResponse.json(
        { error: 'Missing required employee information' },
        { status: 400 }
      )
    }

    // Create credentials for the employee
    const { password, credentials } = addEmployeeCredentials(employeeData)

    return NextResponse.json(
      {
        success: true,
        message: 'Login credentials created successfully',
        password,
        credentials: {
          id: credentials.id,
          name: credentials.name,
          email: credentials.email,
          employee_id: credentials.employee_id,
          role: credentials.role,
          created_at: credentials.created_at,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating credentials:', error)
    return NextResponse.json(
      { error: 'Failed to create login credentials' },
      { status: 500 }
    )
  }
}

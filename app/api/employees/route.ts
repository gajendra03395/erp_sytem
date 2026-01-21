import { NextRequest, NextResponse } from 'next/server'

// Mock employees data for development
const mockEmployees = [
  {
    id: '1',
    employeeId: 'EMP001',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@company.com',
    phone: '+1234567890',
    department: 'PRODUCTION',
    position: 'Production Manager',
    hireDate: '2023-01-15',
    salary: 75000,
    status: 'ACTIVE',
    createdAt: '2023-01-15T00:00:00.000Z',
    updatedAt: '2023-01-15T00:00:00.000Z',
    user: {
      email: 'john.doe@company.com',
      role: 'SUPERVISOR'
    }
  },
  {
    id: '2',
    employeeId: 'EMP002',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@company.com',
    phone: '+1234567891',
    department: 'HR',
    position: 'HR Manager',
    hireDate: '2023-02-01',
    salary: 65000,
    status: 'ACTIVE',
    createdAt: '2023-02-01T00:00:00.000Z',
    updatedAt: '2023-02-01T00:00:00.000Z',
    user: {
      email: 'jane.smith@company.com',
      role: 'ADMIN'
    }
  },
  {
    id: '3',
    employeeId: 'EMP003',
    firstName: 'Mike',
    lastName: 'Wilson',
    email: 'mike.wilson@company.com',
    phone: '+1234567892',
    department: 'QUALITY',
    position: 'Quality Inspector',
    hireDate: '2023-03-01',
    salary: 45000,
    status: 'ACTIVE',
    createdAt: '2023-03-01T00:00:00.000Z',
    updatedAt: '2023-03-01T00:00:00.000Z',
    user: {
      email: 'mike.wilson@company.com',
      role: 'OPERATOR'
    }
  }
]

// GET all employees
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: mockEmployees,
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
    
    const newEmployee = {
      id: Date.now().toString(),
      employeeId: `EMP${String(mockEmployees.length + 1).padStart(3, '0')}`,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      user: {
        email: body.email,
        role: 'OPERATOR'
      }
    }
    
    mockEmployees.push(newEmployee)
    
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

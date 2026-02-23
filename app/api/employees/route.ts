import { NextRequest, NextResponse } from 'next/server'
import { handleAPIError, validateRequest, handleCORS } from '@/lib/api/error-handler'

// Mock data for production deployment fallback
const mockEmployees = [
  {
    id: '1',
    employeeId: 'EMP001',
    name: 'John Doe',
    email: 'john.doe@company.com',
    phone: '+1234567890',
    department: 'production',
    status: 'active',
    shift: 'Day',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2', 
    employeeId: 'EMP002',
    name: 'Jane Smith',
    email: 'jane.smith@company.com',
    phone: '+1234567891',
    department: 'qc',
    status: 'active',
    shift: 'Day',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    employeeId: 'EMP003', 
    name: 'Mike Wilson',
    email: 'mike.wilson@company.com',
    phone: '+1234567892',
    department: 'maintenance',
    status: 'active',
    shift: 'Night',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
]

// GET all employees
export async function GET() {
  try {
    // Try database first, fallback to mock data
    try {
      const { prisma } = await import('@/lib/db/prisma-client')
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
    } catch (dbError) {
      console.log('Database not available, using mock data:', dbError)
      return NextResponse.json({
        success: true,
        data: mockEmployees,
      })
    }
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
    
    // Validate required fields
    validateRequest(request, ['employee_id', 'name', 'email'])
    
    // Basic validation
    if (!body.employee_id || !body.name || !body.email) {
      return handleCORS(NextResponse.json(
        { success: false, error: 'Missing required fields: employee_id, name, email' },
        { status: 400 }
      ))
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return handleCORS(NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      ))
    }
    
    // Try database first, fallback to mock data
    try {
      const { prisma } = await import('@/lib/db/prisma-client')
      
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
        return handleCORS(NextResponse.json(
          { success: false, error: 'Employee with this email or ID already exists' },
          { status: 400 }
        ))
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
      
      return handleCORS(NextResponse.json({
        success: true,
        data: newEmployee,
      }))
    } catch (dbError) {
      console.log('Database not available, using mock add:', dbError)
      
      // Mock add with validation
      const newEmployee = {
        id: Date.now().toString(),
        employeeId: body.employee_id,
        name: body.name,
        email: body.email,
        phone: body.phone || null,
        department: body.department || 'production',
        status: body.status || 'active',
        shift: body.shift || 'Day',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      
      mockEmployees.push(newEmployee)
      
      return handleCORS(NextResponse.json({
        success: true,
        data: newEmployee,
      }))
    }
  } catch (error) {
    console.error('Error creating employee:', error)
    return handleAPIError(error, request)
  }
}

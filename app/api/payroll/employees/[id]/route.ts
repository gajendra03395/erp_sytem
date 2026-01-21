import { NextRequest, NextResponse } from 'next/server'
import { updateEmployee, deleteEmployee, readEmployees } from '@/lib/utils/payroll-storage'
import { hasPermission } from '@/lib/auth/permissions'
import { getAuthUser } from '@/lib/auth/server-auth'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser(request)
    if (!user || !hasPermission(user.role, 'view_inventory')) {
      return NextResponse.json({ error: user ? 'Forbidden' : 'Unauthorized' }, { status: user ? 403 : 401 })
    }

    const employees = await readEmployees()
    const employee = employees.find(e => e.id === params.id)
    return employee ? NextResponse.json(employee) : NextResponse.json({ error: 'Employee not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch employee' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser(request)
    if (!user || !hasPermission(user.role, 'edit_inventory')) {
      return NextResponse.json({ error: user ? 'Forbidden' : 'Unauthorized' }, { status: user ? 403 : 401 })
    }

    const body = await request.json()
    const employee = await updateEmployee(params.id, body)
    return employee ? NextResponse.json(employee) : NextResponse.json({ error: 'Employee not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update employee' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser(request)
    if (!user || !hasPermission(user.role, 'delete_inventory')) {
      return NextResponse.json({ error: user ? 'Forbidden' : 'Unauthorized' }, { status: user ? 403 : 401 })
    }

    const success = await deleteEmployee(params.id)
    return success ? NextResponse.json({ message: 'Employee deleted' }) : NextResponse.json({ error: 'Employee not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete employee' }, { status: 500 })
  }
}

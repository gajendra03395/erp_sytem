import { NextRequest, NextResponse } from 'next/server'
import { updatePayroll, deletePayroll, readPayrolls } from '@/lib/utils/payroll-storage'
import { hasPermission } from '@/lib/auth/permissions'
import { getAuthUser } from '@/lib/auth/server-auth'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser(request)
    if (!user || !hasPermission(user.role, 'view_inventory')) {
      return NextResponse.json({ error: user ? 'Forbidden' : 'Unauthorized' }, { status: user ? 403 : 401 })
    }

    const payrolls = await readPayrolls()
    const payroll = payrolls.find(p => p.id === params.id)
    return payroll ? NextResponse.json(payroll) : NextResponse.json({ error: 'Payroll not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch payroll' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser(request)
    if (!user || !hasPermission(user.role, 'edit_inventory')) {
      return NextResponse.json({ error: user ? 'Forbidden' : 'Unauthorized' }, { status: user ? 403 : 401 })
    }

    const body = await request.json()
    const payroll = await updatePayroll(params.id, body)
    return payroll ? NextResponse.json(payroll) : NextResponse.json({ error: 'Payroll not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update payroll' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser(request)
    if (!user || !hasPermission(user.role, 'delete_inventory')) {
      return NextResponse.json({ error: user ? 'Forbidden' : 'Unauthorized' }, { status: user ? 403 : 401 })
    }

    const success = await deletePayroll(params.id)
    return success ? NextResponse.json({ message: 'Payroll deleted' }) : NextResponse.json({ error: 'Payroll not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete payroll' }, { status: 500 })
  }
}

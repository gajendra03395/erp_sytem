import { NextRequest, NextResponse } from 'next/server'
import { createPayroll, readPayrolls } from '@/lib/utils/payroll-storage'
import { hasPermission } from '@/lib/auth/permissions'
import { getAuthUser } from '@/lib/auth/server-auth'

export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!hasPermission(user.role, 'view_inventory')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const payrolls = await readPayrolls()
    return NextResponse.json(payrolls)
  } catch (error) {
    console.error('Failed to fetch payrolls:', error)
    return NextResponse.json({ error: 'Failed to fetch payrolls' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getAuthUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!hasPermission(user.role, 'edit_inventory')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const payroll = await createPayroll(body)
    return NextResponse.json(payroll, { status: 201 })
  } catch (error) {
    console.error('Failed to create payroll:', error)
    return NextResponse.json({ error: 'Failed to create payroll' }, { status: 500 })
  }
}

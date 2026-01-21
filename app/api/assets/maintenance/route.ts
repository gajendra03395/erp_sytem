import { NextRequest, NextResponse } from 'next/server'
import { createMaintenanceRecord, readMaintenanceRecords } from '@/lib/utils/assets-storage'
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

    const records = await readMaintenanceRecords()
    return NextResponse.json(records)
  } catch (error) {
    console.error('Failed to fetch maintenance records:', error)
    return NextResponse.json({ error: 'Failed to fetch maintenance records' }, { status: 500 })
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
    const record = await createMaintenanceRecord(body)
    return NextResponse.json(record, { status: 201 })
  } catch (error) {
    console.error('Failed to create maintenance record:', error)
    return NextResponse.json({ error: 'Failed to create maintenance record' }, { status: 500 })
  }
}

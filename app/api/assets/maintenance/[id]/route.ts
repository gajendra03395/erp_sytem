import { NextRequest, NextResponse } from 'next/server'
import { updateMaintenanceRecord, deleteMaintenanceRecord, readMaintenanceRecords } from '@/lib/utils/assets-storage'
import { hasPermission } from '@/lib/auth/permissions'
import { getAuthUser } from '@/lib/auth/server-auth'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser(request)
    if (!user || !hasPermission(user.role, 'view_inventory')) {
      return NextResponse.json({ error: user ? 'Forbidden' : 'Unauthorized' }, { status: user ? 403 : 401 })
    }

    const records = await readMaintenanceRecords()
    const record = records.find(r => r.id === params.id)
    return record ? NextResponse.json(record) : NextResponse.json({ error: 'Maintenance record not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch maintenance record' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser(request)
    if (!user || !hasPermission(user.role, 'edit_inventory')) {
      return NextResponse.json({ error: user ? 'Forbidden' : 'Unauthorized' }, { status: user ? 403 : 401 })
    }

    const body = await request.json()
    const record = await updateMaintenanceRecord(params.id, body)
    return record ? NextResponse.json(record) : NextResponse.json({ error: 'Maintenance record not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update maintenance record' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser(request)
    if (!user || !hasPermission(user.role, 'delete_inventory')) {
      return NextResponse.json({ error: user ? 'Forbidden' : 'Unauthorized' }, { status: user ? 403 : 401 })
    }

    const success = await deleteMaintenanceRecord(params.id)
    return success ? NextResponse.json({ message: 'Maintenance record deleted' }) : NextResponse.json({ error: 'Maintenance record not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete maintenance record' }, { status: 500 })
  }
}

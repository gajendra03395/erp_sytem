import { NextRequest, NextResponse } from 'next/server'
import {
  deleteStoredAttendance,
  getStoredAttendanceById,
  updateStoredAttendance,
} from '@/lib/utils/attendance-storage'
import { getAuthUser } from '@/lib/auth/server-auth'
import type { AttendanceStatus } from '@/types/attendance'

const canManageAttendance = (role: string) => role === 'ADMIN' || role === 'SUPERVISOR'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const record = getStoredAttendanceById(params.id)
    if (!record) {
      return NextResponse.json({ error: 'Attendance record not found' }, { status: 404 })
    }

    if (!canManageAttendance(user.role) && record.employee_id !== user.employee_id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json({ success: true, data: record })
  } catch (error) {
    console.error('Error fetching attendance record:', error)
    return NextResponse.json({ error: 'Failed to fetch attendance record' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!canManageAttendance(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const payload = await request.json()
    const updates: { status?: AttendanceStatus; date?: string } = {
      status: payload.status,
      date: payload.date,
    }

    const updated = updateStoredAttendance(params.id, {
      status: updates.status,
      date: updates.date ? new Date(updates.date) : undefined,
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error('Error updating attendance record:', error)
    const message = error instanceof Error ? error.message : 'Failed to update attendance'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!canManageAttendance(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    deleteStoredAttendance(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting attendance record:', error)
    const message = error instanceof Error ? error.message : 'Failed to delete attendance'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

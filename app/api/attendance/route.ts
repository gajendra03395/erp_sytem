import { NextRequest, NextResponse } from 'next/server'
import { addStoredAttendance, getStoredAttendance } from '@/lib/utils/attendance-storage'
import { getAuthUser } from '@/lib/auth/server-auth'
import type { AttendanceStatus } from '@/types/attendance'

const canManageAttendance = (role: string) => role === 'ADMIN' || role === 'SUPERVISOR'

export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const records = getStoredAttendance()
    const filteredRecords = canManageAttendance(user.role)
      ? records
      : records.filter((record) => record.employee_id === user.employee_id)

    return NextResponse.json({ success: true, data: filteredRecords })
  } catch (error) {
    console.error('Error fetching attendance:', error)
    return NextResponse.json({ error: 'Failed to fetch attendance' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getAuthUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!canManageAttendance(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const payload = await request.json()
    const { employee_id, date, status } = payload as {
      employee_id?: string
      date?: string
      status?: AttendanceStatus
    }

    if (!employee_id || !date || !status) {
      return NextResponse.json({ error: 'Missing attendance fields' }, { status: 400 })
    }

    const newRecord = addStoredAttendance({
      employee_id,
      date: new Date(date),
      status,
    })

    return NextResponse.json({ success: true, data: newRecord }, { status: 201 })
  } catch (error) {
    console.error('Error adding attendance:', error)
    const message = error instanceof Error ? error.message : 'Failed to add attendance'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

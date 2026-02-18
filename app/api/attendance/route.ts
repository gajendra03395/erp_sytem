import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma-client'
import { getAuthUser } from '@/lib/auth/server-auth'
import type { AttendanceStatus } from '@/types/attendance'

const canManageAttendance = (role: string) => role === 'ADMIN' || role === 'SUPERVISOR'

export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all attendance records with employee info
    const records = await prisma.$queryRaw`
      SELECT 
        a.id,
        a.employee_id,
        a.date,
        a.status,
        e.name as employee_name,
        e.email as employee_email
      FROM attendance a
      LEFT JOIN employees e ON a.employee_id = e.employee_id
      ORDER BY a.date DESC
    `

    const filteredRecords = canManageAttendance(user.role)
      ? records as any[]
      : (records as any[]).filter((record: any) => record.employee_id === user.employee_id)

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

    // Check if employee exists
    const employee = await prisma.employee.findUnique({
      where: { employeeId: employee_id }
    })

    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 })
    }

    // Create attendance record
    const newRecord = await prisma.$queryRaw`
      INSERT INTO attendance (id, employee_id, date, status)
      VALUES (gen_random_uuid(), ${employee_id}, ${date}::date, ${status})
      RETURNING id, employee_id, date, status
    `

    return NextResponse.json({ success: true, data: newRecord }, { status: 201 })
  } catch (error) {
    console.error('Error adding attendance:', error)
    const message = error instanceof Error ? error.message : 'Failed to add attendance'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

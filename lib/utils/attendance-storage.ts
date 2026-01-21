import fs from 'fs'
import path from 'path'
import type { AttendanceRecord, CreateAttendanceRecord, UpdateAttendanceRecord } from '@/types/attendance'

const ATTENDANCE_FILE = path.join(process.cwd(), 'public', 'attendance.json')

const toDateKey = (date: Date) => date.toISOString().slice(0, 10)

const normalizeDate = (value: Date | string) => {
  const date = typeof value === 'string' ? new Date(value) : value
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
}

export function getStoredAttendance(): AttendanceRecord[] {
  try {
    if (fs.existsSync(ATTENDANCE_FILE)) {
      const data = fs.readFileSync(ATTENDANCE_FILE, 'utf-8')
      const records = JSON.parse(data)
      return records.map((record: any) => ({
        ...record,
        date: new Date(record.date),
        created_at: new Date(record.created_at),
        updated_at: new Date(record.updated_at),
      }))
    }
  } catch (err) {
    console.error('Error reading attendance:', err)
  }
  return []
}

export function saveAttendance(records: AttendanceRecord[]): void {
  try {
    const publicDir = path.dirname(ATTENDANCE_FILE)
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true })
    }

    fs.writeFileSync(ATTENDANCE_FILE, JSON.stringify(records, null, 2))
  } catch (err) {
    console.error('Error saving attendance:', err)
    throw new Error('Failed to save attendance')
  }
}

export function addStoredAttendance(recordData: CreateAttendanceRecord): AttendanceRecord {
  const records = getStoredAttendance()
  const normalizedDate = normalizeDate(recordData.date)

  const exists = records.some(
    (record) => record.employee_id === recordData.employee_id && toDateKey(record.date) === toDateKey(normalizedDate)
  )
  if (exists) {
    throw new Error('Attendance for this employee and date already exists')
  }

  const newRecord: AttendanceRecord = {
    id: Date.now().toString(),
    ...recordData,
    date: normalizedDate,
    created_at: new Date(),
    updated_at: new Date(),
  }

  const updatedRecords = [...records, newRecord]
  saveAttendance(updatedRecords)
  return newRecord
}

export function updateStoredAttendance(id: string, updates: UpdateAttendanceRecord): AttendanceRecord {
  const records = getStoredAttendance()
  const recordIndex = records.findIndex((record) => record.id === id)

  if (recordIndex === -1) {
    throw new Error('Attendance record not found')
  }

  const normalizedDate = updates.date ? normalizeDate(updates.date) : records[recordIndex].date

  if (updates.date) {
    const dateKey = toDateKey(normalizedDate)
    const duplicate = records.some(
      (record, index) =>
        index !== recordIndex &&
        record.employee_id === records[recordIndex].employee_id &&
        toDateKey(record.date) === dateKey
    )
    if (duplicate) {
      throw new Error('Attendance for this employee and date already exists')
    }
  }

  const updatedRecord: AttendanceRecord = {
    ...records[recordIndex],
    ...updates,
    date: normalizedDate,
    updated_at: new Date(),
  }

  records[recordIndex] = updatedRecord
  saveAttendance(records)
  return updatedRecord
}

export function deleteStoredAttendance(id: string): void {
  const records = getStoredAttendance()
  const updatedRecords = records.filter((record) => record.id !== id)

  if (records.length === updatedRecords.length) {
    throw new Error('Attendance record not found')
  }

  saveAttendance(updatedRecords)
}

export function getStoredAttendanceById(id: string): AttendanceRecord | null {
  const records = getStoredAttendance()
  return records.find((record) => record.id === id) || null
}

export function getStoredAttendanceByEmployee(employee_id: string): AttendanceRecord[] {
  return getStoredAttendance().filter((record) => record.employee_id === employee_id)
}

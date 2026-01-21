export type AttendanceStatus = 'present' | 'absent' | 'late'

export interface AttendanceRecord {
  id: string
  employee_id: string
  date: Date
  status: AttendanceStatus
  created_at: Date
  updated_at: Date
}

export interface CreateAttendanceRecord {
  employee_id: string
  date: Date
  status: AttendanceStatus
}

export interface UpdateAttendanceRecord {
  status?: AttendanceStatus
  date?: Date
}

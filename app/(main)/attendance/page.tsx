'use client'

import { useMemo, useState } from 'react'
import { CalendarCheck, Loader2, Save, AlertCircle, Plus, Download, ChevronLeft, ChevronRight, FileText } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'
import { useAuth } from '@/components/providers/AuthProvider'
import { useAttendance } from '@/lib/hooks/useAttendance'
import { useEmployees } from '@/lib/hooks/useEmployees'
import { canManageAttendance, canViewAttendance } from '@/lib/auth/permissions'
import { AttendancePieChart } from '@/components/attendance/AttendancePieChart'
import { BulkImportButton } from '@/components/ui/BulkImportButton'
import type { AttendanceStatus } from '@/types/attendance'

const statusOptions: AttendanceStatus[] = ['present', 'absent', 'late']

export default function AttendancePage() {
  const { theme } = useTheme()
  const { currentRole, employeeId } = useAuth()
  const { records, loading, error, addRecord, updateRecord, refetch } = useAttendance()
  const { employees } = useEmployees()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingStatus, setEditingStatus] = useState<AttendanceStatus>('present')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    employee_id: '',
    date: new Date().toISOString().slice(0, 10),
    status: 'present' as AttendanceStatus,
  })
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const today = new Date()
    return new Date(today.getFullYear(), today.getMonth(), 1)
  })
  const [calendarEmployee, setCalendarEmployee] = useState(employeeId || '')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<AttendanceStatus | 'all'>('all')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  const canManage = currentRole ? canManageAttendance(currentRole) : false
  const canView = currentRole ? canViewAttendance(currentRole) : false

  const displayRecords = useMemo(() => {
    if (!records.length) return []
    return [...records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [records])

  const employeeLookup = useMemo(() => {
    return new Map(employees.map((employee) => [employee.employee_id, employee.name]))
  }, [employees])

  const tableRecords = useMemo(() => {
    return displayRecords.filter((record) => {
      if (statusFilter !== 'all' && record.status !== statusFilter) return false
      if (fromDate && new Date(record.date) < new Date(fromDate)) return false
      if (toDate && new Date(record.date) > new Date(toDate)) return false
      if (!searchQuery) return true

      const name = employeeLookup.get(record.employee_id) || ''
      const searchTarget = `${record.employee_id} ${name}`.toLowerCase()
      return searchTarget.includes(searchQuery.toLowerCase())
    })
  }, [displayRecords, statusFilter, fromDate, toDate, searchQuery, employeeLookup])

  const calendarRecords = useMemo(() => {
    if (!calendarEmployee) return []
    return displayRecords.filter((record) => record.employee_id === calendarEmployee)
  }, [calendarEmployee, displayRecords])

  const calendarDays = useMemo(() => {
    const year = calendarMonth.getFullYear()
    const month = calendarMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const startDay = firstDay.getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const totalCells = Math.ceil((startDay + daysInMonth) / 7) * 7
    const cells = Array.from({ length: totalCells }, (_, index) => {
      const date = new Date(year, month, index - startDay + 1)
      const isCurrentMonth = date.getMonth() === month
      return { date, isCurrentMonth }
    })
    return cells
  }, [calendarMonth])

  const attendanceByDate = useMemo(() => {
    const map = new Map<string, AttendanceStatus>()
    calendarRecords.forEach((record) => {
      const key = new Date(record.date).toISOString().slice(0, 10)
      map.set(key, record.status)
    })
    return map
  }, [calendarRecords])

  const handleStartEdit = (recordId: string, currentStatus: AttendanceStatus) => {
    setEditingId(recordId)
    setEditingStatus(currentStatus)
  }

  const handleSave = async (recordId: string) => {
    await updateRecord(recordId, { status: editingStatus })
    setEditingId(null)
  }

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!formData.employee_id) return

    await addRecord({
      employee_id: formData.employee_id,
      date: new Date(formData.date),
      status: formData.status,
    })

    setShowForm(false)
    setFormData({
      employee_id: '',
      date: new Date().toISOString().slice(0, 10),
      status: 'present',
    })
  }

  const emptyState = !loading && tableRecords.length === 0

  const handleExport = () => {
    const rows = tableRecords.map((record) => {
      const name = employeeLookup.get(record.employee_id) || record.employee_id
      const date = new Date(record.date).toISOString().slice(0, 10)
      return [record.employee_id, name, date, record.status]
    })
    const header = ['employee_id', 'employee_name', 'date', 'status']
    const csvContent = [header, ...rows].map((row) => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'attendance-export.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleExportPdf = () => {
    const employeeName = employeeLookup.get(calendarEmployee) || calendarEmployee || 'All Employees'
    const monthLabel = calendarMonth.toLocaleString('default', { month: 'long', year: 'numeric' })
    const calendarHtml = calendarDays
      .map(({ date, isCurrentMonth }) => {
        const key = date.toISOString().slice(0, 10)
        const status = attendanceByDate.get(key)
        const statusLabel = status ? status.toUpperCase() : ''
        const mutedClass = isCurrentMonth ? '' : 'muted'
        return `<div class="cell ${mutedClass} ${status || ''}"><span>${date.getDate()}</span><small>${statusLabel}</small></div>`
      })
      .join('')

    const html = `
      <html>
        <head>
          <title>Attendance Calendar</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; }
            h1 { margin-bottom: 4px; }
            p { margin-top: 0; color: #555; }
            .grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; margin-top: 16px; }
            .cell { border: 1px solid #ddd; border-radius: 8px; min-height: 64px; text-align: center; padding: 8px; font-size: 12px; }
            .cell small { display: block; margin-top: 4px; font-weight: bold; }
            .present { background: #e9f8ee; color: #166534; }
            .absent { background: #fdecec; color: #991b1b; }
            .late { background: #fff4e5; color: #92400e; }
            .muted { color: #9ca3af; }
            .legend { margin-top: 16px; display: flex; gap: 12px; font-size: 12px; }
          </style>
        </head>
        <body>
          <h1>Attendance Calendar</h1>
          <p>${employeeName} • ${monthLabel}</p>
          <div class="legend">
            <span>Present</span>
            <span>Absent</span>
            <span>Late</span>
          </div>
          <div class="grid">${calendarHtml}</div>
        </body>
      </html>
    `

    const printWindow = window.open('', '_blank')
    if (!printWindow) return
    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
    printWindow.close()
  }

  if (!canView) {
    return (
      <div
        className={`
          min-h-screen p-6 lg:p-8 flex items-center justify-center
          ${theme === 'dark' ? 'bg-industrial-dark-bg' : 'bg-industrial-light-bg'}
        `}
      >
        <div
          className={`
            p-6 rounded-lg
            ${theme === 'dark'
              ? 'bg-red-900/20 border border-red-800/40'
              : 'bg-red-100 border border-red-300'
            }
          `}
        >
          <p className={theme === 'dark' ? 'text-red-400' : 'text-red-800'}>
            You do not have access to attendance records.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`
        min-h-screen p-6 lg:p-8
        ${theme === 'dark' ? 'bg-industrial-dark-bg' : 'bg-industrial-light-bg'}
      `}
    >
      <div className="mb-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1
              className={`
                text-3xl font-bold flex items-center gap-3
                ${theme === 'dark' ? 'text-industrial-dark-text' : 'text-industrial-light-text'}
              `}
            >
              <CalendarCheck size={28} />
              Attendance Management
            </h1>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Track daily presence, absenteeism, and late arrivals.
            </p>
          </div>
          {canManage && (
            <div className="flex flex-wrap items-center gap-3">
              <BulkImportButton
                module="attendance"
                onComplete={refetch}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors
                  ${theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                  }
                `}
              />
              <button
                onClick={handleExportPdf}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors
                  ${theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                  }
                `}
              >
                <FileText size={18} />
                Export PDF
              </button>
              <button
                onClick={handleExport}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors
                  ${theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                  }
                `}
              >
                <Download size={18} />
                Export CSV
              </button>
              <button
                onClick={() => setShowForm((prev) => !prev)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors
                  ${theme === 'dark'
                    ? 'bg-industrial-dark-accent hover:bg-industrial-dark-accent-hover text-white'
                    : 'bg-industrial-light-accent hover:bg-industrial-light-accent-hover text-white'
                  }
                `}
              >
                <Plus size={18} />
                {showForm ? 'Close' : 'Mark Attendance'}
              </button>
            </div>
          )}
        </div>
      </div>

      {showForm && canManage && (
        <form
          onSubmit={handleCreate}
          className={`
            mb-8 rounded-lg border p-6
            ${theme === 'dark'
              ? 'bg-industrial-dark-surface border-industrial-dark-border'
              : 'bg-industrial-light-surface border-industrial-light-border'
            }
          `}
        >
          <h2
            className={`
              text-lg font-semibold mb-4
              ${theme === 'dark' ? 'text-industrial-dark-text' : 'text-industrial-light-text'}
            `}
          >
            Add Attendance Entry
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className={theme === 'dark' ? 'text-gray-300 text-sm' : 'text-gray-700 text-sm'}>
                Employee
              </label>
              <select
                value={formData.employee_id}
                onChange={(event) => setFormData({ ...formData, employee_id: event.target.value })}
                className={`
                  mt-2 w-full rounded-lg border px-3 py-2 text-sm
                  ${theme === 'dark'
                    ? 'bg-industrial-dark-bg border-industrial-dark-border text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                  }
                `}
                required
              >
                <option value="">Select employee</option>
                {employees.map((employee) => (
                  <option key={employee.employee_id} value={employee.employee_id}>
                    {employee.name} ({employee.employee_id})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={theme === 'dark' ? 'text-gray-300 text-sm' : 'text-gray-700 text-sm'}>
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(event) => setFormData({ ...formData, date: event.target.value })}
                className={`
                  mt-2 w-full rounded-lg border px-3 py-2 text-sm
                  ${theme === 'dark'
                    ? 'bg-industrial-dark-bg border-industrial-dark-border text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                  }
                `}
                required
              />
            </div>
            <div>
              <label className={theme === 'dark' ? 'text-gray-300 text-sm' : 'text-gray-700 text-sm'}>
                Status
              </label>
              <select
                value={formData.status}
                onChange={(event) => setFormData({ ...formData, status: event.target.value as AttendanceStatus })}
                className={`
                  mt-2 w-full rounded-lg border px-3 py-2 text-sm
                  ${theme === 'dark'
                    ? 'bg-industrial-dark-bg border-industrial-dark-border text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                  }
                `}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              className={`
                px-4 py-2 rounded-lg font-medium transition-colors
                ${theme === 'dark'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
                }
              `}
            >
              Save Entry
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        {!canManage && employeeId && (
          <AttendancePieChart records={displayRecords} />
        )}
        <div
          className={`
            ${canManage ? 'lg:col-span-3' : 'lg:col-span-2'} rounded-lg border p-6
            ${theme === 'dark'
              ? 'bg-industrial-dark-surface border-industrial-dark-border'
              : 'bg-industrial-light-surface border-industrial-light-border'
            }
          `}
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className={theme === 'dark' ? 'text-lg font-semibold text-white' : 'text-lg font-semibold text-gray-900'}>
                Monthly Attendance Calendar
              </h3>
              <p className={theme === 'dark' ? 'text-sm text-gray-400' : 'text-sm text-gray-600'}>
                {calendarMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {canManage && (
                <select
                  value={calendarEmployee}
                  onChange={(event) => setCalendarEmployee(event.target.value)}
                  className={`
                    rounded-lg border px-3 py-2 text-sm
                    ${theme === 'dark'
                      ? 'bg-industrial-dark-bg border-industrial-dark-border text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                    }
                  `}
                >
                  <option value="">Select employee</option>
                  {employees.map((employee) => (
                    <option key={employee.employee_id} value={employee.employee_id}>
                      {employee.name} ({employee.employee_id})
                    </option>
                  ))}
                </select>
              )}
              <button
                onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}
                className={theme === 'dark'
                  ? 'p-2 rounded-lg border border-industrial-dark-border text-gray-300 hover:text-white'
                  : 'p-2 rounded-lg border border-gray-300 text-gray-600 hover:text-gray-900'}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}
                className={theme === 'dark'
                  ? 'p-2 rounded-lg border border-industrial-dark-border text-gray-300 hover:text-white'
                  : 'p-2 rounded-lg border border-gray-300 text-gray-600 hover:text-gray-900'}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-7 gap-2 text-xs">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                {day}
              </div>
            ))}
            {calendarDays.map(({ date, isCurrentMonth }, index) => {
              const key = date.toISOString().slice(0, 10)
              const status = attendanceByDate.get(key)
              const baseClasses = isCurrentMonth
                ? theme === 'dark'
                  ? 'text-gray-200'
                  : 'text-gray-900'
                : theme === 'dark'
                  ? 'text-gray-600'
                  : 'text-gray-400'
              const statusClasses = status === 'present'
                ? 'bg-green-500/20 text-green-600'
                : status === 'absent'
                  ? 'bg-red-500/20 text-red-600'
                  : status === 'late'
                    ? 'bg-amber-500/20 text-amber-600'
                    : theme === 'dark'
                      ? 'bg-industrial-dark-bg'
                      : 'bg-gray-100'

              return (
                <div
                  key={`${key}-${index}`}
                  className={`
                    h-14 rounded-lg border flex flex-col items-center justify-center text-sm
                    ${theme === 'dark' ? 'border-industrial-dark-border' : 'border-gray-200'}
                    ${statusClasses}
                    ${baseClasses}
                  `}
                >
                  <span>{date.getDate()}</span>
                  {status && (
                    <span className="text-[10px] font-semibold uppercase tracking-wide">
                      {status[0]}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div
        className={`
          rounded-lg border overflow-hidden
          ${theme === 'dark'
            ? 'bg-industrial-dark-surface border-industrial-dark-border'
            : 'bg-industrial-light-surface border-industrial-light-border'
          }
        `}
      >
        {loading ? (
          <div className="p-10 flex items-center justify-center text-gray-500">
            <Loader2 className="animate-spin" size={28} />
          </div>
        ) : error ? (
          <div className="p-6 flex items-start gap-3 text-red-500">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        ) : emptyState ? (
          <div className={theme === 'dark' ? 'p-8 text-gray-400 text-center' : 'p-8 text-gray-600 text-center'}>
            No attendance records found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap gap-3">
              <input
                type="text"
                placeholder="Search employee"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className={`
                  rounded-lg border px-3 py-2 text-sm
                  ${theme === 'dark'
                    ? 'bg-industrial-dark-bg border-industrial-dark-border text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                  }
                `}
              />
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as AttendanceStatus | 'all')}
                className={`
                  rounded-lg border px-3 py-2 text-sm
                  ${theme === 'dark'
                    ? 'bg-industrial-dark-bg border-industrial-dark-border text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                  }
                `}
              >
                <option value="all">All Status</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={fromDate}
                onChange={(event) => setFromDate(event.target.value)}
                className={`
                  rounded-lg border px-3 py-2 text-sm
                  ${theme === 'dark'
                    ? 'bg-industrial-dark-bg border-industrial-dark-border text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                  }
                `}
              />
              <input
                type="date"
                value={toDate}
                onChange={(event) => setToDate(event.target.value)}
                className={`
                  rounded-lg border px-3 py-2 text-sm
                  ${theme === 'dark'
                    ? 'bg-industrial-dark-bg border-industrial-dark-border text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                  }
                `}
              />
            </div>
            <table className="w-full">
              <thead
                className={theme === 'dark'
                  ? 'bg-industrial-dark-bg border-b border-industrial-dark-border'
                  : 'bg-gray-50 border-b border-industrial-light-border'}
              >
                <tr>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Employee
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Date
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Status
                  </th>
                  {canManage && (
                    <th className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className={theme === 'dark' ? 'divide-y divide-industrial-dark-border' : 'divide-y divide-industrial-light-border'}>
                {tableRecords.map((record) => {
                  const isEditing = editingId === record.id
                  const employeeName = employeeLookup.get(record.employee_id) || record.employee_id
                  const displayDate = new Date(record.date).toLocaleDateString()

                  return (
                    <tr
                      key={record.id}
                      className={theme === 'dark' ? 'hover:bg-industrial-dark-bg/50' : 'hover:bg-gray-50'}
                    >
                      <td className={`px-6 py-4 text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                        <div className="font-medium">{employeeName}</div>
                        <div className={theme === 'dark' ? 'text-xs text-gray-400' : 'text-xs text-gray-500'}>
                          {record.employee_id}
                        </div>
                      </td>
                      <td className={`px-6 py-4 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {displayDate}
                      </td>
                      <td className="px-6 py-4">
                        {isEditing && canManage ? (
                          <select
                            value={editingStatus}
                            onChange={(event) => setEditingStatus(event.target.value as AttendanceStatus)}
                            className={`rounded-lg border px-3 py-1 text-sm ${theme === 'dark'
                              ? 'bg-industrial-dark-bg border-industrial-dark-border text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                            }`}
                          >
                            {statusOptions.map((status) => (
                              <option key={status} value={status}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                              record.status === 'present'
                                ? theme === 'dark'
                                  ? 'bg-green-900/30 text-green-300'
                                  : 'bg-green-100 text-green-700'
                                : record.status === 'absent'
                                  ? theme === 'dark'
                                    ? 'bg-red-900/30 text-red-300'
                                    : 'bg-red-100 text-red-700'
                                  : theme === 'dark'
                                    ? 'bg-amber-900/30 text-amber-300'
                                    : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            {record.status.toUpperCase()}
                          </span>
                        )}
                      </td>
                      {canManage && (
                        <td className="px-6 py-4 text-right">
                          {isEditing ? (
                            <button
                              onClick={() => handleSave(record.id)}
                              className={theme === 'dark'
                                ? 'inline-flex items-center gap-2 text-green-400 hover:text-green-300'
                                : 'inline-flex items-center gap-2 text-green-600 hover:text-green-500'}
                            >
                              <Save size={16} />
                              Save
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStartEdit(record.id, record.status)}
                              className={theme === 'dark'
                                ? 'text-blue-400 hover:text-blue-300'
                                : 'text-blue-600 hover:text-blue-500'}
                            >
                              Edit
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

'use client'

import { useTheme } from '@/components/providers/ThemeProvider'
import type { AttendanceRecord } from '@/types/attendance'

interface AttendancePieChartProps {
  records: AttendanceRecord[]
}

export function AttendancePieChart({ records }: AttendancePieChartProps) {
  const { theme } = useTheme()

  const total = records.length
  const present = records.filter((record) => record.status === 'present').length
  const absent = records.filter((record) => record.status === 'absent').length
  const late = records.filter((record) => record.status === 'late').length

  const presentPercent = total ? Math.round((present / total) * 100) : 0
  const absentPercent = total ? Math.round((absent / total) * 100) : 0
  const latePercent = total ? Math.round((late / total) * 100) : 0

  const chartStyle = {
    background: `conic-gradient(#22c55e 0% ${presentPercent}%, #ef4444 ${presentPercent}% ${presentPercent + absentPercent}%, #f59e0b ${presentPercent + absentPercent}% 100%)`,
  }

  return (
    <div
      className={`
        rounded-lg border p-6
        ${theme === 'dark'
          ? 'bg-industrial-dark-surface border-industrial-dark-border'
          : 'bg-industrial-light-surface border-industrial-light-border'
        }
      `}
    >
      <div className="flex items-center justify-between mb-4">
        <h3
          className={`
            text-lg font-semibold
            ${theme === 'dark' ? 'text-industrial-dark-text' : 'text-industrial-light-text'}
          `}
        >
          Attendance Summary
        </h3>
        <span
          className={`
            text-2xl font-bold
            ${theme === 'dark' ? 'text-industrial-dark-accent' : 'text-industrial-light-accent'}
          `}
        >
          {presentPercent}%
        </span>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative">
          <div className="h-40 w-40 rounded-full" style={chartStyle} />
          <div
            className={
              `absolute inset-4 rounded-full flex flex-col items-center justify-center text-center ` +
              (theme === 'dark' ? 'bg-industrial-dark-surface' : 'bg-industrial-light-surface')
            }
          >
            <span className={theme === 'dark' ? 'text-gray-400 text-xs' : 'text-gray-600 text-xs'}>Total</span>
            <span
              className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
            >
              {total}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-green-500" />
              <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Present</span>
            </div>
            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>{present}</span>
          </div>
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500" />
              <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Absent</span>
            </div>
            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>{absent}</span>
          </div>
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-amber-500" />
              <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Late</span>
            </div>
            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>{late}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

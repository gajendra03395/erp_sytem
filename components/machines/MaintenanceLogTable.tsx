'use client'

import { Calendar, User, DollarSign, FileText } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'
import type { MaintenanceLog } from '@/types/machine'

interface MaintenanceLogTableProps {
  logs: MaintenanceLog[]
  machineName?: string
}

export function MaintenanceLogTable({ logs, machineName }: MaintenanceLogTableProps) {
  const { theme } = useTheme()

  const sortedLogs = [...logs].sort(
    (a, b) => new Date(b.service_date).getTime() - new Date(a.service_date).getTime()
  )

  if (sortedLogs.length === 0) {
    return (
      <div
        className={`
          rounded-lg border p-8 text-center
          ${theme === 'dark'
            ? 'bg-industrial-dark-surface border-industrial-dark-border'
            : 'bg-industrial-light-surface border-industrial-light-border'
          }
        `}
      >
        <p
          className={`
            ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
          `}
        >
          No maintenance records found.
        </p>
      </div>
    )
  }

  return (
    <div
      className={`
        rounded-lg border overflow-hidden
        ${theme === 'dark'
          ? 'bg-industrial-dark-surface border-industrial-dark-border'
          : 'bg-industrial-light-surface border-industrial-light-border'
        }
      `}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr
              className={`
                border-b
                ${theme === 'dark'
                  ? 'border-industrial-dark-border bg-industrial-dark-bg'
                  : 'border-industrial-light-border bg-gray-50'
                }
              `}
            >
              <th
                className={`
                  px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider
                  ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                `}
              >
                Service Date
              </th>
              {!machineName && (
                <th
                  className={`
                    px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider
                    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                  `}
                >
                  Machine
                </th>
              )}
              <th
                className={`
                  px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider
                  ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                `}
              >
                Service Type
              </th>
              <th
                className={`
                  px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider
                  ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                `}
              >
                Technician
              </th>
              <th
                className={`
                  px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider
                  ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                `}
              >
                Cost
              </th>
              <th
                className={`
                  px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider
                  ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                `}
              >
                Notes
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedLogs.map((log) => (
              <tr
                key={log.id}
                className={`
                  hover:opacity-90 transition-opacity
                  ${theme === 'dark' ? 'hover:bg-industrial-dark-bg' : 'hover:bg-gray-50'}
                `}
              >
                <td
                  className={`
                    px-6 py-4 whitespace-nowrap text-sm
                    ${theme === 'dark' ? 'text-industrial-dark-text' : 'text-industrial-light-text'}
                  `}
                >
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="opacity-50" />
                    {new Date(log.service_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                </td>
                {!machineName && (
                  <td
                    className={`
                      px-6 py-4 whitespace-nowrap text-sm font-medium
                      ${theme === 'dark' ? 'text-industrial-dark-text' : 'text-industrial-light-text'}
                    `}
                  >
                    {log.machine_name}
                  </td>
                )}
                <td
                  className={`
                    px-6 py-4 whitespace-nowrap text-sm
                    ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
                  `}
                >
                  <span
                    className={`
                      px-2 py-1 rounded text-xs font-medium
                      ${theme === 'dark'
                        ? 'bg-blue-900/30 text-blue-300'
                        : 'bg-blue-100 text-blue-800'
                      }
                    `}
                  >
                    {log.service_type}
                  </span>
                </td>
                <td
                  className={`
                    px-6 py-4 whitespace-nowrap text-sm
                    ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
                  `}
                >
                  {log.technician_name ? (
                    <div className="flex items-center gap-2">
                      <User size={16} className="opacity-50" />
                      {log.technician_name}
                    </div>
                  ) : (
                    <span className="opacity-50">N/A</span>
                  )}
                </td>
                <td
                  className={`
                    px-6 py-4 whitespace-nowrap text-sm
                    ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
                  `}
                >
                  {log.cost ? (
                    <div className="flex items-center gap-2">
                      <DollarSign size={16} className="opacity-50" />
                      ${log.cost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  ) : (
                    <span className="opacity-50">N/A</span>
                  )}
                </td>
                <td
                  className={`
                    px-6 py-4 text-sm max-w-xs truncate
                    ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
                  `}
                  title={log.notes || ''}
                >
                  {log.notes ? (
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="opacity-50 flex-shrink-0" />
                      <span className="truncate">{log.notes}</span>
                    </div>
                  ) : (
                    <span className="opacity-50">No notes</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

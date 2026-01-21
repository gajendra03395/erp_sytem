'use client'

import { AlertTriangle, Package, Wrench, ClipboardX, UserX } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'
import { useInventory } from '@/lib/hooks/useInventory'
import { useMachines } from '@/lib/hooks/useMachines'
import { useQC } from '@/lib/hooks/useQC'
import { useAttendance } from '@/lib/hooks/useAttendance'
import { useEmployees } from '@/lib/hooks/useEmployees'

interface AlertItem {
  id: string
  title: string
  description: string
  icon: React.ElementType
  tone: 'warning' | 'danger' | 'info'
}

export function NotificationsPanel() {
  const { theme } = useTheme()
  const { items: inventory } = useInventory()
  const { machines } = useMachines()
  const { records: qcRecords } = useQC()
  const { records: attendance } = useAttendance()
  const { employees } = useEmployees()

  const employeeLookup = new Map(employees.map((employee) => [employee.employee_id, employee.name]))
  const todayKey = new Date().toISOString().slice(0, 10)

  const lowStock = inventory.filter((item) => item.stock_level <= item.reorder_point).slice(0, 4)
  const maintenance = machines.filter((machine) => machine.status === 'under_maintenance').slice(0, 4)
  const failedQc = qcRecords.filter((record) => record.result === 'fail').slice(0, 4)
  const absences = attendance.filter((record) => record.status === 'absent' && new Date(record.date).toISOString().slice(0, 10) === todayKey)

  const alerts: AlertItem[] = [
    ...lowStock.map((item) => ({
      id: `stock-${item.id}`,
      title: 'Low Stock',
      description: `${item.item_name} is below reorder point (${item.stock_level}).`,
      icon: Package,
      tone: 'warning' as const,
    })),
    ...maintenance.map((machine) => ({
      id: `maint-${machine.id}`,
      title: 'Maintenance',
      description: `${machine.machine_name} is under maintenance.`,
      icon: Wrench,
      tone: 'info' as const,
    })),
    ...failedQc.map((record) => ({
      id: `qc-${record.id}`,
      title: 'QC Failure',
      description: `${record.product_name} failed inspection (${record.batch_no}).`,
      icon: ClipboardX,
      tone: 'danger' as const,
    })),
    ...absences.map((record) => ({
      id: `abs-${record.id}`,
      title: 'Absent Today',
      description: `${employeeLookup.get(record.employee_id) || record.employee_id} marked absent.`,
      icon: UserX,
      tone: 'warning' as const,
    })),
  ]

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
        <h2
          className={`
            text-xl font-semibold
            ${theme === 'dark' ? 'text-industrial-dark-text' : 'text-industrial-light-text'}
          `}
        >
          Notifications
        </h2>
        <div className={theme === 'dark' ? 'text-sm text-gray-400' : 'text-sm text-gray-600'}>
          {alerts.length} active
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className={theme === 'dark' ? 'text-gray-400 text-sm' : 'text-gray-600 text-sm'}>
          All clear. No critical alerts right now.
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => {
            const Icon = alert.icon
            const toneClasses = alert.tone === 'danger'
              ? theme === 'dark'
                ? 'bg-red-900/30 text-red-300'
                : 'bg-red-100 text-red-700'
              : alert.tone === 'warning'
                ? theme === 'dark'
                  ? 'bg-amber-900/30 text-amber-300'
                  : 'bg-amber-100 text-amber-700'
                : theme === 'dark'
                  ? 'bg-blue-900/30 text-blue-300'
                  : 'bg-blue-100 text-blue-700'

            return (
              <div
                key={alert.id}
                className={`
                  flex items-start gap-3 rounded-lg border px-4 py-3
                  ${theme === 'dark'
                    ? 'border-industrial-dark-border bg-industrial-dark-bg'
                    : 'border-gray-200 bg-white'
                  }
                `}
              >
                <div className={`p-2 rounded-lg ${toneClasses}`}>
                  <Icon size={16} />
                </div>
                <div>
                  <p className={theme === 'dark' ? 'text-sm font-medium text-gray-200' : 'text-sm font-medium text-gray-800'}>
                    {alert.title}
                  </p>
                  <p className={theme === 'dark' ? 'text-xs text-gray-400' : 'text-xs text-gray-600'}>
                    {alert.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

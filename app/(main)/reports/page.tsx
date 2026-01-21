'use client'

import { Download, BarChart3, Package, Users, Cpu, ClipboardCheck, CalendarCheck } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'
import { useInventory } from '@/lib/hooks/useInventory'
import { useEmployees } from '@/lib/hooks/useEmployees'
import { useMachines } from '@/lib/hooks/useMachines'
import { useQC } from '@/lib/hooks/useQC'
import { useAttendance } from '@/lib/hooks/useAttendance'

interface ReportCardProps {
  title: string
  value: string
  icon: React.ElementType
  subtitle: string
  onExport?: () => void
}

function ReportCard({ title, value, icon: Icon, subtitle, onExport }: ReportCardProps) {
  const { theme } = useTheme()

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
      <div className="flex items-start justify-between">
        <div>
          <p className={theme === 'dark' ? 'text-sm text-gray-400' : 'text-sm text-gray-600'}>{subtitle}</p>
          <h3 className={theme === 'dark' ? 'text-lg font-semibold text-white' : 'text-lg font-semibold text-gray-900'}>
            {title}
          </h3>
          <div className={theme === 'dark' ? 'text-3xl font-bold text-industrial-dark-text' : 'text-3xl font-bold text-industrial-light-text'}>
            {value}
          </div>
        </div>
        <div className={theme === 'dark' ? 'p-3 rounded-lg bg-industrial-dark-accent/20 text-industrial-dark-accent' : 'p-3 rounded-lg bg-industrial-light-accent/20 text-industrial-light-accent'}>
          <Icon size={24} />
        </div>
      </div>
      {onExport && (
        <button
          onClick={onExport}
          className={`
            mt-4 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium
            ${theme === 'dark'
              ? 'bg-gray-700 text-gray-100 hover:bg-gray-600'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }
          `}
        >
          <Download size={16} />
          Export CSV
        </button>
      )}
    </div>
  )
}

export default function ReportsPage() {
  const { theme } = useTheme()
  const { items: inventory } = useInventory()
  const { employees } = useEmployees()
  const { machines } = useMachines()
  const { records: qcRecords } = useQC()
  const { records: attendance } = useAttendance()

  const exportCsv = (filename: string, rows: string[][]) => {
    const csvContent = rows.map((row) => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
  }

  const exportInventory = () => {
    const rows = [
      ['item_name', 'category', 'stock_level', 'unit', 'reorder_point'],
      ...inventory.map((item) => [item.item_name, item.category, String(item.stock_level), item.unit, String(item.reorder_point)]),
    ]
    exportCsv('inventory-report.csv', rows)
  }

  const exportEmployees = () => {
    const rows = [
      ['employee_id', 'name', 'email', 'department', 'role', 'status'],
      ...employees.map((employee) => [employee.employee_id, employee.name, employee.email, employee.department, employee.role, employee.status]),
    ]
    exportCsv('employees-report.csv', rows)
  }

  const exportMachines = () => {
    const rows = [
      ['machine_name', 'machine_type', 'status', 'last_service_date', 'location'],
      ...machines.map((machine) => [
        machine.machine_name,
        machine.machine_type,
        machine.status,
        new Date(machine.last_service_date).toISOString().slice(0, 10),
        machine.location || '',
      ]),
    ]
    exportCsv('machines-report.csv', rows)
  }

  const exportQc = () => {
    const rows = [
      ['batch_no', 'product_name', 'quantity_inspected', 'result', 'inspector_name', 'inspection_date'],
      ...qcRecords.map((record) => [
        record.batch_no,
        record.product_name,
        String(record.quantity_inspected),
        record.result,
        record.inspector_name,
        new Date(record.inspection_date).toISOString().slice(0, 10),
      ]),
    ]
    exportCsv('qc-report.csv', rows)
  }

  const exportAttendance = () => {
    const rows = [
      ['employee_id', 'date', 'status'],
      ...attendance.map((record) => [
        record.employee_id,
        new Date(record.date).toISOString().slice(0, 10),
        record.status,
      ]),
    ]
    exportCsv('attendance-report.csv', rows)
  }

  const presentCount = attendance.filter((record) => record.status === 'present').length
  const attendanceRate = attendance.length ? Math.round((presentCount / attendance.length) * 100) : 0

  return (
    <div
      className={`
        min-h-screen p-6 lg:p-8
        ${theme === 'dark' ? 'bg-industrial-dark-bg' : 'bg-industrial-light-bg'}
      `}
    >
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <BarChart3 size={28} className={theme === 'dark' ? 'text-industrial-dark-accent' : 'text-industrial-light-accent'} />
          <h1 className={theme === 'dark' ? 'text-3xl font-bold text-white' : 'text-3xl font-bold text-gray-900'}>
            Reports Center
          </h1>
        </div>
        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
          Download structured reports for every operational module.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <ReportCard
          title="Inventory"
          value={`${inventory.length} items`}
          icon={Package}
          subtitle="Stock snapshot"
          onExport={exportInventory}
        />
        <ReportCard
          title="Employees"
          value={`${employees.length} team members`}
          icon={Users}
          subtitle="Workforce overview"
          onExport={exportEmployees}
        />
        <ReportCard
          title="Machines"
          value={`${machines.length} assets`}
          icon={Cpu}
          subtitle="Asset utilization"
          onExport={exportMachines}
        />
        <ReportCard
          title="Quality Control"
          value={`${qcRecords.length} inspections`}
          icon={ClipboardCheck}
          subtitle="Inspection performance"
          onExport={exportQc}
        />
        <ReportCard
          title="Attendance"
          value={`${attendanceRate}% present`}
          icon={CalendarCheck}
          subtitle="Attendance summary"
          onExport={exportAttendance}
        />
      </div>
    </div>
  )
}

'use client'

import { Power, Wrench } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'
import type { MachineStatus } from '@/types/machine'

interface StatusToggleProps {
  currentStatus: MachineStatus
  onToggle: (newStatus: MachineStatus) => void
  machineId: string
}

export function StatusToggle({ currentStatus, onToggle, machineId }: StatusToggleProps) {
  const { theme } = useTheme()

  const handleToggle = () => {
    if (currentStatus === 'running') {
      onToggle('under_maintenance')
    } else if (currentStatus === 'under_maintenance') {
      onToggle('running')
    } else {
      // If idle, toggle to running
      onToggle('running')
    }
  }

  const getStatusConfig = () => {
    switch (currentStatus) {
      case 'running':
        return {
          label: 'Running',
          icon: Power,
          bg: theme === 'dark' ? 'bg-green-900/30' : 'bg-green-100',
          text: theme === 'dark' ? 'text-green-400' : 'text-green-700',
          border: theme === 'dark' ? 'border-green-700' : 'border-green-300',
          hover: theme === 'dark' ? 'hover:bg-green-900/50' : 'hover:bg-green-200',
        }
      case 'under_maintenance':
        return {
          label: 'Under Maintenance',
          icon: Wrench,
          bg: theme === 'dark' ? 'bg-yellow-900/30' : 'bg-yellow-100',
          text: theme === 'dark' ? 'text-yellow-400' : 'text-yellow-700',
          border: theme === 'dark' ? 'border-yellow-700' : 'border-yellow-300',
          hover: theme === 'dark' ? 'hover:bg-yellow-900/50' : 'hover:bg-yellow-200',
        }
      default:
        return {
          label: 'Idle',
          icon: Power,
          bg: theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100',
          text: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
          border: theme === 'dark' ? 'border-gray-700' : 'border-gray-300',
          hover: theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200',
        }
    }
  }

  const config = getStatusConfig()
  const Icon = config.icon

  return (
    <button
      onClick={handleToggle}
      className={`
        ${config.bg} ${config.text} ${config.border} ${config.hover}
        flex items-center gap-2 px-3 py-1.5 rounded-lg border
        transition-all duration-200 font-medium text-sm
        cursor-pointer
      `}
      title={`Click to toggle status (Current: ${config.label})`}
    >
      <Icon size={16} />
      <span>{config.label}</span>
    </button>
  )
}

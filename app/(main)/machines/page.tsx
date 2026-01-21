'use client'

import { useState, useEffect } from 'react'
import { Cpu, Plus, Edit, Trash2, Calendar, Loader2, AlertCircle } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'
import { StatusToggle } from '@/components/machines/StatusToggle'
import { MaintenanceLogTable } from '@/components/machines/MaintenanceLogTable'
import { BulkImportButton } from '@/components/ui/BulkImportButton'
import { useMachines } from '@/lib/hooks/useMachines'
import type { MaintenanceLog, CreateMaintenanceLog, Machine } from '@/types/machine'

// Mock data removed - machines now load from persistent storage.

export default function MachinesPage() {
  const { theme } = useTheme()
  const { machines: hookMachines, loading, error, addMachine, updateMachine, deleteMachine, refetch } = useMachines()
  const [machines, setMachines] = useState<typeof hookMachines>([])
  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLog[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<typeof machines[0]>>({})
  const [showAddForm, setShowAddForm] = useState(false)
  const [newMachine, setNewMachine] = useState<Partial<Parameters<typeof addMachine>[0]>>({
    status: 'idle',
    last_service_date: new Date(),
  })

  useEffect(() => {
    setMachines(hookMachines)
  }, [hookMachines])

  const handleStatusToggle = async (machineId: string, newStatus: typeof machines[0]['status']) => {
    try {
      await updateMachine(machineId, { status: newStatus })
      
      // If status changed to 'under_maintenance', create a maintenance log entry
      if (newStatus === 'under_maintenance') {
        const machine = machines.find((m) => m.id === machineId)
        if (machine) {
          const newLog: MaintenanceLog = {
            id: Date.now().toString(),
            machine_id: machineId,
            machine_name: machine.machine_name,
            service_date: new Date(),
            service_type: 'Maintenance Started',
            notes: `Machine status changed to Under Maintenance`,
            created_at: new Date(),
          }
          setMaintenanceLogs([newLog, ...maintenanceLogs])
        }
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update machine status')
    }
  }

  const handleAddMaintenanceLog = (log: CreateMaintenanceLog) => {
    const newLog: MaintenanceLog = {
      id: Date.now().toString(),
      ...log,
      created_at: new Date(),
    }
    setMaintenanceLogs([newLog, ...maintenanceLogs])
  }

  const handleEdit = (id: string) => {
    const machine = machines.find((m) => m.id === id)
    if (machine) {
      setEditingId(id)
      setEditForm(machine)
    }
  }

  const handleAddMachine = async () => {
    if (
      newMachine.machine_name &&
      newMachine.machine_type &&
      newMachine.last_service_date
    ) {
      try {
        await addMachine(newMachine as any)
        setNewMachine({
          status: 'idle',
          last_service_date: new Date(),
        })
        setShowAddForm(false)
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to add machine')
      }
    }
  }

  const handleSaveEdit = async () => {
    if (editingId) {
      try {
        await updateMachine(editingId, editForm)
        setEditingId(null)
        setEditForm({})
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to update machine')
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this machine?')) {
      try {
        await deleteMachine(id)
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to delete machine')
      }
    }
  }

  if (loading) {
    return (
      <div className={`
        min-h-screen p-6 lg:p-8 flex items-center justify-center
        ${theme === 'dark' ? 'bg-industrial-dark-bg' : 'bg-industrial-light-bg'}
      `}>
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4" size={48} />
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Loading machines...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`
        min-h-screen p-6 lg:p-8 flex items-center justify-center
        ${theme === 'dark' ? 'bg-industrial-dark-bg' : 'bg-industrial-light-bg'}
      `}>
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
          <p className={theme === 'dark' ? 'text-red-400' : 'text-red-600'}>{error}</p>
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
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1
            className={`
              text-3xl font-bold
              ${theme === 'dark' ? 'text-industrial-dark-text' : 'text-industrial-light-text'}
            `}
          >
            Machine Tracking
          </h1>
          <div className="flex items-center gap-3">
            <BulkImportButton
              module="machines"
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
              onClick={() => setShowAddForm(!showAddForm)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors
                ${theme === 'dark'
                  ? 'bg-industrial-dark-accent hover:bg-industrial-dark-accent-hover text-white'
                  : 'bg-industrial-light-accent hover:bg-industrial-light-accent-hover text-white'
                }
              `}
            >
              <Plus size={20} />
              Add Machine
            </button>
          </div>
        </div>
        <p
          className={`
            ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
          `}
        >
          Monitor machine status and maintenance schedules.
        </p>
      </div>

      {/* Add Machine Form */}
      {showAddForm && (
        <div
          className={`
            rounded-lg border p-6 mb-6
            ${theme === 'dark'
              ? 'bg-industrial-dark-surface border-industrial-dark-border'
              : 'bg-industrial-light-surface border-industrial-light-border'
            }
          `}
        >
          <h3
            className={`
              text-xl font-semibold mb-4
              ${theme === 'dark' ? 'text-industrial-dark-text' : 'text-industrial-light-text'}
            `}
          >
            Add New Machine
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className={`
                  block text-sm font-medium mb-2
                  ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                `}
              >
                Machine Name
              </label>
              <input
                type="text"
                value={newMachine.machine_name || ''}
                onChange={(e) => setNewMachine({ ...newMachine, machine_name: e.target.value })}
                className={`
                  w-full px-3 py-2 rounded-lg border
                  ${theme === 'dark'
                    ? 'bg-industrial-dark-bg border-industrial-dark-border text-industrial-dark-text'
                    : 'bg-white border-industrial-light-border text-industrial-light-text'
                  }
                `}
              />
            </div>
            <div>
              <label
                className={`
                  block text-sm font-medium mb-2
                  ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                `}
              >
                Machine Type
              </label>
              <input
                type="text"
                value={newMachine.machine_type || ''}
                onChange={(e) => setNewMachine({ ...newMachine, machine_type: e.target.value })}
                className={`
                  w-full px-3 py-2 rounded-lg border
                  ${theme === 'dark'
                    ? 'bg-industrial-dark-bg border-industrial-dark-border text-industrial-dark-text'
                    : 'bg-white border-industrial-light-border text-industrial-light-text'
                  }
                `}
              />
            </div>
            <div>
              <label
                className={`
                  block text-sm font-medium mb-2
                  ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                `}
              >
                Location
              </label>
              <input
                type="text"
                value={newMachine.location || ''}
                onChange={(e) => setNewMachine({ ...newMachine, location: e.target.value })}
                className={`
                  w-full px-3 py-2 rounded-lg border
                  ${theme === 'dark'
                    ? 'bg-industrial-dark-bg border-industrial-dark-border text-industrial-dark-text'
                    : 'bg-white border-industrial-light-border text-industrial-light-text'
                  }
                `}
              />
            </div>
            <div>
              <label
                className={`
                  block text-sm font-medium mb-2
                  ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                `}
              >
                Last Service Date
              </label>
              <input
                type="date"
                value={
                  newMachine.last_service_date
                    ? new Date(newMachine.last_service_date).toISOString().split('T')[0]
                    : ''
                }
                onChange={(e) =>
                  setNewMachine({ ...newMachine, last_service_date: new Date(e.target.value) })
                }
                className={`
                  w-full px-3 py-2 rounded-lg border
                  ${theme === 'dark'
                    ? 'bg-industrial-dark-bg border-industrial-dark-border text-industrial-dark-text'
                    : 'bg-white border-industrial-light-border text-industrial-light-text'
                  }
                `}
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleAddMachine}
              className={`
                px-4 py-2 rounded-lg font-medium transition-colors
                ${theme === 'dark'
                  ? 'bg-industrial-dark-accent hover:bg-industrial-dark-accent-hover text-white'
                  : 'bg-industrial-light-accent hover:bg-industrial-light-accent-hover text-white'
                }
              `}
            >
              Add Machine
            </button>
            <button
              onClick={() => {
                setShowAddForm(false)
                setNewMachine({ status: 'idle', last_service_date: new Date() })
              }}
              className={`
                px-4 py-2 rounded-lg font-medium transition-colors border
                ${theme === 'dark'
                  ? 'border-industrial-dark-border text-industrial-dark-text hover:bg-industrial-dark-surface'
                  : 'border-industrial-light-border text-industrial-light-text hover:bg-gray-100'
                }
              `}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Machines Table */}
      <div
        className={`
          rounded-lg border overflow-hidden mb-8
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
                  Machine Name
                </th>
                <th
                  className={`
                    px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider
                    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                  `}
                >
                  Type
                </th>
                <th
                  className={`
                    px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider
                    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                  `}
                >
                  Status
                </th>
                <th
                  className={`
                    px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider
                    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                  `}
                >
                  Location
                </th>
                <th
                  className={`
                    px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider
                    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                  `}
                >
                  Last Service
                </th>
                <th
                  className={`
                    px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider
                    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                  `}
                >
                  Next Service
                </th>
                <th
                  className={`
                    px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider
                    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                  `}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {machines.map((machine) => (
                <tr
                  key={machine.id}
                  className={`
                    hover:opacity-90 transition-opacity
                    ${theme === 'dark' ? 'hover:bg-industrial-dark-bg' : 'hover:bg-gray-50'}
                  `}
                >
                  {editingId === machine.id ? (
                    <>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={editForm.machine_name || ''}
                          onChange={(e) => setEditForm({ ...editForm, machine_name: e.target.value })}
                          className={`
                            w-full px-2 py-1 rounded border text-sm
                            ${theme === 'dark'
                              ? 'bg-industrial-dark-bg border-industrial-dark-border text-industrial-dark-text'
                              : 'bg-white border-industrial-light-border text-industrial-light-text'
                            }
                          `}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={editForm.machine_type || ''}
                          onChange={(e) => setEditForm({ ...editForm, machine_type: e.target.value })}
                          className={`
                            w-full px-2 py-1 rounded border text-sm
                            ${theme === 'dark'
                              ? 'bg-industrial-dark-bg border-industrial-dark-border text-industrial-dark-text'
                              : 'bg-white border-industrial-light-border text-industrial-light-text'
                            }
                          `}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={editForm.status || ''}
                          onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                          className={`
                            w-full px-2 py-1 rounded border text-sm
                            ${theme === 'dark'
                              ? 'bg-industrial-dark-bg border-industrial-dark-border text-industrial-dark-text'
                              : 'bg-white border-industrial-light-border text-industrial-light-text'
                            }
                          `}
                        >
                          <option value="running">Running</option>
                          <option value="under_maintenance">Under Maintenance</option>
                          <option value="idle">Idle</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={editForm.location || ''}
                          onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                          className={`
                            w-full px-2 py-1 rounded border text-sm
                            ${theme === 'dark'
                              ? 'bg-industrial-dark-bg border-industrial-dark-border text-industrial-dark-text'
                              : 'bg-white border-industrial-light-border text-industrial-light-text'
                            }
                          `}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="date"
                          value={
                            editForm.last_service_date
                              ? new Date(editForm.last_service_date).toISOString().split('T')[0]
                              : ''
                          }
                          onChange={(e) =>
                            setEditForm({ ...editForm, last_service_date: new Date(e.target.value) })
                          }
                          className={`
                            w-full px-2 py-1 rounded border text-sm
                            ${theme === 'dark'
                              ? 'bg-industrial-dark-bg border-industrial-dark-border text-industrial-dark-text'
                              : 'bg-white border-industrial-light-border text-industrial-light-text'
                            }
                          `}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="date"
                          value={
                            editForm.next_service_date
                              ? new Date(editForm.next_service_date).toISOString().split('T')[0]
                              : ''
                          }
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              next_service_date: e.target.value ? new Date(e.target.value) : undefined,
                            })
                          }
                          className={`
                            w-full px-2 py-1 rounded border text-sm
                            ${theme === 'dark'
                              ? 'bg-industrial-dark-bg border-industrial-dark-border text-industrial-dark-text'
                              : 'bg-white border-industrial-light-border text-industrial-light-text'
                            }
                          `}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={handleSaveEdit}
                            className={`
                              p-1.5 rounded hover:opacity-70 transition-opacity
                              ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}
                            `}
                            title="Save"
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(null)
                              setEditForm({})
                            }}
                            className={`
                              p-1.5 rounded hover:opacity-70 transition-opacity
                              ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
                            `}
                            title="Cancel"
                          >
                            ✕
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td
                        className={`
                          px-6 py-4 whitespace-nowrap text-sm font-medium
                          ${theme === 'dark' ? 'text-industrial-dark-text' : 'text-industrial-light-text'}
                        `}
                      >
                        {machine.machine_name}
                      </td>
                      <td
                        className={`
                          px-6 py-4 whitespace-nowrap text-sm
                          ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
                        `}
                      >
                        {machine.machine_type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusToggle
                          currentStatus={machine.status}
                          onToggle={(newStatus) => handleStatusToggle(machine.id, newStatus)}
                          machineId={machine.id}
                        />
                      </td>
                      <td
                        className={`
                          px-6 py-4 whitespace-nowrap text-sm
                          ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
                        `}
                      >
                        {machine.location || 'N/A'}
                      </td>
                      <td
                        className={`
                          px-6 py-4 whitespace-nowrap text-sm
                          ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
                        `}
                      >
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="opacity-50" />
                          {new Date(machine.last_service_date).toLocaleDateString()}
                        </div>
                      </td>
                      <td
                        className={`
                          px-6 py-4 whitespace-nowrap text-sm
                          ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
                        `}
                      >
                        {machine.next_service_date ? (
                          <div className="flex items-center gap-2">
                            <Calendar size={16} className="opacity-50" />
                            {new Date(machine.next_service_date).toLocaleDateString()}
                          </div>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(machine.id)}
                            className={`
                              p-2 rounded hover:opacity-70 transition-opacity
                              ${theme === 'dark'
                                ? 'text-blue-400 hover:bg-industrial-dark-bg'
                                : 'text-blue-600 hover:bg-gray-100'
                              }
                            `}
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(machine.id)}
                            className={`
                              p-2 rounded hover:opacity-70 transition-opacity
                              ${theme === 'dark'
                                ? 'text-red-400 hover:bg-industrial-dark-bg'
                                : 'text-red-600 hover:bg-gray-100'
                              }
                            `}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {machines.length === 0 && (
          <div
            className={`
              text-center py-12
              ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
            `}
          >
            <Cpu size={48} className="mx-auto mb-4 opacity-50" />
            <p>No machines found. Add your first machine using the button above.</p>
          </div>
        )}
      </div>

      {/* Maintenance Log Section */}
      <div className="mb-8">
        <h2
          className={`
            text-2xl font-bold mb-4
            ${theme === 'dark' ? 'text-industrial-dark-text' : 'text-industrial-light-text'}
          `}
        >
          Maintenance Log
        </h2>
        <p
          className={`
            text-sm mb-6
            ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
          `}
        >
          Complete history of all machine maintenance and service records.
        </p>
        <MaintenanceLogTable logs={maintenanceLogs} />
      </div>
    </div>
  )
}

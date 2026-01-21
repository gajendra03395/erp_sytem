'use client'

import { useState, useEffect } from 'react'
import { ClipboardCheck, Edit, Trash2, CheckCircle, XCircle, Clock, Loader2, AlertCircle } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'
import { useAuth } from '@/components/providers/AuthProvider'
import { QCInspectionForm } from '@/components/qc/QCInspectionForm'
import { SuccessRateChart } from '@/components/qc/SuccessRateChart'
import { canEdit, canDelete } from '@/lib/auth/permissions'
import { useQC } from '@/lib/hooks/useQC'
import { BulkImportButton } from '@/components/ui/BulkImportButton'
import type { CreateQC, QualityControl } from '@/types/qc'

// Mock data removed - QC records now load from persistent storage.

export default function QualityControlPage() {
  const { theme } = useTheme()
  const { currentRole } = useAuth()
  const { records: hookQCRecords, loading, error, addRecord, updateRecord, deleteRecord, refetch } = useQC()
  const [qcRecords, setQCRecords] = useState<typeof hookQCRecords>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<typeof qcRecords[0]>>({})

  useEffect(() => {
    setQCRecords(hookQCRecords)
  }, [hookQCRecords])

  const handleSubmit = async (data: CreateQC) => {
    try {
      if (editingId) {
        await updateRecord(editingId, data)
        setEditingId(null)
        setEditForm({})
      } else {
        await addRecord(data)
      }
      setShowForm(false)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save QC record')
    }
  }

  const handleEdit = (id: string) => {
    const record = qcRecords.find((r) => r.id === id)
    if (record) {
      setEditingId(id)
      setEditForm(record)
      setShowForm(true)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this QC record?')) {
      try {
        await deleteRecord(id)
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to delete QC record')
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
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Loading QC records...</p>
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

  const getStatusIcon = (result: QualityControl['result']) => {
    switch (result) {
      case 'pass':
        return <CheckCircle size={18} className="text-green-500" />
      case 'fail':
        return <XCircle size={18} className="text-red-500" />
      default:
        return <Clock size={18} className="text-yellow-500" />
    }
  }

  const getStatusBadge = (result: QualityControl['result']) => {
    const baseClasses = 'px-2 py-1 rounded text-xs font-medium'
    switch (result) {
      case 'pass':
        return `${baseClasses} ${theme === 'dark' ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800'}`
      case 'fail':
        return `${baseClasses} ${theme === 'dark' ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-800'}`
      default:
        return `${baseClasses} ${theme === 'dark' ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-800'}`
    }
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
            Quality Control
          </h1>
          {canEdit(currentRole, 'qc') && (
            <div className="flex items-center gap-3">
              <BulkImportButton
                module="quality-control"
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
                onClick={() => {
                  setShowForm(!showForm)
                  setEditingId(null)
                  setEditForm({})
                }}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors
                  ${theme === 'dark'
                    ? 'bg-industrial-dark-accent hover:bg-industrial-dark-accent-hover text-white'
                    : 'bg-industrial-light-accent hover:bg-industrial-light-accent-hover text-white'
                  }
                `}
              >
                <ClipboardCheck size={20} />
                {showForm ? 'Cancel' : 'New Inspection'}
              </button>
            </div>
          )}
        </div>
        <p
          className={`
            ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
          `}
        >
          Manage quality inspections and track inspection results.
        </p>
      </div>

      {/* Success Rate Chart */}
      <div className="mb-6">
        <SuccessRateChart qcRecords={qcRecords} />
      </div>

      {/* Inspection Form */}
      {showForm && (
        <div className="mb-6">
          <QCInspectionForm
            onSubmit={(data) => {
              if (editingId && editForm) {
                handleSubmit({
                  ...data,
                  inspector_name: editForm.inspector_name || data.inspector_name,
                  inspector_id: editForm.inspector_id || data.inspector_id,
                })
              } else {
                handleSubmit(data)
              }
            }}
            onCancel={() => {
              setShowForm(false)
              setEditingId(null)
              setEditForm({})
            }}
            inspectorName={editingId ? editForm.inspector_name : 'Sarah Johnson'}
            inspectorId={editingId ? editForm.inspector_id : '2'}
            initialData={editingId ? editForm : undefined}
          />
        </div>
      )}

      {/* QC History Table */}
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
                  Batch No.
                </th>
                <th
                  className={`
                    px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider
                    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                  `}
                >
                  Product Name
                </th>
                <th
                  className={`
                    px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider
                    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                  `}
                >
                  Quantity
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
                  Inspector
                </th>
                <th
                  className={`
                    px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider
                    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                  `}
                >
                  Date
                </th>
                <th
                  className={`
                    px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider
                    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                  `}
                >
                  Defect Reason
                </th>
                {canEdit(currentRole, 'qc') && (
                  <th
                    className={`
                      px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider
                      ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                    `}
                  >
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {qcRecords.map((record) => (
                <tr
                  key={record.id}
                  className={`
                    hover:opacity-90 transition-opacity
                    ${theme === 'dark' ? 'hover:bg-industrial-dark-bg' : 'hover:bg-gray-50'}
                  `}
                >
                  <td
                    className={`
                      px-6 py-4 whitespace-nowrap text-sm font-medium
                      ${theme === 'dark' ? 'text-industrial-dark-text' : 'text-industrial-light-text'}
                    `}
                  >
                    {record.batch_no}
                  </td>
                  <td
                    className={`
                      px-6 py-4 whitespace-nowrap text-sm
                      ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
                    `}
                  >
                    {record.product_name}
                  </td>
                  <td
                    className={`
                      px-6 py-4 whitespace-nowrap text-sm
                      ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
                    `}
                  >
                    {record.quantity_inspected}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(record.result)}
                      <span className={getStatusBadge(record.result)}>
                        {record.result.toUpperCase()}
                      </span>
                    </div>
                  </td>
                  <td
                    className={`
                      px-6 py-4 whitespace-nowrap text-sm
                      ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
                    `}
                  >
                    {record.inspector_name}
                  </td>
                  <td
                    className={`
                      px-6 py-4 whitespace-nowrap text-sm
                      ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
                    `}
                  >
                    {new Date(record.inspection_date).toLocaleDateString()}
                  </td>
                  <td
                    className={`
                      px-6 py-4 text-sm max-w-xs
                      ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
                    `}
                  >
                    {record.defect_reason || (
                      <span className="opacity-50">N/A</span>
                    )}
                  </td>
                  {canEdit(currentRole, 'qc') && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(record.id)}
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
                        {canDelete(currentRole, 'qc') && (
                          <button
                            onClick={() => handleDelete(record.id)}
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
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {qcRecords.length === 0 && (
          <div
            className={`
              text-center py-12
              ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
            `}
          >
            <ClipboardCheck size={48} className="mx-auto mb-4 opacity-50" />
            <p>No QC records found. Create your first inspection using the button above.</p>
          </div>
        )}
      </div>
    </div>
  )
}

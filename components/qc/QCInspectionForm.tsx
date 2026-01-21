'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'
import type { CreateQC, QCResult } from '@/types/qc'

interface QCInspectionFormProps {
  onSubmit: (data: CreateQC) => void
  onCancel?: () => void
  inspectorName?: string
  inspectorId?: string
  initialData?: Partial<CreateQC>
}

export function QCInspectionForm({ onSubmit, onCancel, inspectorName = 'Inspector', inspectorId = '1', initialData }: QCInspectionFormProps) {
  const { theme } = useTheme()
  const [formData, setFormData] = useState<CreateQC>({
    batch_no: initialData?.batch_no || '',
    product_name: initialData?.product_name || '',
    quantity_inspected: initialData?.quantity_inspected || 0,
    result: initialData?.result || 'pending',
    inspector_name: initialData?.inspector_name || inspectorName,
    inspector_id: initialData?.inspector_id || inspectorId,
    inspection_date: initialData?.inspection_date ? new Date(initialData.inspection_date) : new Date(),
    defect_reason: initialData?.defect_reason || '',
    notes: initialData?.notes || '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    // Validation
    if (!formData.batch_no.trim()) {
      newErrors.batch_no = 'Batch number is required'
    }
    if (!formData.product_name.trim()) {
      newErrors.product_name = 'Product name is required'
    }
    if (formData.quantity_inspected <= 0) {
      newErrors.quantity_inspected = 'Quantity must be greater than 0'
    }
    if (formData.result === 'fail' && !formData.defect_reason?.trim()) {
      newErrors.defect_reason = 'Defect reason is required when status is Fail'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    onSubmit(formData)
    
    // Reset form
    setFormData({
      batch_no: '',
      product_name: '',
      quantity_inspected: 0,
      result: 'pending',
      inspector_name: inspectorName,
      inspector_id: inspectorId,
      inspection_date: new Date(),
      defect_reason: '',
      notes: '',
    })
  }

  const getStatusIcon = (status: QCResult) => {
    switch (status) {
      case 'pass':
        return <CheckCircle size={20} className="text-green-500" />
      case 'fail':
        return <XCircle size={20} className="text-red-500" />
      default:
        return <Clock size={20} className="text-yellow-500" />
    }
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
      <h3
        className={`
          text-xl font-semibold mb-4
          ${theme === 'dark' ? 'text-industrial-dark-text' : 'text-industrial-light-text'}
        `}
      >
        New Inspection
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              className={`
                block text-sm font-medium mb-2
                ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
              `}
            >
              Batch Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.batch_no}
              onChange={(e) => {
                setFormData({ ...formData, batch_no: e.target.value })
                if (errors.batch_no) setErrors({ ...errors, batch_no: '' })
              }}
              required
              className={`
                w-full px-3 py-2 rounded-lg border
                ${errors.batch_no ? 'border-red-500' : ''}
                ${theme === 'dark'
                  ? 'bg-industrial-dark-bg border-industrial-dark-border text-industrial-dark-text'
                  : 'bg-white border-industrial-light-border text-industrial-light-text'
                }
                focus:outline-none focus:ring-2 focus:ring-industrial-dark-accent
              `}
              placeholder="Enter batch number"
            />
            {errors.batch_no && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle size={12} />
                {errors.batch_no}
              </p>
            )}
          </div>

          <div>
            <label
              className={`
                block text-sm font-medium mb-2
                ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
              `}
            >
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.product_name}
              onChange={(e) => {
                setFormData({ ...formData, product_name: e.target.value })
                if (errors.product_name) setErrors({ ...errors, product_name: '' })
              }}
              required
              className={`
                w-full px-3 py-2 rounded-lg border
                ${errors.product_name ? 'border-red-500' : ''}
                ${theme === 'dark'
                  ? 'bg-industrial-dark-bg border-industrial-dark-border text-industrial-dark-text'
                  : 'bg-white border-industrial-light-border text-industrial-light-text'
                }
                focus:outline-none focus:ring-2 focus:ring-industrial-dark-accent
              `}
              placeholder="Enter product name"
            />
            {errors.product_name && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle size={12} />
                {errors.product_name}
              </p>
            )}
          </div>

          <div>
            <label
              className={`
                block text-sm font-medium mb-2
                ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
              `}
            >
              Quantity Inspected <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.quantity_inspected || ''}
              onChange={(e) => {
                setFormData({ ...formData, quantity_inspected: parseFloat(e.target.value) || 0 })
                if (errors.quantity_inspected) setErrors({ ...errors, quantity_inspected: '' })
              }}
              required
              min="1"
              step="1"
              className={`
                w-full px-3 py-2 rounded-lg border
                ${errors.quantity_inspected ? 'border-red-500' : ''}
                ${theme === 'dark'
                  ? 'bg-industrial-dark-bg border-industrial-dark-border text-industrial-dark-text'
                  : 'bg-white border-industrial-light-border text-industrial-light-text'
                }
                focus:outline-none focus:ring-2 focus:ring-industrial-dark-accent
              `}
              placeholder="Enter quantity"
            />
            {errors.quantity_inspected && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle size={12} />
                {errors.quantity_inspected}
              </p>
            )}
          </div>

          <div>
            <label
              className={`
                block text-sm font-medium mb-2
                ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
              `}
            >
              Inspection Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.inspection_date.toISOString().split('T')[0]}
              onChange={(e) => setFormData({ ...formData, inspection_date: new Date(e.target.value) })}
              required
              className={`
                w-full px-3 py-2 rounded-lg border
                ${theme === 'dark'
                  ? 'bg-industrial-dark-bg border-industrial-dark-border text-industrial-dark-text'
                  : 'bg-white border-industrial-light-border text-industrial-light-text'
                }
                focus:outline-none focus:ring-2 focus:ring-industrial-dark-accent
              `}
            />
          </div>
        </div>

        <div>
          <label
            className={`
              block text-sm font-medium mb-2
              ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
            `}
          >
            Status <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={formData.result}
              onChange={(e) => {
                const newResult = e.target.value as QCResult
                setFormData({
                  ...formData,
                  result: newResult,
                  defect_reason: newResult !== 'fail' ? '' : formData.defect_reason,
                })
                if (errors.defect_reason && newResult !== 'fail') {
                  setErrors({ ...errors, defect_reason: '' })
                }
              }}
              required
              className={`
                w-full px-3 py-2 rounded-lg border appearance-none
                ${theme === 'dark'
                  ? 'bg-industrial-dark-bg border-industrial-dark-border text-industrial-dark-text'
                  : 'bg-white border-industrial-light-border text-industrial-light-text'
                }
                focus:outline-none focus:ring-2 focus:ring-industrial-dark-accent
              `}
            >
              <option value="pending">Pending</option>
              <option value="pass">Pass</option>
              <option value="fail">Fail</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              {getStatusIcon(formData.result)}
            </div>
          </div>
        </div>

        {/* Conditional Defect Reason Field */}
        {formData.result === 'fail' && (
          <div className="animate-in slide-in-from-top-2 duration-200">
            <label
              className={`
                block text-sm font-medium mb-2
                ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
              `}
            >
              Defect Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.defect_reason || ''}
              onChange={(e) => {
                setFormData({ ...formData, defect_reason: e.target.value })
                if (errors.defect_reason) setErrors({ ...errors, defect_reason: '' })
              }}
              required={formData.result === 'fail'}
              rows={3}
              className={`
                w-full px-3 py-2 rounded-lg border
                ${errors.defect_reason ? 'border-red-500' : ''}
                ${theme === 'dark'
                  ? 'bg-industrial-dark-bg border-industrial-dark-border text-industrial-dark-text'
                  : 'bg-white border-industrial-light-border text-industrial-light-text'
                }
                focus:outline-none focus:ring-2 focus:ring-industrial-dark-accent
                resize-none
              `}
              placeholder="Describe the defects found..."
            />
            {errors.defect_reason && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle size={12} />
                {errors.defect_reason}
              </p>
            )}
          </div>
        )}

        <div>
          <label
            className={`
              block text-sm font-medium mb-2
              ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
            `}
          >
            Additional Notes
          </label>
          <textarea
            value={formData.notes || ''}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={2}
            className={`
              w-full px-3 py-2 rounded-lg border
              ${theme === 'dark'
                ? 'bg-industrial-dark-bg border-industrial-dark-border text-industrial-dark-text'
                : 'bg-white border-industrial-light-border text-industrial-light-text'
              }
              focus:outline-none focus:ring-2 focus:ring-industrial-dark-accent
              resize-none
            `}
            placeholder="Optional notes..."
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className={`
              flex-1 px-4 py-2 rounded-lg font-medium transition-colors
              ${theme === 'dark'
                ? 'bg-industrial-dark-accent hover:bg-industrial-dark-accent-hover text-white'
                : 'bg-industrial-light-accent hover:bg-industrial-light-accent-hover text-white'
              }
            `}
          >
            Submit Inspection
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
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
          )}
        </div>
      </form>
    </div>
  )
}

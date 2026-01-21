'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'
import type { StockTransaction } from '@/types/inventory'

interface StockFormProps {
  onSubmit: (data: StockTransaction) => void
  onCancel?: () => void
  existingItems?: string[]
}

export function StockForm({ onSubmit, onCancel, existingItems = [] }: StockFormProps) {
  const { theme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState<StockTransaction>({
    item_name: '',
    quantity: 0,
    supplier: '',
    date: new Date(),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({
      item_name: '',
      quantity: 0,
      supplier: '',
      date: new Date(),
    })
    setIsOpen(false)
  }

  const handleCancel = () => {
    setIsOpen(false)
    onCancel?.()
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors
          ${theme === 'dark'
            ? 'bg-industrial-dark-accent hover:bg-industrial-dark-accent-hover text-white'
            : 'bg-industrial-light-accent hover:bg-industrial-light-accent-hover text-white'
          }
        `}
      >
        <Plus size={20} />
        Add Stock
      </button>
    )
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
            text-xl font-semibold
            ${theme === 'dark' ? 'text-industrial-dark-text' : 'text-industrial-light-text'}
          `}
        >
          Add New Stock
        </h3>
        <button
          onClick={handleCancel}
          className={`
            p-1 rounded hover:opacity-70 transition-opacity
            ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
          `}
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            className={`
              block text-sm font-medium mb-2
              ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
            `}
          >
            Item Name
          </label>
          {existingItems.length > 0 ? (
            <select
              value={formData.item_name}
              onChange={(e) => setFormData({ ...formData, item_name: e.target.value })}
              required
              className={`
                w-full px-3 py-2 rounded-lg border
                ${theme === 'dark'
                  ? 'bg-industrial-dark-bg border-industrial-dark-border text-industrial-dark-text'
                  : 'bg-white border-industrial-light-border text-industrial-light-text'
                }
                focus:outline-none focus:ring-2 focus:ring-industrial-dark-accent
              `}
            >
              <option value="">Select an item</option>
              {existingItems.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={formData.item_name}
              onChange={(e) => setFormData({ ...formData, item_name: e.target.value })}
              required
              placeholder="Enter item name"
              className={`
                w-full px-3 py-2 rounded-lg border
                ${theme === 'dark'
                  ? 'bg-industrial-dark-bg border-industrial-dark-border text-industrial-dark-text'
                  : 'bg-white border-industrial-light-border text-industrial-light-text'
                }
                focus:outline-none focus:ring-2 focus:ring-industrial-dark-accent
              `}
            />
          )}
        </div>

        <div>
          <label
            className={`
              block text-sm font-medium mb-2
              ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
            `}
          >
            Quantity
          </label>
          <input
            type="number"
            value={formData.quantity || ''}
            onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) || 0 })}
            required
            min="0"
            step="0.01"
            placeholder="Enter quantity"
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

        <div>
          <label
            className={`
              block text-sm font-medium mb-2
              ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
            `}
          >
            Supplier
          </label>
          <input
            type="text"
            value={formData.supplier}
            onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
            required
            placeholder="Enter supplier name"
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

        <div>
          <label
            className={`
              block text-sm font-medium mb-2
              ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
            `}
          >
            Date
          </label>
          <input
            type="date"
            value={formData.date.toISOString().split('T')[0]}
            onChange={(e) => setFormData({ ...formData, date: new Date(e.target.value) })}
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
            Add Stock
          </button>
          <button
            type="button"
            onClick={handleCancel}
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
      </form>
    </div>
  )
}

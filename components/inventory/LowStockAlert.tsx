'use client'

import { AlertTriangle } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'
import type { InventoryItem } from '@/types/inventory'

interface LowStockAlertProps {
  items: InventoryItem[]
  threshold?: number
}

export function LowStockAlert({ items, threshold = 10 }: LowStockAlertProps) {
  const { theme } = useTheme()
  
  const lowStockItems = items.filter(
    (item) => item.stock_level < threshold
  )

  if (lowStockItems.length === 0) return null

  return (
    <div
      className={`
        rounded-lg border p-4 mb-6
        ${theme === 'dark'
          ? 'bg-yellow-900/20 border-yellow-700'
          : 'bg-yellow-50 border-yellow-300'
        }
      `}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle
          className={`
            flex-shrink-0 mt-0.5
            ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}
          `}
          size={20}
        />
        <div className="flex-1">
          <h3
            className={`
              font-semibold mb-2
              ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-800'}
            `}
          >
            Low Stock Alert ({lowStockItems.length} {lowStockItems.length === 1 ? 'item' : 'items'})
          </h3>
          <div className="space-y-1">
            {lowStockItems.map((item) => (
              <p
                key={item.id}
                className={`
                  text-sm
                  ${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-700'}
                `}
              >
                <span className="font-medium">{item.item_name}</span> - Only{' '}
                <span className="font-bold">{item.stock_level}</span> {item.unit} remaining
                {item.stock_level < item.reorder_point && (
                  <span className="ml-2 text-xs opacity-75">
                    (Below reorder point: {item.reorder_point})
                  </span>
                )}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

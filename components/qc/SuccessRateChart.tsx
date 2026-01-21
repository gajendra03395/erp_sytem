'use client'

import { useTheme } from '@/components/providers/ThemeProvider'
import type { QualityControl } from '@/types/qc'

interface SuccessRateChartProps {
  qcRecords: QualityControl[]
}

export function SuccessRateChart({ qcRecords }: SuccessRateChartProps) {
  const { theme } = useTheme()

  // Calculate statistics
  const total = qcRecords.length
  const passed = qcRecords.filter((r) => r.result === 'pass').length
  const failed = qcRecords.filter((r) => r.result === 'fail').length
  const pending = qcRecords.filter((r) => r.result === 'pending').length

  const successRate = total > 0 ? ((passed / (passed + failed)) * 100).toFixed(1) : '0.0'
  const passPercentage = total > 0 ? (passed / total) * 100 : 0
  const failPercentage = total > 0 ? (failed / total) * 100 : 0
  const pendingPercentage = total > 0 ? (pending / total) * 100 : 0

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
          QC Success Rate
        </h3>
        <div
          className={`
            text-2xl font-bold
            ${theme === 'dark' ? 'text-industrial-dark-accent' : 'text-industrial-light-accent'}
          `}
        >
          {successRate}%
        </div>
      </div>

      {/* Bar Chart */}
      <div className="space-y-2">
        {/* Pass Bar */}
        {passPercentage > 0 && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <span
                className={`
                  text-sm font-medium
                  ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}
                `}
              >
                Pass
              </span>
              <span
                className={`
                  text-sm
                  ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
                `}
              >
                {passed} ({passPercentage.toFixed(1)}%)
              </span>
            </div>
            <div className="w-full h-6 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
              <div
                className="h-full bg-green-500 transition-all duration-500 flex items-center justify-end pr-2"
                style={{ width: `${passPercentage}%` }}
              >
                {passPercentage > 10 && (
                  <span className="text-xs font-medium text-white">{passPercentage.toFixed(0)}%</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Fail Bar */}
        {failPercentage > 0 && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <span
                className={`
                  text-sm font-medium
                  ${theme === 'dark' ? 'text-red-400' : 'text-red-700'}
                `}
              >
                Fail
              </span>
              <span
                className={`
                  text-sm
                  ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
                `}
              >
                {failed} ({failPercentage.toFixed(1)}%)
              </span>
            </div>
            <div className="w-full h-6 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
              <div
                className="h-full bg-red-500 transition-all duration-500 flex items-center justify-end pr-2"
                style={{ width: `${failPercentage}%` }}
              >
                {failPercentage > 10 && (
                  <span className="text-xs font-medium text-white">{failPercentage.toFixed(0)}%</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Pending Bar */}
        {pendingPercentage > 0 && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <span
                className={`
                  text-sm font-medium
                  ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-700'}
                `}
              >
                Pending
              </span>
              <span
                className={`
                  text-sm
                  ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
                `}
              >
                {pending} ({pendingPercentage.toFixed(1)}%)
              </span>
            </div>
            <div className="w-full h-6 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
              <div
                className="h-full bg-yellow-500 transition-all duration-500 flex items-center justify-end pr-2"
                style={{ width: `${pendingPercentage}%` }}
              >
                {pendingPercentage > 10 && (
                  <span className="text-xs font-medium text-white">{pendingPercentage.toFixed(0)}%</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div
            className={`
              text-2xl font-bold
              ${theme === 'dark' ? 'text-industrial-dark-text' : 'text-industrial-light-text'}
            `}
          >
            {total}
          </div>
          <div
            className={`
              text-xs
              ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
            `}
          >
            Total Inspections
          </div>
        </div>
        <div className="text-center">
          <div
            className={`
              text-2xl font-bold text-green-500
            `}
          >
            {passed}
          </div>
          <div
            className={`
              text-xs
              ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
            `}
          >
            Passed
          </div>
        </div>
        <div className="text-center">
          <div
            className={`
              text-2xl font-bold text-red-500
            `}
          >
            {failed}
          </div>
          <div
            className={`
              text-xs
              ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
            `}
          >
            Failed
          </div>
        </div>
      </div>
    </div>
  )
}

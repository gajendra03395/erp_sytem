'use client'

import { useState, useEffect } from 'react'
import { Shield, FileText, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'
import { useAuth } from '@/components/providers/AuthProvider'

interface LogEntry {
  id: string
  timestamp: string
  level: 'info' | 'warning' | 'error' | 'success'
  user: string
  action: string
  details: string
}

export default function SystemLogsPage() {
  const { theme } = useTheme()
  const { currentRole } = useAuth()
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: '1',
      timestamp: new Date().toISOString(),
      level: 'success',
      user: 'superuser@erp.com',
      action: 'LOGIN',
      details: 'Superuser login successful'
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      level: 'info',
      user: 'admin@erp.com',
      action: 'USER_CREATED',
      details: 'Created new employee: John Doe'
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      level: 'warning',
      user: 'system',
      action: 'BACKUP_FAILED',
      details: 'Scheduled backup failed, will retry in 1 hour'
    },
    {
      id: '4',
      timestamp: new Date(Date.now() - 10800000).toISOString(),
      level: 'error',
      user: 'emp@erp.com',
      action: 'LOGIN_FAILED',
      details: 'Multiple failed login attempts detected'
    }
  ])

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Only allow superuser access
  const storedRole = mounted ? localStorage.getItem('user_role') : null
  const effectiveRole = storedRole || currentRole
  
  if (effectiveRole !== 'SUPERUSER') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-red-600">Access Denied</h2>
          <p className="text-gray-600 mt-2">Superuser access required</p>
        </div>
      </div>
    )
  }

  const getLevelIcon = (level: LogEntry['level']) => {
    switch (level) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <FileText className="h-4 w-4 text-blue-500" />
    }
  }

  const getLevelColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'success':
        return theme === 'dark' ? 'text-green-400' : 'text-green-600'
      case 'warning':
        return theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
      case 'error':
        return theme === 'dark' ? 'text-red-400' : 'text-red-600'
      default:
        return theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-yellow-500" />
        <div>
          <h1 className="text-3xl font-bold">📊 System Logs</h1>
          <p className="text-muted-foreground">Real-time system activity monitoring</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`p-6 rounded-lg border ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Logs</p>
              <p className="text-2xl font-bold">{logs.length}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className={`p-6 rounded-lg border ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Errors</p>
              <p className="text-2xl font-bold text-red-600">
                {logs.filter(l => l.level === 'error').length}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className={`p-6 rounded-lg border ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Warnings</p>
              <p className="text-2xl font-bold text-yellow-600">
                {logs.filter(l => l.level === 'warning').length}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className={`p-6 rounded-lg border ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Success</p>
              <p className="text-2xl font-bold text-green-600">
                {logs.filter(l => l.level === 'success').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className={`rounded-lg border overflow-hidden ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {logs.map((log) => (
                <tr key={log.id} className={theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      {getLevelIcon(log.level)}
                      <span className={getLevelColor(log.level)}>
                        {log.level.toUpperCase()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {log.user}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {log.action}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { Shield, Settings, Database, AlertTriangle, CheckCircle } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'
import { useAuth } from '@/components/providers/AuthProvider'

export default function SystemSettingsPage() {
  const { theme } = useTheme()
  const { currentRole } = useAuth()
  const [systemStatus, setSystemStatus] = useState({
    database: 'healthy',
    backup: 'last_backup_2_hours_ago',
    users: 156,
    uptime: '99.9%'
  })

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-yellow-500" />
        <div>
          <h1 className="text-3xl font-bold">⚡ Superuser Control Panel</h1>
          <p className="text-muted-foreground">System-wide administration and settings</p>
        </div>
      </div>

      {/* System Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-6 rounded-lg border ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Database</p>
              <p className="text-2xl font-bold text-green-600">{systemStatus.database}</p>
            </div>
            <Database className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className={`p-6 rounded-lg border ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Last Backup</p>
              <p className="text-2xl font-bold">{systemStatus.backup}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className={`p-6 rounded-lg border ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold">{systemStatus.users}</p>
            </div>
            <Settings className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className={`p-6 rounded-lg border ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">System Uptime</p>
              <p className="text-2xl font-bold text-green-600">{systemStatus.uptime}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Superuser Actions */}
      <div className={`p-6 rounded-lg border ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Settings className="h-5 w-5" />
          System Actions
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button className={`p-4 rounded-lg border text-left transition-colors ${
            theme === 'dark' 
              ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' 
              : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
          }`}>
            <h3 className="font-medium mb-2">🔄 Restart System</h3>
            <p className="text-sm text-muted-foreground">Safely restart the ERP system</p>
          </button>

          <button className={`p-4 rounded-lg border text-left transition-colors ${
            theme === 'dark' 
              ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' 
              : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
          }`}>
            <h3 className="font-medium mb-2">💾 Create Backup</h3>
            <p className="text-sm text-muted-foreground">Create immediate system backup</p>
          </button>

          <button className={`p-4 rounded-lg border text-left transition-colors ${
            theme === 'dark' 
              ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' 
              : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
          }`}>
            <h3 className="font-medium mb-2">🧹 Clear Cache</h3>
            <p className="text-sm text-muted-foreground">Clear system cache and temp files</p>
          </button>

          <button className={`p-4 rounded-lg border text-left transition-colors ${
            theme === 'dark' 
              ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' 
              : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
          }`}>
            <h3 className="font-medium mb-2">📊 Generate Report</h3>
            <p className="text-sm text-muted-foreground">Generate system health report</p>
          </button>

          <button className={`p-4 rounded-lg border text-left transition-colors ${
            theme === 'dark' 
              ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' 
              : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
          }`}>
            <h3 className="font-medium mb-2">🔧 Maintenance Mode</h3>
            <p className="text-sm text-muted-foreground">Enable/disable maintenance mode</p>
          </button>

          <button className={`p-4 rounded-lg border text-left transition-colors ${
            theme === 'dark' 
              ? 'bg-red-900/20 border-red-800 hover:bg-red-900/30' 
              : 'bg-red-50 border-red-200 hover:bg-red-100'
          }`}>
            <h3 className="font-medium mb-2 text-red-600">⚠️ Emergency Reset</h3>
            <p className="text-sm text-red-600">Reset system to factory defaults</p>
          </button>
        </div>
      </div>

      {/* Access Log */}
      <div className={`p-6 rounded-lg border ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h2 className="text-xl font-semibold mb-4">Recent Superuser Activity</h2>
        <div className="space-y-2">
          <div className={`p-3 rounded-lg text-sm ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <span className="font-medium">System backup completed</span>
            <span className="text-muted-foreground ml-2">2 hours ago</span>
          </div>
          <div className={`p-3 rounded-lg text-sm ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <span className="font-medium">User permissions updated</span>
            <span className="text-muted-foreground ml-2">5 hours ago</span>
          </div>
          <div className={`p-3 rounded-lg text-sm ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <span className="font-medium">System health check passed</span>
            <span className="text-muted-foreground ml-2">1 day ago</span>
          </div>
        </div>
      </div>
    </div>
  )
}

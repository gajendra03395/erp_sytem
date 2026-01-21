'use client'

import { useState, useEffect } from 'react'
import { Shield, Database, Download, Clock, CheckCircle, AlertTriangle } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'
import { useAuth } from '@/components/providers/AuthProvider'

interface BackupRecord {
  id: string
  timestamp: string
  size: string
  type: 'full' | 'incremental'
  status: 'completed' | 'failed' | 'in_progress'
}

export default function BackupDataPage() {
  const { theme } = useTheme()
  const { currentRole } = useAuth()
  const [backups, setBackups] = useState<BackupRecord[]>([
    {
      id: '1',
      timestamp: new Date().toISOString(),
      size: '245 MB',
      type: 'full',
      status: 'completed'
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      size: '12 MB',
      type: 'incremental',
      status: 'completed'
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      size: '238 MB',
      type: 'full',
      status: 'completed'
    }
  ])
  const [isCreatingBackup, setIsCreatingBackup] = useState(false)
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

  const handleCreateBackup = async (type: 'full' | 'incremental') => {
    setIsCreatingBackup(true)
    
    // Simulate backup creation
    setTimeout(() => {
      const newBackup: BackupRecord = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        size: type === 'full' ? '250 MB' : '15 MB',
        type,
        status: 'completed'
      }
      setBackups(prev => [newBackup, ...prev])
      setIsCreatingBackup(false)
    }, 3000)
  }

  const getStatusIcon = (status: BackupRecord['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-yellow-500 animate-spin" />
    }
  }

  const getStatusColor = (status: BackupRecord['status']) => {
    switch (status) {
      case 'completed':
        return theme === 'dark' ? 'text-green-400' : 'text-green-600'
      case 'failed':
        return theme === 'dark' ? 'text-red-400' : 'text-red-600'
      default:
        return theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-yellow-500" />
        <div>
          <h1 className="text-3xl font-bold">💾 Backup Data</h1>
          <p className="text-muted-foreground">System backup and recovery management</p>
        </div>
      </div>

      {/* Backup Actions */}
      <div className={`p-6 rounded-lg border ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Database className="h-5 w-5" />
          Create Backup
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => handleCreateBackup('full')}
            disabled={isCreatingBackup}
            className={`p-6 rounded-lg border text-left transition-colors ${
              isCreatingBackup
                ? 'opacity-50 cursor-not-allowed'
                : theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' 
                  : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg">🗄️ Full Backup</h3>
              <Download className="h-5 w-5" />
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Complete system backup including all data, settings, and user accounts
            </p>
            <div className="text-xs text-muted-foreground">
              Estimated size: ~250 MB | Time: 5-10 minutes
            </div>
          </button>

          <button
            onClick={() => handleCreateBackup('incremental')}
            disabled={isCreatingBackup}
            className={`p-6 rounded-lg border text-left transition-colors ${
              isCreatingBackup
                ? 'opacity-50 cursor-not-allowed'
                : theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' 
                  : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg">🔄 Incremental Backup</h3>
              <Download className="h-5 w-5" />
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Backup only recent changes since last backup
            </p>
            <div className="text-xs text-muted-foreground">
              Estimated size: ~15 MB | Time: 1-2 minutes
            </div>
          </button>
        </div>

        {isCreatingBackup && (
          <div className="mt-4 p-4 rounded-lg bg-blue-50 border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-blue-500 animate-spin" />
              <span className="text-blue-600 dark:text-blue-400">
                Creating backup... Please wait
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Backup History */}
      <div className={`rounded-lg border overflow-hidden ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Backup History
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {backups.map((backup) => (
                <tr key={backup.id} className={theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {new Date(backup.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      backup.type === 'full' 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    }`}>
                      {backup.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {backup.size}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(backup.status)}
                      <span className={getStatusColor(backup.status)}>
                        {backup.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {backup.status === 'completed' && (
                      <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                        <Download className="h-4 w-4" />
                        Download
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Storage Info */}
      <div className={`p-6 rounded-lg border ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h2 className="text-xl font-semibold mb-4">Storage Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">3</div>
            <div className="text-sm text-muted-foreground">Total Backups</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">495 MB</div>
            <div className="text-sm text-muted-foreground">Total Storage Used</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">5 GB</div>
            <div className="text-sm text-muted-foreground">Available Storage</div>
          </div>
        </div>
      </div>
    </div>
  )
}

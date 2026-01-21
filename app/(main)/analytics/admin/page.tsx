'use client'

import { useState } from 'react'
import { Settings, RefreshCw, Save, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'
import { useAuth } from '@/components/providers/AuthProvider'

export default function AnalyticsAdminPage() {
  const { theme } = useTheme()
  const { currentRole } = useAuth()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [currentData, setCurrentData] = useState({
    totalUsers: 1247,
    activeUsers: 892,
    totalRevenue: 2847560,
    revenueGrowth: 12.5,
    totalOrders: 3847,
    ordersThisMonth: 342,
    inventoryValue: 1567890,
    lowStockItems: 23,
    productionEfficiency: 87.3,
    systemUptime: 99.8,
    errorRate: 0.2,
  })

  const updateAnalyticsData = async () => {
    setLoading(true)
    setMessage('')
    
    try {
      const response = await fetch('/api/analytics/data', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentData)
      })
      
      const result = await response.json()
      
      if (result.success) {
        setMessage('Analytics data updated successfully!')
      } else {
        setMessage('Failed to update analytics data')
      }
    } catch (error) {
      setMessage('Error updating analytics data')
    } finally {
      setLoading(false)
    }
  }

  if (currentRole !== 'SUPERUSER' && currentRole !== 'ADMIN') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-red-600">Access Denied</h2>
          <p className="text-gray-600 mt-2">Superuser or Admin access required</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Settings className="h-8 w-8 text-blue-500" />
        <div>
          <h1 className="text-3xl font-bold">Analytics Administration</h1>
          <p className="text-muted-foreground">Update analytics data and system metrics</p>
        </div>
      </div>

      {/* Current Data Display */}
      <div className={`p-6 rounded-lg border ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h3 className="text-lg font-semibold mb-4">Current Analytics Data</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium mb-1">Total Users</label>
            <input
              type="number"
              value={currentData.totalUsers}
              onChange={(e) => setCurrentData({...currentData, totalUsers: parseInt(e.target.value)})}
              className={`w-full px-3 py-2 rounded-lg border ${
                theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
              }`}
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium mb-1">Active Users</label>
            <input
              type="number"
              value={currentData.activeUsers}
              onChange={(e) => setCurrentData({...currentData, activeUsers: parseInt(e.target.value)})}
              className={`w-full px-3 py-2 rounded-lg border ${
                theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
              }`}
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium mb-1">Total Revenue ($)</label>
            <input
              type="number"
              value={currentData.totalRevenue}
              onChange={(e) => setCurrentData({...currentData, totalRevenue: parseInt(e.target.value)})}
              className={`w-full px-3 py-2 rounded-lg border ${
                theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
              }`}
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium mb-1">Revenue Growth (%)</label>
            <input
              type="number"
              step="0.1"
              value={currentData.revenueGrowth}
              onChange={(e) => setCurrentData({...currentData, revenueGrowth: parseFloat(e.target.value)})}
              className={`w-full px-3 py-2 rounded-lg border ${
                theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
              }`}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium mb-1">Total Orders</label>
            <input
              type="number"
              value={currentData.totalOrders}
              onChange={(e) => setCurrentData({...currentData, totalOrders: parseInt(e.target.value)})}
              className={`w-full px-3 py-2 rounded-lg border ${
                theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
              }`}
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium mb-1">Orders This Month</label>
            <input
              type="number"
              value={currentData.ordersThisMonth}
              onChange={(e) => setCurrentData({...currentData, ordersThisMonth: parseInt(e.target.value)})}
              className={`w-full px-3 py-2 rounded-lg border ${
                theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
              }`}
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium mb-1">Inventory Value ($)</label>
            <input
              type="number"
              value={currentData.inventoryValue}
              onChange={(e) => setCurrentData({...currentData, inventoryValue: parseInt(e.target.value)})}
              className={`w-full px-3 py-2 rounded-lg border ${
                theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
              }`}
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium mb-1">Low Stock Items</label>
            <input
              type="number"
              value={currentData.lowStockItems}
              onChange={(e) => setCurrentData({...currentData, lowStockItems: parseInt(e.target.value)})}
              className={`w-full px-3 py-2 rounded-lg border ${
                theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
              }`}
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium mb-1">Production Efficiency (%)</label>
            <input
              type="number"
              step="0.1"
              value={currentData.productionEfficiency}
              onChange={(e) => setCurrentData({...currentData, productionEfficiency: parseFloat(e.target.value)})}
              className={`w-full px-3 py-2 rounded-lg border ${
                theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
              }`}
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium mb-1">System Uptime (%)</label>
            <input
              type="number"
              step="0.1"
              value={currentData.systemUptime}
              onChange={(e) => setCurrentData({...currentData, systemUptime: parseFloat(e.target.value)})}
              className={`w-full px-3 py-2 rounded-lg border ${
                theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
              }`}
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium mb-1">Error Rate (%)</label>
            <input
              type="number"
              step="0.1"
              value={currentData.errorRate}
              onChange={(e) => setCurrentData({...currentData, errorRate: parseFloat(e.target.value)})}
              className={`w-full px-3 py-2 rounded-lg border ${
                theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
              }`}
            />
          </div>
        </div>

        {/* Update Button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={updateAnalyticsData}
            disabled={loading}
            className={`px-6 py-3 rounded-lg font-medium text-white transition-colors ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : theme === 'dark'
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                <span>Updating...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                <span>Update Analytics Data</span>
              </div>
            )}
          </button>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mt-4 p-4 rounded-lg ${
            message.includes('success')
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center gap-3">
              {message.includes('success') ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-500" />
              )}
              <p className={`text-sm ${
                message.includes('success') ? 'text-green-700' : 'text-red-700'
              }`}>
                {message}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

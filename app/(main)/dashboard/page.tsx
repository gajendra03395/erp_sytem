'use client'

import { 
  Package, 
  Cpu, 
  Users, 
  TrendingUp, 
  Calendar,
  BarChart3,
  Activity,
  Zap,
  Target,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import { useTheme } from '@/components/ui/theme-provider'
import { useDashboard } from '@/lib/hooks/useDashboard'
import { BentoGrid, BentoBox } from '@/components/ui/bento-grid'
import { MetricCard } from '@/components/ui/metric-card'
import { ThemeToggle } from '@/components/ui/theme-toggle'

export default function DashboardPage() {
  const { theme } = useTheme()
  const { stats, loading } = useDashboard()

  const displayStats = stats ? [
    {
      title: 'Total Inventory',
      value: stats.totalInventory.toLocaleString(),
      icon: <Package className="h-6 w-6 text-cyan-400" />,
      change: '+12%',
      changeType: 'increase' as const,
      description: 'From last month',
      gradient: 'from-cyan-500 to-blue-500',
      glow: 'shadow-cyan-500/25'
    },
    {
      title: 'Active Machines',
      value: stats.activeMachines.toString(),
      icon: <Cpu className="h-6 w-6 text-purple-400" />,
      change: '+8%',
      changeType: 'increase' as const,
      description: 'From last week',
      gradient: 'from-purple-500 to-pink-500',
      glow: 'shadow-purple-500/25'
    },
    {
      title: 'Employees on Shift',
      value: stats.employeesOnShift.toString(),
      icon: <Users className="h-6 w-6 text-green-400" />,
      change: '+5%',
      changeType: 'increase' as const,
      description: 'From last week',
      gradient: 'from-green-500 to-emerald-500',
      glow: 'shadow-green-500/25'
    },
    {
      title: 'QC Pass Rate',
      value: stats.qcPassRate,
      icon: <BarChart3 className="h-6 w-6 text-orange-400" />,
      change: '+3%',
      changeType: 'increase' as const,
      description: 'From last week',
      gradient: 'from-orange-500 to-red-500',
      glow: 'shadow-orange-500/25'
    },
    {
      title: 'Attendance Rate',
      value: stats.attendanceRate,
      icon: <Calendar className="h-6 w-6 text-indigo-400" />,
      change: '+2%',
      changeType: 'increase' as const,
      description: 'From last week',
      gradient: 'from-indigo-500 to-purple-500',
      glow: 'shadow-indigo-500/25'
    }
  ] : []

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-gradient-to-br from-slate-50 via-white to-slate-50'}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="mb-4 sm:mb-0">
          <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 ${theme === 'dark' ? 'bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent' : 'bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent'}`}>
            Dashboard
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Real-time overview of your manufacturing operations
          </p>
        </div>
        <ThemeToggle />
      </div>

      {/* Metrics Grid */}
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
          {displayStats.map((stat, index) => (
            <div key={index} className={`relative group ${theme === 'dark' ? 'bg-slate-900/50 backdrop-blur-sm border border-slate-800/50' : 'bg-white/80 backdrop-blur-sm border border-slate-200/50'} rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl ${stat.glow}`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-xl sm:rounded-2xl group-hover:opacity-20 transition-opacity duration-300`}></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-br ${stat.gradient} bg-opacity-20`}>
                    {stat.icon}
                  </div>
                  <div className="flex items-center space-x-1 text-green-400 text-xs sm:text-sm">
                    <ArrowUp className="h-3 w-3" />
                    <span>{stat.change}</span>
                  </div>
                </div>
                <div className={`text-lg sm:text-xl lg:text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'} mb-1`}>
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  {stat.title}
                </div>
                <div className="text-xs text-muted-foreground mt-1 sm:mt-2">
                  {stat.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {/* Production Overview */}
          <div className={`relative group ${theme === 'dark' ? 'bg-slate-900/50 backdrop-blur-sm border border-slate-800/50' : 'bg-white/80 backdrop-blur-sm border border-slate-200/50'} rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl lg:col-span-2`}>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 opacity-10 rounded-xl sm:rounded-2xl group-hover:opacity-20 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div>
                  <h3 className={`text-lg sm:text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Production Overview</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm">Current production status and efficiency</p>
                </div>
                <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 bg-opacity-20">
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-muted-foreground">Efficiency Rate</span>
                  <span className="text-lg sm:text-2xl font-bold text-blue-400">94.2%</span>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-2 sm:h-3">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 sm:h-3 rounded-full" style={{ width: '94.2%' }}></div>
                </div>
                <div className="text-xs sm:text-sm text-green-400 mt-2 flex items-center">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  +2.3% from last week
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className={`relative group ${theme === 'dark' ? 'bg-slate-900/50 backdrop-blur-sm border border-slate-800/50' : 'bg-white/80 backdrop-blur-sm border border-slate-200/50'} rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl`}>
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 opacity-10 rounded-xl sm:rounded-2xl group-hover:opacity-20 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div>
                  <h3 className={`text-lg sm:text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Quick Actions</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm">Common tasks and shortcuts</p>
                </div>
                <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 bg-opacity-20">
                  <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-green-400" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <button className={`p-3 sm:p-4 ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50' : 'bg-slate-100/50 border-slate-200/50 hover:bg-slate-200/50'} border rounded-lg transition-all duration-200 hover:scale-105`}>
                  <Package className="h-4 w-4 sm:h-5 sm:w-5 mb-1 sm:mb-2 text-cyan-400" />
                  <span className="text-xs sm:text-sm">Add Inventory</span>
                </button>
                <button className={`p-3 sm:p-4 ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50' : 'bg-slate-100/50 border-slate-200/50 hover:bg-slate-200/50'} border rounded-lg transition-all duration-200 hover:scale-105`}>
                  <Cpu className="h-4 w-4 sm:h-5 sm:w-5 mb-1 sm:mb-2 text-purple-400" />
                  <span className="text-xs sm:text-sm">Schedule Maintenance</span>
                </button>
                <button className={`p-3 sm:p-4 ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50' : 'bg-slate-100/50 border-slate-200/50 hover:bg-slate-200/50'} border rounded-lg transition-all duration-200 hover:scale-105`}>
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 mb-1 sm:mb-2 text-green-400" />
                  <span className="text-xs sm:text-sm">Manage Shift</span>
                </button>
                <button className={`p-3 sm:p-4 ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50' : 'bg-slate-100/50 border-slate-200/50 hover:bg-slate-200/50'} border rounded-lg transition-all duration-200 hover:scale-105`}>
                  <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 mb-1 sm:mb-2 text-orange-400" />
                  <span className="text-xs sm:text-sm">View Reports</span>
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className={`relative group ${theme === 'dark' ? 'bg-slate-900/50 backdrop-blur-sm border border-slate-800/50' : 'bg-white/80 backdrop-blur-sm border border-slate-200/50'} rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl lg:col-span-2`}>
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500 opacity-10 rounded-xl sm:rounded-2xl group-hover:opacity-20 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div>
                  <h3 className={`text-lg sm:text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Recent Activity</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm">Latest system events and updates</p>
                </div>
                <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 bg-opacity-20">
                  <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-orange-400" />
                </div>
              </div>
              <div className="space-y-2 sm:space-y-3">
                <div className={`p-3 sm:p-4 ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-100/50 border-slate-200/50'} border rounded-lg`}>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm font-medium text-foreground">Production Order #1234</p>
                      <p className="text-xs text-muted-foreground">Completed successfully</p>
                    </div>
                  </div>
                </div>
                <div className={`p-3 sm:p-4 ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-100/50 border-slate-200/50'} border rounded-lg`}>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm font-medium text-foreground">Quality Check Passed</p>
                      <p className="text-xs text-muted-foreground">Batch #5678 approved</p>
                    </div>
                  </div>
                </div>
                <div className={`p-3 sm:p-4 ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-100/50 border-slate-200/50'} border rounded-lg`}>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm font-medium text-foreground">Maintenance Scheduled</p>
                      <p className="text-xs text-muted-foreground">Machine #A1 maintenance tomorrow</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

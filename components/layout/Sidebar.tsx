'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  Users,
  Cpu,
  ClipboardCheck,
  CalendarCheck,
  BarChart3,
  LogOut,
  Menu,
  X,
  User,
  Shield,
  DollarSign,
  Zap,
  Building2,
  Settings,
  TrendingUp,
  MessageSquare,
} from 'lucide-react'
import { useState } from 'react'
import { useTheme } from '@/components/providers/ThemeProvider'
import { useAuth } from '@/components/providers/AuthProvider'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { canViewAttendance } from '@/lib/auth/permissions'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Analytics', href: '/analytics', icon: BarChart3, permission: 'analytics' as const },
  { name: 'Financial Management', href: '/financial-management', icon: DollarSign },
  { name: 'Inventory', href: '/inventory', icon: Package },
  { name: 'Employees', href: '/employees', icon: Users },
  { name: 'Company Chat', href: '/chat', icon: MessageSquare },
  { name: 'Machines', href: '/machines', icon: Cpu },
  { name: 'Quality Control', href: '/quality-control', icon: ClipboardCheck },
  { name: 'Attendance', href: '/attendance', icon: CalendarCheck, permission: 'attendance' as const },
  { name: 'Production', href: '/production', icon: Cpu },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
]

const adminNavigation = [
  { name: 'Admin: Credentials', href: '/admin/employees', icon: Shield },
]

const superuserNavigation = [
  { name: '⚡ System Settings', href: '/admin/system', icon: Shield },
  { name: '📊 System Logs', href: '/admin/logs', icon: Shield },
  { name: '💾 Backup Data', href: '/admin/backup', icon: Shield },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const { theme } = useTheme()
  const { userName, userEmail, employeeId, logout, currentRole } = useAuth()

  const isActive = (href: string) => pathname === href

  const baseClasses = "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:scale-105"
  const activeClasses = "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25"
  const inactiveClasses = theme === 'dark'
    ? "text-gray-300 hover:bg-slate-800/50 hover:text-white"
    : "text-gray-700 hover:bg-gray-100/80 hover:text-gray-900"

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-slate-900/80 backdrop-blur-sm border border-slate-700/50' : 'bg-white/80 backdrop-blur-sm border border-slate-200/50'} shadow-lg`}
        >
          {isMobileOpen ? <X size={24} className="text-blue-400" /> : <Menu size={24} className="text-blue-400" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen w-72 z-40
          transition-transform duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${theme === 'dark' ? 'bg-slate-900/50 backdrop-blur-sm border border-slate-800/50' : 'bg-white/80 backdrop-blur-sm border border-slate-200/50'}
          flex flex-col
        `}
      >
        {/* Logo/Header */}
        <div className={`p-6 border-b ${theme === 'dark' ? 'border-slate-800/50' : 'border-slate-200/50'}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 bg-opacity-20 shadow-lg shadow-blue-500/25`}>
              <Building2 size={28} className="text-blue-400" />
            </div>
            <div className={`p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 bg-opacity-20 shadow-lg shadow-purple-500/25`}>
              <Zap size={28} className="text-purple-400" />
            </div>
          </div>
          <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent' : 'bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent'}`}>
            Manufacturing ERP
          </h1>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
            Advanced Production System
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            if (item.permission === 'attendance' && !canViewAttendance(currentRole)) {
              return null
            }
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}
              >
                <div className={`p-2 rounded-lg ${active ? 'bg-white/20' : theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-100/50'}`}>
                  <Icon size={18} className={active ? 'text-white' : theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} />
                </div>
                <span className="font-medium">{item.name}</span>
                {active && (
                  <div className="ml-auto">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                )}
              </Link>
            )
          })}
          
          {/* Admin Section */}
          {(currentRole === 'ADMIN' || currentRole === 'SUPERUSER') && (
            <>
              <div className={`mt-4 pt-4 border-t ${
                theme === 'dark' ? 'border-industrial-dark-border' : 'border-gray-300'
              }`}>
                <p className={`text-xs font-semibold uppercase tracking-wide mb-3 px-2 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {currentRole === 'SUPERUSER' ? '⚡ Superuser Control' : 'Administration'}
                </p>
                {adminNavigation.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.href)
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  )
                })}
                {currentRole === 'SUPERUSER' && superuserNavigation.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.href)
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  )
                })}
              </div>
            </>
          )}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-industrial-dark-border dark:border-industrial-dark-border border-industrial-light-border space-y-3">
          {/* User Info */}
          <div className={`
            p-3 rounded-lg
            ${theme === 'dark'
              ? 'bg-industrial-dark-surface border border-industrial-dark-border'
              : 'bg-gray-100 border border-gray-300'
            }
          `}>
            <div className="flex items-center gap-2 mb-2">
              <div className={`
                p-2 rounded
                ${theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100'}
              `}>
                <User size={16} className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-medium truncate ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {userName || 'User'}
                </p>
                <p className={`text-xs truncate ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  {employeeId || userEmail || 'user@erp.com'}
                </p>
              </div>
            </div>
          </div>

          <ThemeToggle />
          <button
            onClick={logout}
            className={`${baseClasses} w-full ${inactiveClasses}`}
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  )
}

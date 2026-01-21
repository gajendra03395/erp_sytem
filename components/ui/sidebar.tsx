'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Settings, 
  BarChart3, 
  Factory, 
  ShoppingCart, 
  FileText, 
  Wrench, 
  Database,
  TrendingUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const navigation = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    color: 'text-slate-600 dark:text-slate-400',
  },
  {
    title: 'Inventory',
    href: '/inventory',
    icon: Package,
    color: 'text-blue-600 dark:text-blue-400',
  },
  {
    title: 'Production',
    href: '/production',
    icon: Factory,
    color: 'text-green-600 dark:text-green-400',
  },
  {
    title: 'Machines',
    href: '/machines',
    icon: Wrench,
    color: 'text-orange-600 dark:text-orange-400',
  },
  {
    title: 'Quality Control',
    href: '/quality-control',
    icon: BarChart3,
    color: 'text-purple-600 dark:text-purple-400',
  },
  {
    title: 'Employees',
    href: '/employees',
    icon: Users,
    color: 'text-indigo-600 dark:text-indigo-400',
  },
  {
    title: 'Purchase Orders',
    href: '/purchase',
    icon: ShoppingCart,
    color: 'text-pink-600 dark:text-pink-400',
  },
  {
    title: 'Invoices',
    href: '/invoice',
    icon: FileText,
    color: 'text-cyan-600 dark:text-cyan-400',
  },
  {
    title: 'Assets',
    href: '/assets',
    icon: Database,
    color: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    title: 'Reports',
    href: '/reports',
    icon: TrendingUp,
    color: 'text-amber-600 dark:text-amber-400',
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
    color: 'text-gray-600 dark:text-gray-400',
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = React.useState(false)

  return (
    <div className={cn(
      "flex flex-col h-screen bg-card border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-accent transition-colors duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className={cn(
          "font-bold text-lg transition-all duration-300",
          isCollapsed ? "hidden" : "block"
        )}>
          ERP System
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-accent transition-colors"
        >
          <svg
            className="h-4 w-4 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            style={{ transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7 7" />
          </svg>
        </Button>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                "hover:bg-accent hover:scale-105",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5", item.color)} />
              {!isCollapsed && (
                <span className="font-medium">{item.title}</span>
              )}
            </Link>
          )
        })}
      </nav>
      
      <div className="mt-auto p-4 border-t border-border">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          {!isCollapsed && <span>System Online</span>}
        </div>
      </div>
    </div>
  )
}

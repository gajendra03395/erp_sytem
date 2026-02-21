'use client'

import { Sidebar } from '@/components/layout/Sidebar'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigateTo = (path: string) => {
    router.push(path)
    setIsMobileMenuOpen(false)
  }

  const modules = [
    { name: 'Dashboard', path: '/dashboard', icon: '🏠' },
    { name: 'Analytics', path: '/analytics', icon: '📊' },
    { name: 'Inventory', path: '/inventory', icon: '📦' },
    { name: 'Production', path: '/production', icon: '⚙️' },
    { name: 'Workload', path: '/workload', icon: '⚡' },
    { name: 'Chat', path: '/chat', icon: '💬' },
    { name: 'Employees', path: '/employees', icon: '👥' },
    { name: 'Reports', path: '/reports', icon: '📋' },
    { name: 'Quality', path: '/quality-control', icon: '✅' },
    { name: 'Machines', path: '/machines', icon: '🏭' },
    { name: 'Attendance', path: '/attendance', icon: '⏰' },
    { name: 'Export', path: '/export', icon: '📤' },
    { name: 'Import', path: '/import', icon: '📥' },
    { name: 'Automation', path: '/automation', icon: '🤖' },
    { name: 'Notifications', path: '/notifications', icon: '🔔' },
  ]

  return (
    <AuthProvider>
      <div className="flex h-screen relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"></div>
          <div className="absolute top-20 left-20 w-96 h-96 rounded-full bg-blue-500/5 blur-3xl animate-pulse hidden md:block"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-purple-500/5 blur-3xl animate-pulse delay-1000 hidden md:block"></div>
          <div className="absolute top-1/2 left-1/3 w-80 h-80 rounded-full bg-cyan-500/3 blur-3xl animate-pulse delay-500 hidden md:block"></div>
        </div>
        
        {/* Mobile: Full screen content with mobile sidebar */}
        <div className="md:hidden flex h-full w-full">
          {/* Mobile Sidebar */}
          <div className="w-12 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 flex flex-col items-center py-4 space-y-3 z-20">
            <div className="text-gray-800 dark:text-white text-xs font-bold mb-2">ERP</div>
            
            {/* Hamburger Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300"
              title="Menu"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          
          {/* Mobile Main Content */}
          <div className="flex-1 overflow-y-auto relative z-10">
            <div className="p-4">
              {children}
            </div>
          </div>
          
          {/* Mobile Menu Overlay */}
          {isMobileMenuOpen && (
            <div className="fixed inset-0 z-30 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}>
              <div className="absolute left-12 top-0 h-full w-64 bg-white dark:bg-slate-800 shadow-xl" onClick={(e) => e.stopPropagation()}>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white">Menu</h2>
                    <button 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {modules.map((module, index) => (
                      <button
                        key={index}
                        onClick={() => navigateTo(module.path)}
                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 text-left transition-colors"
                      >
                        <span className="text-lg">{module.icon}</span>
                        <span className="text-sm font-medium">{module.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Desktop: Sidebar + Main Content */}
        <div className="hidden md:flex h-full w-full">
          <Sidebar />
          <main className="flex-1 overflow-y-auto relative z-10">
            <div className="p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthProvider>
  )
}

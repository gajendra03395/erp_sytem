'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, Zap, Shield, Eye, EyeOff, Loader2, AlertCircle, Mail, User } from 'lucide-react'
import { useAuth } from '@/components/providers/AuthProvider'
import { useTheme } from '@/components/providers/ThemeProvider'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [loginType, setLoginType] = useState<'email' | 'employee'>('email')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    employeeId: '',
    password: ''
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const loginData = loginType === 'email' 
        ? { email: formData.email, password: formData.password }
        : { employeeId: formData.employeeId, password: formData.password }

      await login(loginData)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Login Container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Glass Morphism Card */}
          <div className={`backdrop-blur-xl rounded-3xl border ${
            theme === 'dark' 
              ? 'bg-slate-900/50 border-slate-800/50' 
              : 'bg-white/80 border-slate-200/50'
          } shadow-2xl p-8`}>
            
            {/* Logo and Title */}
            <div className="text-center mb-8">
              <div className="flex justify-center items-center gap-3 mb-4">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 bg-opacity-20">
                  <Building2 className="h-8 w-8 text-blue-400" />
                </div>
                <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 bg-opacity-20">
                  <Zap className="h-8 w-8 text-purple-400" />
                </div>
                <div className="p-3 rounded-2xl bg-gradient-to-br from-pink-500 to-orange-500 bg-opacity-20">
                  <Shield className="h-8 w-8 text-pink-400" />
                </div>
              </div>
              <h1 className={`text-3xl font-bold mb-2 ${
                theme === 'dark' 
                  ? 'bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent'
                  : 'bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent'
              }`}>
                ERP System
              </h1>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Advanced Enterprise Resource Planning
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className={`mb-6 p-4 rounded-xl border ${
                theme === 'dark'
                  ? 'bg-red-900/20 border-red-800/50 text-red-400'
                  : 'bg-red-50 border-red-200 text-red-600'
              }`}>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  <span className="text-sm">{error}</span>
                </div>
              </div>
            )}

            {/* Login Type Toggle */}
            <div className="mb-6">
              <div className={`flex rounded-xl border ${
                theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
              } p-1`}>
                <button
                  onClick={() => setLoginType('email')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    loginType === 'email'
                      ? theme === 'dark'
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : theme === 'dark'
                        ? 'text-gray-400 hover:text-white'
                        : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Mail className="h-4 w-4" />
                  Email
                </button>
                <button
                  onClick={() => setLoginType('employee')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    loginType === 'employee'
                      ? theme === 'dark'
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : theme === 'dark'
                        ? 'text-gray-400 hover:text-white'
                        : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <User className="h-4 w-4" />
                  Employee ID
                </button>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email/Employee ID Input */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {loginType === 'email' ? 'Email Address' : 'Employee ID'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {loginType === 'email' ? (
                      <Mail className="h-5 w-5 text-gray-400" />
                    ) : (
                      <User className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <input
                    type={loginType === 'email' ? 'email' : 'text'}
                    value={loginType === 'email' ? formData.email : formData.employeeId}
                    onChange={(e) => setFormData({
                      ...formData,
                      [loginType === 'email' ? 'email' : 'employeeId']: e.target.value
                    })}
                    className={`block w-full pl-10 pr-3 py-3 rounded-xl border ${
                      theme === 'dark'
                        ? 'bg-slate-800/50 border-slate-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500'
                        : 'bg-white/80 border-slate-200 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500'
                    } backdrop-blur-sm focus:outline-none focus:ring-2 transition-all duration-200`}
                    placeholder={loginType === 'email' ? 'Enter your email' : 'Enter your employee ID'}
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Shield className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={`block w-full pl-10 pr-10 py-3 rounded-xl border ${
                      theme === 'dark'
                        ? 'bg-slate-800/50 border-slate-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500'
                        : 'bg-white/80 border-slate-200 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500'
                    } backdrop-blur-sm focus:outline-none focus:ring-2 transition-all duration-200`}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : theme === 'dark'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <Zap className="h-5 w-5" />
                    Sign In
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Secure access to your ERP dashboard
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.3; }
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}

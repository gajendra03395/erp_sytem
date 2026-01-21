'use client'

import { useState, useEffect } from 'react'
import { Users, Plus, Edit, Trash2, Shield, Clock, Building2, Loader2, AlertCircle, Search, Filter, TrendingUp, UserCheck, Calendar, Award, CheckSquare, Square } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'
import { useAuth } from '@/components/providers/AuthProvider'
import { canEdit, canDelete } from '@/lib/auth/permissions'
import { useEmployees } from '@/lib/hooks/useEmployees'
import { useAttendance } from '@/lib/hooks/useAttendance'
import { BulkImportButton } from '@/components/ui/BulkImportButton'
import type { EmployeeRole, EmployeeShift, Employee } from '@/types/employee'

export default function EmployeesPage() {
  const { theme } = useTheme()
  const { currentRole } = useAuth()
  const { employees: hookEmployees, loading, error, addEmployee, updateEmployee, deleteEmployee, refetch } = useEmployees()
  const { records: attendanceRecords } = useAttendance()
  const [employees, setEmployees] = useState<typeof hookEmployees>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Employee>>({})
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([])
  const [newEmployee, setNewEmployee] = useState<Partial<Employee>>({
    role: 'OPERATOR',
    shift: 'Day',
    status: 'active',
    employee_id: '',
    department: 'production', // Set default department
  })

  useEffect(() => {
    setEmployees(hookEmployees)
  }, [hookEmployees])

  const handleAddEmployee = async () => {
    console.log('=== HANDLE ADD EMPLOYEE START ===')
    console.log('newEmployee state:', newEmployee)
    console.log('Type of newEmployee:', typeof newEmployee)
    console.log('Keys in newEmployee:', Object.keys(newEmployee || {}))
    
    const validation = {
      name: !!newEmployee.name,
      email: !!newEmployee.email,
      employee_id: !!newEmployee.employee_id,
      department: !!newEmployee.department,
      role: !!newEmployee.role,
      shift: !!newEmployee.shift
    }
    console.log('Validation check:', validation)
    console.log('All validations pass:', Object.values(validation).every(Boolean))
    
    if (
      newEmployee.name &&
      newEmployee.email &&
      newEmployee.employee_id &&
      newEmployee.department &&
      newEmployee.role &&
      newEmployee.shift
    ) {
      try {
        console.log('✅ Validation passed, calling addEmployee...')
        const result = await addEmployee(newEmployee as any)
        console.log('✅ addEmployee completed successfully:', result)
        setNewEmployee({
          role: 'OPERATOR',
          shift: 'Day',
          status: 'active',
          employee_id: '',
          department: 'production',
        })
        setShowAddForm(false)
      } catch (error) {
        console.error('❌ Failed to add employee:', error)
        alert(`Error adding employee: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    } else {
      console.log('❌ Validation failed - missing required fields')
      const missingFields = []
      if (!newEmployee.name) missingFields.push('Name')
      if (!newEmployee.email) missingFields.push('Email')
      if (!newEmployee.employee_id) missingFields.push('Employee ID')
      if (!newEmployee.department) missingFields.push('Department')
      if (!newEmployee.role) missingFields.push('Role')
      if (!newEmployee.shift) missingFields.push('Shift')
      alert(`Please fill in all required fields. Missing: ${missingFields.join(', ')}`)
    }
    console.log('=== HANDLE ADD EMPLOYEE END ===')
  }

  const attendanceSummary = employees.reduce((acc, employee) => {
    const records = attendanceRecords.filter(record => record.employee_id === employee.employee_id)
    acc[employee.employee_id] = {
      present: records.filter(record => record.status === 'present').length,
      absent: records.filter(record => record.status === 'absent').length,
      late: records.filter(record => record.status === 'late').length,
    }
    return acc
  }, {} as Record<string, { present: number; absent: number; late: number }>)

  const handleEdit = (id: string) => {
    const employee = employees.find((e) => e.id === id)
    if (employee) {
      setEditForm(employee)
      setEditingId(id)
      setShowAddForm(true)
    }
  }

  const handleUpdateEmployee = async () => {
    if (editingId && editForm.name && editForm.email && editForm.employee_id) {
      try {
        await updateEmployee(editingId, editForm)
        setEditForm({})
        setEditingId(null)
        setShowAddForm(false)
      } catch (error) {
        console.error('Failed to update employee:', error)
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      try {
        await deleteEmployee(id)
      } catch (error) {
        console.error('Failed to delete employee:', error)
      }
    }
  }

  const handleSelectEmployee = (id: string) => {
    setSelectedEmployees(prev => 
      prev.includes(id) 
        ? prev.filter(empId => empId !== id)
        : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedEmployees.length === employees.length) {
      setSelectedEmployees([])
    } else {
      setSelectedEmployees(employees.map(emp => emp.id))
    }
  }

  const handleBulkDelete = async () => {
    if (selectedEmployees.length === 0) {
      alert('Please select employees to delete')
      return
    }
    
    if (confirm(`Are you sure you want to delete ${selectedEmployees.length} employee(s)?`)) {
      try {
        await Promise.all(selectedEmployees.map(id => deleteEmployee(id)))
        setSelectedEmployees([])
      } catch (error) {
        console.error('Failed to delete employees:', error)
      }
    }
  }

  if (loading) {
    return (
      <div className={`
        min-h-screen p-6 lg:p-8 flex items-center justify-center
        ${theme === 'dark' ? 'bg-industrial-dark-bg' : 'bg-industrial-light-bg'}
      `}>
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4" size={48} />
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Loading employees...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`
        min-h-screen p-6 lg:p-8 flex items-center justify-center
        ${theme === 'dark' ? 'bg-industrial-dark-bg' : 'bg-industrial-light-bg'}
      `}>
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
          <p className={theme === 'dark' ? 'text-red-400' : 'text-red-600'}>{error}</p>
        </div>
      </div>
    )
  }

  const getRoleBadge = (role: EmployeeRole) => {
    const baseClasses = 'px-2 py-1 rounded text-xs font-medium flex items-center gap-1'
    switch (role) {
      case 'ADMIN':
        return `${baseClasses} ${theme === 'dark' ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-800'}`
      case 'SUPERVISOR':
        return `${baseClasses} ${theme === 'dark' ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-800'}`
      default:
        return `${baseClasses} ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`
    }
  }

  const getDepartmentBadge = (department: string) => {
    const baseClasses = 'px-2 py-1 rounded text-xs font-medium'
    const deptColors: Record<string, string> = {
      production: theme === 'dark' ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800',
      qc: theme === 'dark' ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-800',
      maintenance: theme === 'dark' ? 'bg-orange-900/30 text-orange-400' : 'bg-orange-100 text-orange-800',
      admin: theme === 'dark' ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-100 text-indigo-800',
    }
    return `${baseClasses} ${deptColors[department] || 'bg-gray-100 text-gray-800'}`
  }

  return (
    <div className="min-h-screen">
      {/* Premium Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className={`text-4xl font-bold mb-2 ${theme === 'dark' ? 'bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent' : 'bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent'}`}>
              Employee Directory
            </h1>
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Advanced Workforce Management System
            </p>
          </div>
          {currentRole && canEdit(currentRole, 'employees') && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  refetch()
                }}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                    : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                }`}
              >
                <span>🔄 Refresh</span>
              </button>
              <BulkImportButton
                module="employees"
                onComplete={refetch}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                }`}
              />
              {selectedEmployees.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    theme === 'dark'
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                      : 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                  }`}
                >
                  <Trash2 size={20} />
                  Delete Selected ({selectedEmployees.length})
                </button>
              )}
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                    : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                }`}
              >
                <Plus size={20} />
                Add Employee
              </button>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className={`relative group ${theme === 'dark' ? 'bg-slate-900/50 backdrop-blur-sm border border-slate-800/50' : 'bg-white/80 backdrop-blur-sm border border-slate-200/50'} rounded-2xl p-6 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl`}>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 opacity-10 rounded-2xl group-hover:opacity-20 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 bg-opacity-20`}>
                  <Users className="h-6 w-6 text-blue-400" />
                </div>
                <div className="flex items-center space-x-1 text-green-400 text-sm">
                  <TrendingUp className="h-3 w-3" />
                  <span>+8%</span>
                </div>
              </div>
              <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'} mb-1`}>
                {employees.length}
              </div>
              <div className="text-sm text-muted-foreground">
                Total Employees
              </div>
            </div>
          </div>

          <div className={`relative group ${theme === 'dark' ? 'bg-slate-900/50 backdrop-blur-sm border border-slate-800/50' : 'bg-white/80 backdrop-blur-sm border border-slate-200/50'} rounded-2xl p-6 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl`}>
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 opacity-10 rounded-2xl group-hover:opacity-20 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 bg-opacity-20`}>
                  <UserCheck className="h-6 w-6 text-green-400" />
                </div>
                <div className="flex items-center space-x-1 text-green-400 text-sm">
                  <TrendingUp className="h-3 w-3" />
                  <span>+12%</span>
                </div>
              </div>
              <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'} mb-1`}>
                {employees.filter(emp => emp.status === 'active').length}
              </div>
              <div className="text-sm text-muted-foreground">
                Active Staff
              </div>
            </div>
          </div>

          <div className={`relative group ${theme === 'dark' ? 'bg-slate-900/50 backdrop-blur-sm border border-slate-800/50' : 'bg-white/80 backdrop-blur-sm border border-slate-200/50'} rounded-2xl p-6 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl`}>
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500 opacity-10 rounded-2xl group-hover:opacity-20 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 bg-opacity-20`}>
                  <Calendar className="h-6 w-6 text-orange-400" />
                </div>
                <div className="flex items-center space-x-1 text-green-400 text-sm">
                  <TrendingUp className="h-3 w-3" />
                  <span>+5%</span>
                </div>
              </div>
              <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'} mb-1`}>
                {employees.filter(emp => emp.shift === 'Day').length}
              </div>
              <div className="text-sm text-muted-foreground">
                Day Shift
              </div>
            </div>
          </div>

          <div className={`relative group ${theme === 'dark' ? 'bg-slate-900/50 backdrop-blur-sm border border-slate-800/50' : 'bg-white/80 backdrop-blur-sm border border-slate-200/50'} rounded-2xl p-6 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl`}>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-10 rounded-2xl group-hover:opacity-20 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 bg-opacity-20`}>
                  <Award className="h-6 w-6 text-purple-400" />
                </div>
                <div className="flex items-center space-x-1 text-green-400 text-sm">
                  <TrendingUp className="h-3 w-3" />
                  <span>+15%</span>
                </div>
              </div>
              <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'} mb-1`}>
                {employees.filter(emp => emp.role === 'OPERATOR').length}
              </div>
              <div className="text-sm text-muted-foreground">
                Operators
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Search employees..."
              className={`w-full pl-10 pr-4 py-3 rounded-xl border ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700/50 text-white placeholder-gray-500' : 'bg-white/80 border-slate-200/50 text-gray-800 placeholder-gray-400'} backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
            />
          </div>
          <button className={`flex items-center gap-2 px-4 py-3 rounded-xl border ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700/50 text-gray-300 hover:bg-slate-700/50' : 'bg-white/80 border-slate-200/50 text-gray-700 hover:bg-gray-100/80'} backdrop-blur-sm transition-all duration-200`}>
            <Filter className="h-5 w-5" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Add Employee Form */}
      {showAddForm && canEdit(currentRole, 'employees') && (
        <div
          className={`
            rounded-lg border p-6 mb-6
            ${theme === 'dark'
              ? 'bg-industrial-dark-surface border-industrial-dark-border'
              : 'bg-industrial-light-surface border-industrial-light-border'
            }
          `}
        >
          <h3
            className={`
              text-xl font-semibold mb-4
              ${theme === 'dark' ? 'text-industrial-dark-text' : 'text-industrial-light-text'}
            `}
          >
            Add New Employee
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className={`
                  block text-sm font-medium mb-2
                  ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                `}
              >
                Employee ID
              </label>
              <input
                type="text"
                value={newEmployee.employee_id || ''}
                onChange={(e) => setNewEmployee({ ...newEmployee, employee_id: e.target.value })}
                className={`
                  w-full px-3 py-2 rounded-lg border
                  ${theme === 'dark'
                    ? 'bg-industrial-dark-bg border-industrial-dark-border text-industrial-dark-text'
                    : 'bg-white border-industrial-light-border text-industrial-light-text'
                  }
                `}
              />
            </div>
            <div>
              <label
                className={`
                  block text-sm font-medium mb-2
                  ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                `}
              >
                Name
              </label>
              <input
                type="text"
                value={newEmployee.name || ''}
                onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                className={`
                  w-full px-3 py-2 rounded-lg border
                  ${theme === 'dark'
                    ? 'bg-industrial-dark-bg border-industrial-dark-border text-industrial-dark-text'
                    : 'bg-white border-industrial-light-border text-industrial-light-text'
                  }
                `}
              />
            </div>
            <div>
              <label
                className={`
                  block text-sm font-medium mb-2
                  ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                `}
              >
                Email
              </label>
              <input
                type="email"
                value={newEmployee.email || ''}
                onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                className={`
                  w-full px-3 py-2 rounded-lg border
                  ${theme === 'dark'
                    ? 'bg-industrial-dark-bg border-industrial-dark-border text-industrial-dark-text'
                    : 'bg-white border-industrial-light-border text-industrial-light-text'
                  }
                `}
              />
            </div>
            <div>
              <label
                className={`
                  block text-sm font-medium mb-2
                  ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                `}
              >
                Phone
              </label>
              <input
                type="tel"
                value={newEmployee.phone || ''}
                onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                className={`
                  w-full px-3 py-2 rounded-lg border
                  ${theme === 'dark'
                    ? 'bg-industrial-dark-bg border-industrial-dark-border text-industrial-dark-text'
                    : 'bg-white border-industrial-light-border text-industrial-light-text'
                  }
                `}
              />
            </div>
            <div>
              <label
                className={`
                  block text-sm font-medium mb-2
                  ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                `}
              >
                Password (Auto-generated)
              </label>
              <input
                type="text"
                value="Will be generated automatically"
                disabled
                className={`
                  w-full px-3 py-2 rounded-lg border bg-gray-100 text-gray-500
                  ${theme === 'dark'
                    ? 'bg-gray-800 border-gray-600 text-gray-400'
                    : 'bg-gray-100 border-gray-300 text-gray-500'
                  }
                `}
              />
              <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                A secure password will be generated and shown after adding the employee.
              </p>
            </div>
            <div>
              <label
                className={`
                  block text-sm font-medium mb-2
                  ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                `}
              >
                Department
              </label>
              <select
                value={newEmployee.department || ''}
                onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value as any })}
                className={`
                  w-full px-3 py-2 rounded-lg border
                  ${theme === 'dark'
                    ? 'bg-industrial-dark-bg border-industrial-dark-border text-industrial-dark-text'
                    : 'bg-white border-industrial-light-border text-industrial-light-text'
                  }
                `}
              >
                <option value="">Select Department</option>
                <option value="production">Production</option>
                <option value="qc">Quality Control</option>
                <option value="maintenance">Maintenance</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label
                className={`
                  block text-sm font-medium mb-2
                  ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                `}
              >
                Role
              </label>
              <select
                value={newEmployee.role || ''}
                onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value as EmployeeRole })}
                className={`
                  w-full px-3 py-2 rounded-lg border
                  ${theme === 'dark'
                    ? 'bg-industrial-dark-bg border-industrial-dark-border text-industrial-dark-text'
                    : 'bg-white border-industrial-light-border text-industrial-light-text'
                  }
                `}
              >
                <option value="OPERATOR">OPERATOR</option>
                <option value="SUPERVISOR">SUPERVISOR</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
            <div>
              <label
                className={`
                  block text-sm font-medium mb-2
                  ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                `}
              >
                Shift
              </label>
              <select
                value={newEmployee.shift || ''}
                onChange={(e) => setNewEmployee({ ...newEmployee, shift: e.target.value as EmployeeShift })}
                className={`
                  w-full px-3 py-2 rounded-lg border
                  ${theme === 'dark'
                    ? 'bg-industrial-dark-bg border-industrial-dark-border text-industrial-dark-text'
                    : 'bg-white border-industrial-light-border text-industrial-light-text'
                  }
                `}
              >
                <option value="Day">Day</option>
                <option value="Night">Night</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleAddEmployee}
              className={`
                px-4 py-2 rounded-lg font-medium transition-colors
                ${theme === 'dark'
                  ? 'bg-industrial-dark-accent hover:bg-industrial-dark-accent-hover text-white'
                  : 'bg-industrial-light-accent hover:bg-industrial-light-accent-hover text-white'
                }
              `}
            >
              Add Employee
            </button>
            <button
              onClick={() => {
                setShowAddForm(false)
                setNewEmployee({ role: 'OPERATOR', shift: 'Day', status: 'active', employee_id: '', department: 'production' })
              }}
              className={`
                px-4 py-2 rounded-lg font-medium transition-colors border
                ${theme === 'dark'
                  ? 'border-industrial-dark-border text-industrial-dark-text hover:bg-industrial-dark-surface'
                  : 'border-industrial-light-border text-industrial-light-text hover:bg-gray-100'
                }
              `}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Employees Table */}
      <div
        className={`
          rounded-lg border overflow-hidden
          ${theme === 'dark'
            ? 'bg-industrial-dark-surface border-industrial-dark-border'
            : 'bg-industrial-light-surface border-industrial-light-border'
          }
        `}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr
                className={`
                  border-b
                  ${theme === 'dark'
                    ? 'border-industrial-dark-border bg-industrial-dark-bg'
                    : 'border-industrial-light-border bg-gray-50'
                  }
                `}
              >
                {currentRole && canEdit(currentRole, 'employees') && (
                  <th
                    className={`
                      px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider
                      ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                    `}
                  >
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleSelectAll}
                        className={`p-1 rounded transition-colors ${
                          selectedEmployees.length === employees.length && employees.length > 0
                            ? theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                            : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      >
                        {selectedEmployees.length === employees.length && employees.length > 0 ? (
                          <CheckSquare size={16} />
                        ) : (
                          <Square size={16} />
                        )}
                      </button>
                      <span>Select</span>
                    </div>
                  </th>
                )}
                <th
                  className={`
                    px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider
                    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                  `}
                >
                  Employee ID
                </th>
                <th
                  className={`
                    px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider
                    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                  `}
                >
                  Name
                </th>
                <th
                  className={`
                    px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider
                    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                  `}
                >
                  Email
                </th>
                <th
                  className={`
                    px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider
                    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                  `}
                >
                  Department
                </th>
                <th
                  className={`
                    px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider
                    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                  `}
                >
                  Role
                </th>
                <th
                  className={`
                    px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider
                    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                  `}
                >
                  Shift
                </th>
                <th
                  className={`
                    px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider
                    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                  `}
                >
                  Status
                </th>
                <th
                  className={`
                    px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider
                    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                  `}
                >
                  Attendance
                </th>
                {currentRole && canEdit(currentRole, 'employees') && (
                  <th
                    className={`
                      px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider
                      ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                    `}
                  >
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {employees.map((employee) => (
                <tr
                  key={employee.id}
                  className={`
                    hover:opacity-90 transition-opacity
                    ${theme === 'dark' ? 'hover:bg-industrial-dark-bg' : 'hover:bg-gray-50'}
                  `}
                >
                  {currentRole && canEdit(currentRole, 'employees') && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleSelectEmployee(employee.id)}
                        className={`p-2 rounded transition-colors ${
                          selectedEmployees.includes(employee.id)
                            ? theme === 'dark' ? 'text-blue-400 bg-blue-900/20' : 'text-blue-600 bg-blue-100'
                            : theme === 'dark' ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {selectedEmployees.includes(employee.id) ? (
                          <CheckSquare size={16} />
                        ) : (
                          <Square size={16} />
                        )}
                      </button>
                    </td>
                  )}
                  {editingId === employee.id ? (
                    <>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={editForm.employee_id || ''}
                          onChange={(e) => setEditForm({ ...editForm, employee_id: e.target.value })}
                          className={`
                            w-full px-2 py-1 rounded border text-sm
                            ${theme === 'dark'
                              ? 'bg-industrial-dark-bg border-industrial-dark-border text-industrial-dark-text'
                              : 'bg-white border-industrial-light-border text-industrial-light-text'
                            }
                          `}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={editForm.name || ''}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className={`
                            w-full px-2 py-1 rounded border text-sm
                            ${theme === 'dark'
                              ? 'bg-industrial-dark-bg border-industrial-dark-border text-industrial-dark-text'
                              : 'bg-white border-industrial-light-border text-industrial-light-text'
                            }
                          `}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="email"
                          value={editForm.email || ''}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          className={`
                            w-full px-2 py-1 rounded border text-sm
                            ${theme === 'dark'
                              ? 'bg-industrial-dark-bg border-industrial-dark-border text-industrial-dark-text'
                              : 'bg-white border-industrial-light-border text-industrial-light-text'
                            }
                          `}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={editForm.department || ''}
                          onChange={(e) => setEditForm({ ...editForm, department: e.target.value as any })}
                          className={`
                            w-full px-2 py-1 rounded border text-sm
                            ${theme === 'dark'
                              ? 'bg-industrial-dark-bg border-industrial-dark-border text-industrial-dark-text'
                              : 'bg-white border-industrial-light-border text-industrial-light-text'
                            }
                          `}
                        >
                          <option value="production">Production</option>
                          <option value="qc">QC</option>
                          <option value="maintenance">Maintenance</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={editForm.role || ''}
                          onChange={(e) => setEditForm({ ...editForm, role: e.target.value as EmployeeRole })}
                          className={`
                            w-full px-2 py-1 rounded border text-sm
                            ${theme === 'dark'
                              ? 'bg-industrial-dark-bg border-industrial-dark-border text-industrial-dark-text'
                              : 'bg-white border-industrial-light-border text-industrial-light-text'
                            }
                          `}
                        >
                          <option value="OPERATOR">OPERATOR</option>
                          <option value="SUPERVISOR">SUPERVISOR</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={editForm.shift || ''}
                          onChange={(e) => setEditForm({ ...editForm, shift: e.target.value as EmployeeShift })}
                          className={`
                            w-full px-2 py-1 rounded border text-sm
                            ${theme === 'dark'
                              ? 'bg-industrial-dark-bg border-industrial-dark-border text-industrial-dark-text'
                              : 'bg-white border-industrial-light-border text-industrial-light-text'
                            }
                          `}
                        >
                          <option value="Day">Day</option>
                          <option value="Night">Night</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={editForm.status || ''}
                          onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                          className={`
                            w-full px-2 py-1 rounded border text-sm
                            ${theme === 'dark'
                              ? 'bg-industrial-dark-bg border-industrial-dark-border text-industrial-dark-text'
                              : 'bg-white border-industrial-light-border text-industrial-light-text'
                            }
                          `}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="on_leave">On Leave</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={handleUpdateEmployee}
                            className={`
                              p-1.5 rounded hover:opacity-70 transition-opacity
                              ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}
                            `}
                            title="Save"
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(null)
                              setEditForm({})
                            }}
                            className={`
                              p-1.5 rounded hover:opacity-70 transition-opacity
                              ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
                            `}
                            title="Cancel"
                          >
                            ✕
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td
                        className={`
                          px-6 py-4 whitespace-nowrap text-sm font-medium
                          ${theme === 'dark' ? 'text-industrial-dark-text' : 'text-industrial-light-text'}
                        `}
                      >
                        {employee.employee_id}
                      </td>
                      <td
                        className={`
                          px-6 py-4 whitespace-nowrap text-sm font-medium
                          ${theme === 'dark' ? 'text-industrial-dark-text' : 'text-industrial-light-text'}
                        `}
                      >
                        {employee.name}
                      </td>
                      <td
                        className={`
                          px-6 py-4 whitespace-nowrap text-sm
                          ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
                        `}
                      >
                        {employee.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getDepartmentBadge(employee.department)}>
                          <Building2 size={12} className="inline mr-1" />
                          {employee.department ? employee.department.charAt(0).toUpperCase() + employee.department.slice(1) : 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getRoleBadge(employee.role)}>
                          <Shield size={12} />
                          {employee.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`
                            px-2 py-1 rounded text-xs font-medium flex items-center gap-1 w-fit
                            ${theme === 'dark'
                              ? employee.shift === 'Day'
                                ? 'bg-yellow-900/30 text-yellow-400'
                                : 'bg-indigo-900/30 text-indigo-400'
                              : employee.shift === 'Day'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-indigo-100 text-indigo-800'
                            }
                          `}
                        >
                          <Clock size={12} />
                          {employee.shift}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`
                            px-2 py-1 rounded text-xs font-medium
                            ${employee.status === 'active'
                              ? theme === 'dark'
                                ? 'bg-green-900/30 text-green-400'
                                : 'bg-green-100 text-green-800'
                              : theme === 'dark'
                              ? 'bg-gray-700 text-gray-300'
                              : 'bg-gray-100 text-gray-700'
                            }
                          `}
                        >
                          {employee.status ? employee.status.charAt(0).toUpperCase() + employee.status.slice(1).replace('_', ' ') : 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className={theme === 'dark' ? 'text-green-400' : 'text-green-600'}>
                            P: {attendanceSummary[employee.employee_id]?.present ?? 0}
                          </span>
                          <span className={theme === 'dark' ? 'text-red-400' : 'text-red-600'}>
                            A: {attendanceSummary[employee.employee_id]?.absent ?? 0}
                          </span>
                          <span className={theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}>
                            L: {attendanceSummary[employee.employee_id]?.late ?? 0}
                          </span>
                        </div>
                      </td>
                      {currentRole && canEdit(currentRole, 'employees') && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(employee.id)}
                              className={`
                                p-2 rounded hover:opacity-70 transition-opacity
                                ${theme === 'dark'
                                  ? 'text-blue-400 hover:bg-industrial-dark-bg'
                                  : 'text-blue-600 hover:bg-gray-100'
                                }
                              `}
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                            {canDelete(currentRole, 'employees') && (
                              <button
                                onClick={() => handleDelete(employee.id)}
                                className={`
                                  p-2 rounded hover:opacity-70 transition-opacity
                                  ${theme === 'dark'
                                    ? 'text-red-400 hover:bg-industrial-dark-bg'
                                    : 'text-red-600 hover:bg-gray-100'
                                  }
                                `}
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {employees.length === 0 && (
          <div
            className={`
              text-center py-12
              ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
            `}
          >
            <Users size={48} className="mx-auto mb-4 opacity-50" />
            <p>No employees found. Add your first employee using the button above.</p>
          </div>
        )}
      </div>
    </div>
  )
}

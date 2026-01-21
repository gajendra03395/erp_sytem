'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { useTheme } from '@/components/providers/ThemeProvider'
import { Plus, Copy, Trash2, Loader2, AlertCircle, CheckCircle, AlertTriangle, CheckSquare, Square } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface EmployeeCredential {
  id: string
  name: string
  email: string
  employee_id: string
  password: string
  role: 'ADMIN' | 'SUPERVISOR' | 'OPERATOR' | 'SUPERUSER'
  created_at: string
}

export default function AdminEmployeesPage() {
  const router = useRouter()
  const { currentRole } = useAuth()
  const { theme } = useTheme()
  const [employees, setEmployees] = useState<EmployeeCredential[]>([])
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    employee_id: '',
    password: '',
    role: 'OPERATOR' as 'ADMIN' | 'SUPERVISOR' | 'OPERATOR' | 'SUPERUSER'
  })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Fetch employees on component mount
  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      setFetchLoading(true)
      const response = await fetch('/api/auth/employees')
      const data = await response.json()
      
      if (data.success) {
        setEmployees(data.data)
      } else {
        setError('Failed to fetch employees')
      }
    } catch (err) {
      setError('Failed to fetch employees')
    } finally {
      setFetchLoading(false)
    }
  }

  // Only allow admin and superuser access
  const effectiveRole = currentRole
  
  if (effectiveRole !== 'ADMIN' && effectiveRole !== 'SUPERUSER') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-red-600">Access Denied</h2>
          <p className="text-gray-600 mt-2">Admin or Superuser access required</p>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/auth/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to create employee')
        setLoading(false)
        return
      }

      // Add to list
      setEmployees([...employees, data.credential])
      setSuccess(
        `Employee created! Email: ${data.credential.email}, Employee ID: ${data.credential.employee_id}, Password: ${data.credential.password}`
      )
      setFormData({ name: '', email: '', employee_id: '', password: '', role: 'OPERATOR' })
      setShowForm(false)
      setLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setLoading(false)
    }
  }

  const handleDelete = async (email: string) => {
    if (!confirm('Are you sure you want to delete this employee?')) return

    try {
      const response = await fetch('/api/auth/employees', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setEmployees(employees.filter((e) => e.email !== email))
        setSuccess('Employee deleted successfully')
        await fetchEmployees() // Refresh the list
      } else {
        setError('Failed to delete employee')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const handleBulkDelete = async () => {
    if (selectedEmployees.length === 0) {
      setError('No employees selected for deletion')
      return
    }

    if (!confirm(`Are you sure you want to delete ${selectedEmployees.length} employee(s)?`)) return

    try {
      setLoading(true)
      setError('')
      setSuccess('')

      const response = await fetch('/api/auth/employees/bulk-delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emails: selectedEmployees }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(`${data.deleted} employee(s) deleted successfully`)
        setSelectedEmployees([])
        setSelectAll(false)
        await fetchEmployees() // Refresh the list
      } else {
        setError(data.error || 'Failed to delete employees')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const toggleEmployeeSelection = (email: string) => {
    setSelectedEmployees(prev => 
      prev.includes(email) 
        ? prev.filter(e => e !== email)
        : [...prev, email]
    )
  }

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedEmployees([])
      setSelectAll(false)
    } else {
      setSelectedEmployees(employees.map(e => e.email))
      setSelectAll(true)
    }
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div
      className={`
        min-h-screen p-6 lg:p-8
        ${theme === 'dark' ? 'bg-industrial-dark-bg' : 'bg-industrial-light-bg'}
      `}
    >
      {/* Header */}
      <div className='mb-8'>
        <h1
          className={`
            text-3xl font-bold mb-2
            ${theme === 'dark' ? 'text-industrial-dark-text' : 'text-industrial-light-text'}
          `}
        >
          {currentRole === 'SUPERUSER' ? '⚡ Superuser: ' : ''}Employee Credentials Management
        </h1>
        <p
          className={
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }
        >
          Create and manage employee login credentials
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div
          className={`
            mb-6 p-4 rounded-lg flex items-start gap-3
            ${theme === 'dark'
              ? 'bg-green-900/20 border border-green-800/40'
              : 'bg-green-100 border border-green-300'
            }
          `}
        >
          <CheckCircle
            size={20}
            className={`flex-shrink-0 mt-0.5 ${
              theme === 'dark' ? 'text-green-400' : 'text-green-600'
            }`}
          />
          <p
            className={
              theme === 'dark' ? 'text-green-400 text-sm' : 'text-green-800 text-sm'
            }
          >
            {success}
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div
          className={`
            mb-6 p-4 rounded-lg flex items-start gap-3
            ${theme === 'dark'
              ? 'bg-red-900/20 border border-red-800/40'
              : 'bg-red-100 border border-red-300'
            }
          `}
        >
          <AlertCircle
            size={20}
            className={`flex-shrink-0 mt-0.5 ${
              theme === 'dark' ? 'text-red-400' : 'text-red-600'
            }`}
          />
          <p
            className={
              theme === 'dark' ? 'text-red-400 text-sm' : 'text-red-800 text-sm'
            }
          >
            {error}
          </p>
        </div>
      )}

      {/* Create Form */}
      {showForm && (
        <div
          className={`
            mb-8 p-6 rounded-lg border
            ${theme === 'dark'
              ? 'bg-industrial-dark-surface border-industrial-dark-border'
              : 'bg-industrial-light-surface border-industrial-light-border'
            }
          `}
        >
          <h2
            className={`
              text-xl font-semibold mb-4
              ${theme === 'dark' ? 'text-industrial-dark-text' : 'text-industrial-light-text'}
            `}
          >
            Create New Employee
          </h2>
          <form onSubmit={handleSubmit} className='space-y-4'>
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
                type='text'
                value={formData.employee_id}
                onChange={(e) =>
                  setFormData({ ...formData, employee_id: e.target.value })
                }
                className={`
                  w-full px-4 py-2 rounded-lg border outline-none
                  ${theme === 'dark'
                    ? 'bg-industrial-dark-bg border-industrial-dark-border text-white'
                    : 'bg-white border-gray-300 text-black'
                  }
                `}
                required
                disabled={loading}
              />
            </div>

            <div>
              <label
                className={`
                  block text-sm font-medium mb-2
                  ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                `}
              >
                Full Name
              </label>
              <input
                type='text'
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={`
                  w-full px-4 py-2 rounded-lg border outline-none
                  ${theme === 'dark'
                    ? 'bg-industrial-dark-bg border-industrial-dark-border text-white'
                    : 'bg-white border-gray-300 text-black'
                  }
                `}
                required
                disabled={loading}
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
                type='email'
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className={`
                  w-full px-4 py-2 rounded-lg border outline-none
                  ${theme === 'dark'
                    ? 'bg-industrial-dark-bg border-industrial-dark-border text-white'
                    : 'bg-white border-gray-300 text-black'
                  }
                `}
                required
                disabled={loading}
              />
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
                value={formData.role}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    role: e.target.value as any,
                  })
                }
                className={`
                  w-full px-4 py-2 rounded-lg border outline-none
                  ${theme === 'dark'
                    ? 'bg-industrial-dark-bg border-industrial-dark-border text-white'
                    : 'bg-white border-gray-300 text-black'
                  }
                `}
                disabled={loading}
              >
                <option value='OPERATOR'>Operator</option>
                <option value='SUPERVISOR'>Supervisor</option>
                <option value='ADMIN'>Admin</option>
                {currentRole === 'SUPERUSER' && <option value='SUPERUSER'>⚡ Superuser</option>}
              </select>
            </div>

            <div className='flex gap-2'>
              <button
                type='submit'
                disabled={loading}
                className={`
                  flex-1 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2
                  ${loading
                    ? theme === 'dark'
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : theme === 'dark'
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }
                `}
              >
                {loading && <Loader2 size={18} className='animate-spin' />}
                Create Employee
              </button>
              <button
                type='button'
                onClick={() => setShowForm(false)}
                className={`
                  px-6 py-2 rounded-lg font-medium transition-colors
                  ${theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }
                `}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Button and Bulk Actions */}
      {!showForm && (
        <div className='mb-8 flex items-center justify-between gap-4'>
          <button
            onClick={() => setShowForm(true)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors
              ${theme === 'dark'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
              }
            `}
          >
            <Plus size={20} />
            Add Employee
          </button>
          
          {selectedEmployees.length > 0 && (
            <button
              onClick={handleBulkDelete}
              disabled={loading}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors
                ${loading
                  ? theme === 'dark'
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : theme === 'dark'
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }
              `}
            >
              {loading && <Loader2 size={18} className='animate-spin' />}
              <Trash2 size={18} />
              Delete {selectedEmployees.length} Selected
            </button>
          )}
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
        {fetchLoading ? (
          <div
            className={`
              p-8 text-center
              ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
            `}
          >
            <Loader2 className="animate-spin mx-auto mb-4" size={32} />
            <p>Loading employees...</p>
          </div>
        ) : employees.length === 0 ? (
          <div
            className={`
              p-8 text-center
              ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
            `}
          >
            <p>No employees created yet. Click &quot;Add Employee&quot; to create one.</p>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead
                className={
                  theme === 'dark'
                    ? 'bg-industrial-dark-bg border-b border-industrial-dark-border'
                    : 'bg-gray-50 border-b border-industrial-light-border'
                }
              >
                <tr>
                  <th
                    className={`
                      px-6 py-3 text-left text-xs font-medium uppercase tracking-wider
                      ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
                    `}
                  >
                    <button
                      onClick={toggleSelectAll}
                      className={`
                        p-1 rounded transition-colors
                        ${theme === 'dark'
                          ? 'text-gray-500 hover:text-gray-400'
                          : 'text-gray-400 hover:text-gray-600'
                        }
                      `}
                      title={selectAll ? 'Deselect all' : 'Select all'}
                    >
                      {selectAll ? <CheckSquare size={18} /> : <Square size={18} />}
                    </button>
                  </th>
                  <th
                    className={`
                      px-6 py-3 text-left text-xs font-medium uppercase tracking-wider
                      ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
                    `}
                  >
                    Employee ID
                  </th>
                  <th
                    className={`
                      px-6 py-3 text-left text-xs font-medium uppercase tracking-wider
                      ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
                    `}
                  >
                    Name
                  </th>
                  <th
                    className={`
                      px-6 py-3 text-left text-xs font-medium uppercase tracking-wider
                      ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
                    `}
                  >
                    Email
                  </th>
                  <th
                    className={`
                      px-6 py-3 text-left text-xs font-medium uppercase tracking-wider
                      ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
                    `}
                  >
                    Password
                  </th>
                  <th
                    className={`
                      px-6 py-3 text-left text-xs font-medium uppercase tracking-wider
                      ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
                    `}
                  >
                    Role
                  </th>
                  <th
                    className={`
                      px-6 py-3 text-left text-xs font-medium uppercase tracking-wider
                      ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
                    `}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody
                className={`
                  divide-y
                  ${theme === 'dark'
                    ? 'divide-industrial-dark-border'
                    : 'divide-industrial-light-border'
                  }
                `}
              >
                {employees.map((emp) => (
                  <tr
                    key={emp.email}
                    className={
                      theme === 'dark'
                        ? 'hover:bg-industrial-dark-bg/50'
                        : 'hover:bg-gray-50'
                    }
                  >
                    <td
                      className={`
                        px-6 py-4 whitespace-nowrap text-sm
                        ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}
                      `}
                    >
                      <button
                        onClick={() => toggleEmployeeSelection(emp.email)}
                        className={`
                          p-1 rounded transition-colors
                          ${selectedEmployees.includes(emp.email)
                            ? theme === 'dark'
                              ? 'text-blue-400'
                              : 'text-blue-600'
                            : theme === 'dark'
                              ? 'text-gray-500 hover:text-gray-400'
                              : 'text-gray-400 hover:text-gray-600'
                          }
                        `}
                        title={selectedEmployees.includes(emp.email) ? 'Deselect' : 'Select'}
                      >
                        {selectedEmployees.includes(emp.email) ? <CheckSquare size={18} /> : <Square size={18} />}
                      </button>
                    </td>
                    <td
                      className={`
                        px-6 py-4 whitespace-nowrap text-sm font-mono
                        ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}
                      `}
                    >
                      {emp.employee_id}
                    </td>
                    <td
                      className={`
                        px-6 py-4 whitespace-nowrap text-sm
                        ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}
                      `}
                    >
                      {emp.name}
                    </td>
                    <td
                      className={`
                        px-6 py-4 whitespace-nowrap text-sm font-mono
                        ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}
                      `}
                    >
                      {emp.email}
                    </td>
                    <td
                      className={`
                        px-6 py-4 whitespace-nowrap text-sm font-mono
                        ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}
                      `}
                    >
                      <div className='flex items-center gap-2'>
                        <span>•••••••</span>
                        <button
                          onClick={() =>
                            copyToClipboard(
                              emp.password,
                              emp.id
                            )
                          }
                          className={`
                            p-1 rounded transition-colors
                            ${
                              copied === emp.id
                                ? theme === 'dark'
                                  ? 'text-green-400'
                                  : 'text-green-600'
                                : theme === 'dark'
                                  ? 'text-gray-500 hover:text-gray-400'
                                  : 'text-gray-400 hover:text-gray-600'
                            }
                          `}
                          title='Copy password'
                        >
                          <Copy size={16} />
                        </button>
                      </div>
                    </td>
                    <td
                      className={`
                        px-6 py-4 whitespace-nowrap text-sm
                        ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}
                      `}
                    >
                      <span
                        className={`
                          px-2 py-1 rounded text-xs font-medium
                          ${
                            emp.role === 'ADMIN'
                              ? theme === 'dark'
                                ? 'bg-purple-900/30 text-purple-400'
                                : 'bg-purple-100 text-purple-800'
                              : emp.role === 'SUPERVISOR'
                                ? theme === 'dark'
                                  ? 'bg-blue-900/30 text-blue-400'
                                  : 'bg-blue-100 text-blue-800'
                                : theme === 'dark'
                                  ? 'bg-gray-700 text-gray-300'
                                  : 'bg-gray-100 text-gray-700'
                          }
                        `}
                      >
                        {emp.role}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm'>
                      <button
                        onClick={() => handleDelete(emp.email)}
                        className={`
                          p-2 rounded transition-colors
                          ${theme === 'dark'
                            ? 'text-gray-500 hover:text-red-400 hover:bg-red-900/20'
                            : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                          }
                        `}
                        title='Delete employee'
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

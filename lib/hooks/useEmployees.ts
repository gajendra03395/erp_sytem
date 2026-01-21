'use client'

import { useState, useEffect } from 'react'
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api/client'
import type { Employee, CreateEmployee, UpdateEmployee } from '@/types/employee'

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch from API
      const response = await apiGet<{ success: boolean; data: Employee[] }>('/employees')
      
      if (response.success) {
        setEmployees(response.data)
      } else {
        throw new Error('Failed to fetch employees')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch employees')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  const addEmployee = async (employee: CreateEmployee) => {
    try {
      // Create employee via API
      const response = await apiPost<{ success: boolean; data: Employee; error?: string }>('/employees', employee)
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to add employee')
      }

      const newEmployee = response.data
      
      // Create login credentials for employee
      const credResponse = await fetch('/api/auth/create-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: newEmployee.id,
          name: newEmployee.name,
          email: newEmployee.email,
          employee_id: newEmployee.employee_id,
          role: newEmployee.role,
        }),
      })

      if (!credResponse.ok) {
        throw new Error('Failed to create login credentials')
      }

      const { password } = await credResponse.json()
      
      // Refresh employees list
      await fetchEmployees()
      
      // Show credentials to admin
      alert(`Employee added successfully!\n\nLogin Credentials:\nEmployee ID: ${newEmployee.employee_id}\nPassword: ${password}\n\nPlease save these credentials securely.`)
      
      return newEmployee
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to add employee')
    }
  }

  const updateEmployee = async (id: string, updates: UpdateEmployee) => {
    try {
      const response = await apiPut<{ success: boolean; data: Employee; error?: string }>(`/employees/${id}`, updates)
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to update employee')
      }

      // Refresh employees list
      await fetchEmployees()
      
      return response.data
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update employee')
    }
  }

  const deleteEmployee = async (id: string) => {
    try {
      // Find employee to get employee_id
      const employee = employees.find(emp => emp.id === id)
      if (!employee) {
        throw new Error('Employee not found')
      }

      // Delete employee via API
      const response = await apiDelete<{ success: boolean; error?: string }>(`/employees/${id}`)
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete employee')
      }

      // Delete credentials from auth system
      await fetch('/api/auth/delete-credentials', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employee_id: employee.employee_id }),
      })

      // Refresh employees list
      await fetchEmployees()
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete employee')
    }
  }

  return {
    employees,
    loading,
    error,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    refetch: fetchEmployees,
  }
}

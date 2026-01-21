import { useState, useEffect } from 'react'
import { Employee, Payroll, CreateEmployeeRequest, UpdateEmployeeRequest, CreatePayrollRequest, UpdatePayrollRequest } from '@/types/payroll'
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api/client'

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      const response = await apiGet<Employee[]>('/payroll/employees')
      setEmployees(response)
      setError(null)
    } catch (err) {
      setError('Failed to fetch employees')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const createEmployee = async (data: CreateEmployeeRequest) => {
    try {
      const response = await apiPost<Employee>('/payroll/employees', data)
      setEmployees(prev => [...prev, response])
      return response
    } catch (err) {
      setError('Failed to create employee')
      throw err
    }
  }

  const updateEmployee = async (id: string, data: UpdateEmployeeRequest) => {
    try {
      const response = await apiPut<Employee>(`/payroll/employees/${id}`, data)
      setEmployees(prev => prev.map(e => e.id === id ? response : e))
      return response
    } catch (err) {
      setError('Failed to update employee')
      throw err
    }
  }

  const deleteEmployee = async (id: string) => {
    try {
      await apiDelete(`/payroll/employees/${id}`)
      setEmployees(prev => prev.filter(e => e.id !== id))
    } catch (err) {
      setError('Failed to delete employee')
      throw err
    }
  }

  return {
    employees,
    loading,
    error,
    refetch: fetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
  }
}

export function usePayrolls() {
  const [payrolls, setPayrolls] = useState<Payroll[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPayrolls()
  }, [])

  const fetchPayrolls = async () => {
    try {
      setLoading(true)
      const response = await apiGet<Payroll[]>('/payroll/payrolls')
      setPayrolls(response)
      setError(null)
    } catch (err) {
      setError('Failed to fetch payrolls')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const createPayroll = async (data: CreatePayrollRequest) => {
    try {
      const response = await apiPost<Payroll>('/payroll/payrolls', data)
      setPayrolls(prev => [...prev, response])
      return response
    } catch (err) {
      setError('Failed to create payroll')
      throw err
    }
  }

  const updatePayroll = async (id: string, data: UpdatePayrollRequest) => {
    try {
      const response = await apiPut<Payroll>(`/payroll/payrolls/${id}`, data)
      setPayrolls(prev => prev.map(p => p.id === id ? response : p))
      return response
    } catch (err) {
      setError('Failed to update payroll')
      throw err
    }
  }

  const deletePayroll = async (id: string) => {
    try {
      await apiDelete(`/payroll/payrolls/${id}`)
      setPayrolls(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      setError('Failed to delete payroll')
      throw err
    }
  }

  return {
    payrolls,
    loading,
    error,
    refetch: fetchPayrolls,
    createPayroll,
    updatePayroll,
    deletePayroll,
  }
}

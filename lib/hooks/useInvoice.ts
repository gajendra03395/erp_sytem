import { useState, useEffect } from 'react'
import { Invoice, Customer, CreateInvoiceRequest, UpdateInvoiceRequest, CreateCustomerRequest, UpdateCustomerRequest } from '@/types/invoice'
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api/client'

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchInvoices()
  }, [])

  const fetchInvoices = async () => {
    try {
      setLoading(true)
      const response = await apiGet<Invoice[]>('/invoice/invoices')
      setInvoices(response)
      setError(null)
    } catch (err) {
      setError('Failed to fetch invoices')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const createInvoice = async (data: CreateInvoiceRequest) => {
    try {
      const response = await apiPost<Invoice>('/invoice/invoices', data)
      setInvoices(prev => [...prev, response])
      return response
    } catch (err) {
      setError('Failed to create invoice')
      throw err
    }
  }

  const updateInvoice = async (id: string, data: UpdateInvoiceRequest) => {
    try {
      const response = await apiPut<Invoice>(`/invoice/invoices/${id}`, data)
      setInvoices(prev => prev.map(inv => inv.id === id ? response : inv))
      return response
    } catch (err) {
      setError('Failed to update invoice')
      throw err
    }
  }

  const deleteInvoice = async (id: string) => {
    try {
      await apiDelete(`/invoice/invoices/${id}`)
      setInvoices(prev => prev.filter(inv => inv.id !== id))
    } catch (err) {
      setError('Failed to delete invoice')
      throw err
    }
  }

  return {
    invoices,
    loading,
    error,
    refetch: fetchInvoices,
    createInvoice,
    updateInvoice,
    deleteInvoice,
  }
}

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const response = await apiGet<Customer[]>('/invoice/customers')
      setCustomers(response)
      setError(null)
    } catch (err) {
      setError('Failed to fetch customers')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const createCustomer = async (data: CreateCustomerRequest) => {
    try {
      const response = await apiPost<Customer>('/invoice/customers', data)
      setCustomers(prev => [...prev, response])
      return response
    } catch (err) {
      setError('Failed to create customer')
      throw err
    }
  }

  const updateCustomer = async (id: string, data: UpdateCustomerRequest) => {
    try {
      const response = await apiPut<Customer>(`/invoice/customers/${id}`, data)
      setCustomers(prev => prev.map(c => c.id === id ? response : c))
      return response
    } catch (err) {
      setError('Failed to update customer')
      throw err
    }
  }

  const deleteCustomer = async (id: string) => {
    try {
      await apiDelete(`/invoice/customers/${id}`)
      setCustomers(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      setError('Failed to delete customer')
      throw err
    }
  }

  return {
    customers,
    loading,
    error,
    refetch: fetchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  }
}

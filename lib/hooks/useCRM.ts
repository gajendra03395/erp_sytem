import { useState, useEffect } from 'react'
import { Lead, Opportunity, Customer, SalesOrder, CreateLeadRequest, UpdateLeadRequest, CreateOpportunityRequest, UpdateOpportunityRequest, CreateCustomerRequest, UpdateCustomerRequest, CreateSalesOrderRequest, UpdateSalesOrderRequest } from '@/types/crm'
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api/client'

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      setLoading(true)
      const response = await apiGet<Lead[]>('/crm/leads')
      setLeads(response)
      setError(null)
    } catch (err) {
      setError('Failed to fetch leads')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const createLead = async (data: CreateLeadRequest) => {
    try {
      const response = await apiPost<Lead>('/crm/leads', data)
      setLeads(prev => [...prev, response])
      return response
    } catch (err) {
      setError('Failed to create lead')
      throw err
    }
  }

  const updateLead = async (id: string, data: UpdateLeadRequest) => {
    try {
      const response = await apiPut<Lead>(`/crm/leads/${id}`, data)
      setLeads(prev => prev.map(l => l.id === id ? response : l))
      return response
    } catch (err) {
      setError('Failed to update lead')
      throw err
    }
  }

  const deleteLead = async (id: string) => {
    try {
      await apiDelete(`/crm/leads/${id}`)
      setLeads(prev => prev.filter(l => l.id !== id))
    } catch (err) {
      setError('Failed to delete lead')
      throw err
    }
  }

  return {
    leads,
    loading,
    error,
    refetch: fetchLeads,
    createLead,
    updateLead,
    deleteLead,
  }
}

export function useOpportunities() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchOpportunities()
  }, [])

  const fetchOpportunities = async () => {
    try {
      setLoading(true)
      const response = await apiGet<Opportunity[]>('/crm/opportunities')
      setOpportunities(response)
      setError(null)
    } catch (err) {
      setError('Failed to fetch opportunities')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const createOpportunity = async (data: CreateOpportunityRequest) => {
    try {
      const response = await apiPost<Opportunity>('/crm/opportunities', data)
      setOpportunities(prev => [...prev, response])
      return response
    } catch (err) {
      setError('Failed to create opportunity')
      throw err
    }
  }

  const updateOpportunity = async (id: string, data: UpdateOpportunityRequest) => {
    try {
      const response = await apiPut<Opportunity>(`/crm/opportunities/${id}`, data)
      setOpportunities(prev => prev.map(o => o.id === id ? response : o))
      return response
    } catch (err) {
      setError('Failed to update opportunity')
      throw err
    }
  }

  const deleteOpportunity = async (id: string) => {
    try {
      await apiDelete(`/crm/opportunities/${id}`)
      setOpportunities(prev => prev.filter(o => o.id !== id))
    } catch (err) {
      setError('Failed to delete opportunity')
      throw err
    }
  }

  return {
    opportunities,
    loading,
    error,
    refetch: fetchOpportunities,
    createOpportunity,
    updateOpportunity,
    deleteOpportunity,
  }
}

export function useCRMCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const response = await apiGet<Customer[]>('/crm/customers')
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
      const response = await apiPost<Customer>('/crm/customers', data)
      setCustomers(prev => [...prev, response])
      return response
    } catch (err) {
      setError('Failed to create customer')
      throw err
    }
  }

  const updateCustomer = async (id: string, data: UpdateCustomerRequest) => {
    try {
      const response = await apiPut<Customer>(`/crm/customers/${id}`, data)
      setCustomers(prev => prev.map(c => c.id === id ? response : c))
      return response
    } catch (err) {
      setError('Failed to update customer')
      throw err
    }
  }

  const deleteCustomer = async (id: string) => {
    try {
      await apiDelete(`/crm/customers/${id}`)
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

export function useSalesOrders() {
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSalesOrders()
  }, [])

  const fetchSalesOrders = async () => {
    try {
      setLoading(true)
      const response = await apiGet<SalesOrder[]>('/crm/sales-orders')
      setSalesOrders(response)
      setError(null)
    } catch (err) {
      setError('Failed to fetch sales orders')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const createSalesOrder = async (data: CreateSalesOrderRequest) => {
    try {
      const response = await apiPost<SalesOrder>('/crm/sales-orders', data)
      setSalesOrders(prev => [...prev, response])
      return response
    } catch (err) {
      setError('Failed to create sales order')
      throw err
    }
  }

  const updateSalesOrder = async (id: string, data: UpdateSalesOrderRequest) => {
    try {
      const response = await apiPut<SalesOrder>(`/crm/sales-orders/${id}`, data)
      setSalesOrders(prev => prev.map(so => so.id === id ? response : so))
      return response
    } catch (err) {
      setError('Failed to update sales order')
      throw err
    }
  }

  const deleteSalesOrder = async (id: string) => {
    try {
      await apiDelete(`/crm/sales-orders/${id}`)
      setSalesOrders(prev => prev.filter(so => so.id !== id))
    } catch (err) {
      setError('Failed to delete sales order')
      throw err
    }
  }

  return {
    salesOrders,
    loading,
    error,
    refetch: fetchSalesOrders,
    createSalesOrder,
    updateSalesOrder,
    deleteSalesOrder,
  }
}

'use client'

import { useState } from 'react'

interface ApiError {
  error: string
  details?: {
    url: string
    method: string
    timestamp: string
  }
}

export function useApiCall() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const makeRequest = async (url: string, options: RequestInit = {}) => {
    setLoading(true)
    setError(null)

    try {
      console.log('Making API request:', { url, options })

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      console.log('API Response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('API Error Response:', data)
        
        // Handle specific error cases
        if (response.status === 400) {
          let errorMessage = 'Bad Request'
          
          if (data.error) {
            errorMessage = data.error
          }
          
          if (data.details) {
            console.error('Error Details:', data.details)
            errorMessage += ` (${data.details.method} ${data.details.url})`
          }
          
          throw new Error(errorMessage)
        }

        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }

      console.log('API Success:', data)
      return data
    } catch (err) {
      console.error('API Call Error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => setError(null)

  return { makeRequest, loading, error, clearError }
}

// Usage example for debugging
export function debugApiCall(url: string, body?: any) {
  console.group('🔍 API Debug Info')
  console.log('URL:', url)
  console.log('Body:', body)
  console.log('Timestamp:', new Date().toISOString())
  console.groupEnd()
}

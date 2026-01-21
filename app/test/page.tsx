'use client'

import { useEffect, useState } from 'react'

export default function TestPage() {
  const [mounted, setMounted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setMounted(true)
    
    // Test localStorage access
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('test', 'test')
        localStorage.removeItem('test')
      }
    } catch (e) {
      setError('LocalStorage error: ' + (e instanceof Error ? e.message : 'Unknown error'))
    }
  }, [])

  if (!mounted) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div>
      <h1>Test Page</h1>
      <p>No errors detected!</p>
      <p>Window: {typeof window !== 'undefined' ? 'available' : 'not available'}</p>
      <p>LocalStorage: {typeof window !== 'undefined' && window.localStorage ? 'available' : 'not available'}</p>
    </div>
  )
}

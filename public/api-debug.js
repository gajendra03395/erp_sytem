// Global API error interceptor for debugging
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && event.reason.message && event.reason.message.includes('HTTP error')) {
    console.group('🚨 Global API Error Detected')
    console.error('Error:', event.reason)
    console.error('URL:', window.location.href)
    console.error('User Agent:', navigator.userAgent)
    console.error('Timestamp:', new Date().toISOString())
    
    // Try to extract more info
    if (event.reason.stack) {
      console.error('Stack Trace:', event.reason.stack)
    }
    
    console.groupEnd()
    
    // Show user-friendly notification
    if (window.apiErrorHandler) {
      window.apiErrorHandler(event.reason.message)
    }
  }
})

// Add custom error handler to window
declare global {
  interface Window {
    apiErrorHandler?: (message: string) => void
  }
}

// API request logger
const originalFetch = window.fetch
window.fetch = async (...args) => {
  const [url, options] = args
  
  console.group('📡 API Request')
  console.log('URL:', url)
  console.log('Method:', options?.method || 'GET')
  console.log('Headers:', options?.headers)
  console.log('Body:', options?.body)
  
  try {
    const response = await originalFetch(...args)
    
    console.log('Response Status:', response.status)
    console.log('Response Headers:', Object.fromEntries(response.headers.entries()))
    
    // Clone response to avoid consuming it
    const clonedResponse = response.clone()
    
    if (response.status >= 400) {
      clonedResponse.json().then(errorData => {
        console.error('Error Response:', errorData)
      }).catch(() => {
        console.error('Error Response (non-JSON)')
      })
    }
    
    console.groupEnd()
    return response
  } catch (error) {
    console.error('Network Error:', error)
    console.groupEnd()
    throw error
  }
}

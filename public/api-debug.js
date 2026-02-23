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

// API request logger with better error handling
const originalFetch = window.fetch
window.fetch = async (...args) => {
  const [url, options] = args
  
  // Only log API calls, not all fetch requests
  if (typeof url === 'string' && url.includes('/api/')) {
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
        try {
          const errorData = await clonedResponse.json()
          console.error('Error Response:', errorData)
          
          // Show specific error details
          if (response.status === 400) {
            console.error('🔍 400 Bad Request Details:')
            console.error('- Check request body format')
            console.error('- Verify required fields')
            console.error('- Ensure proper JSON syntax')
          }
        } catch (e) {
          console.error('Error Response (non-JSON or parse error)')
        }
      }
      
      console.groupEnd()
      return response
    } catch (error) {
      console.error('Network Error:', error)
      console.groupEnd()
      throw error
    }
  } else {
    // For non-API requests, just call original fetch
    return originalFetch(...args)
  }
}

// Add global error handler for syntax errors
window.addEventListener('error', (event) => {
  if (event.message.includes('global') || event.message.includes('Unexpected identifier')) {
    console.group('🔧 Browser Compatibility Error')
    console.error('Error:', event.message)
    console.error('File:', event.filename)
    console.error('Line:', event.lineno)
    console.error('Column:', event.colno)
    console.error('This usually means Node.js code is running in browser')
    console.groupEnd()
  }
})

console.log('🔍 API Debug Mode Enabled - All API calls will be logged')

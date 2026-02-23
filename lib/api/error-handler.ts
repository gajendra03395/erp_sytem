import { NextRequest, NextResponse } from 'next/server'

// Enhanced error handler for debugging 400 errors
export function handleAPIError(error: any, request: NextRequest) {
  console.error('API Error Details:', {
    url: request.url,
    method: request.method,
    headers: Object.fromEntries(request.headers.entries()),
    body: request.body,
    error: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  })

  // Return more detailed error for debugging
  return NextResponse.json({
    error: error.message || 'An error occurred',
    details: {
      url: request.url,
      method: request.method,
      timestamp: new Date().toISOString()
    }
  }, { status: 400 })
}

// Request validation helper
export async function validateRequest(request: NextRequest, requiredFields: string[] = []) {
  const body = await request.json().catch(() => ({}))
  const missing = requiredFields.filter(field => !body[field])
  
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`)
  }
}

// CORS handler for production
export function handleCORS(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  return response
}

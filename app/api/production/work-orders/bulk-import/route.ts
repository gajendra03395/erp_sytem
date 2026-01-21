import { NextRequest, NextResponse } from 'next/server'
import { createWorkOrder } from '@/lib/utils/production-storage'
import { hasPermission } from '@/lib/auth/permissions'
import { getAuthUser } from '@/lib/auth/server-auth'
import { processBulkImport } from '@/lib/utils/bulk-import'

export async function POST(request: NextRequest) {
  try {
    const user = getAuthUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!hasPermission(user.role, 'manage_production')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { records } = body

    if (!Array.isArray(records)) {
      return NextResponse.json({ error: 'Invalid records format' }, { status: 400 })
    }

    const result = await processBulkImport('production', records, createWorkOrder)
    
    return NextResponse.json({
      message: 'Bulk import completed',
      ...result
    })
  } catch (error) {
    console.error('Bulk import error:', error)
    return NextResponse.json({ 
      error: 'Failed to process bulk import',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

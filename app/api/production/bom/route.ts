import { NextRequest, NextResponse } from 'next/server'
import { createBOM, readBOMs } from '@/lib/utils/production-storage'
import { hasPermission } from '@/lib/auth/permissions'
import { getAuthUser } from '@/lib/auth/server-auth'

export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!hasPermission(user.role, 'view_production')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const boms = await readBOMs()
    return NextResponse.json(boms)
  } catch (error) {
    console.error('Failed to fetch BOMs:', error)
    return NextResponse.json({ error: 'Failed to fetch BOMs' }, { status: 500 })
  }
}

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
    const bom = await createBOM(body)
    return NextResponse.json(bom, { status: 201 })
  } catch (error) {
    console.error('Failed to create BOM:', error)
    return NextResponse.json({ error: 'Failed to create BOM' }, { status: 500 })
  }
}

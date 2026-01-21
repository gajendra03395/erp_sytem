import { NextRequest, NextResponse } from 'next/server'
import { updateBOM, deleteBOM, readBOMs } from '@/lib/utils/production-storage'
import { hasPermission } from '@/lib/auth/permissions'
import { getAuthUser } from '@/lib/auth/server-auth'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser(request)
    if (!user || !hasPermission(user.role, 'view_production')) {
      return NextResponse.json({ error: user ? 'Forbidden' : 'Unauthorized' }, { status: user ? 403 : 401 })
    }

    const boms = await readBOMs()
    const bom = boms.find(b => b.id === params.id)
    return bom ? NextResponse.json(bom) : NextResponse.json({ error: 'BOM not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch BOM' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser(request)
    if (!user || !hasPermission(user.role, 'manage_production')) {
      return NextResponse.json({ error: user ? 'Forbidden' : 'Unauthorized' }, { status: user ? 403 : 401 })
    }

    const body = await request.json()
    const bom = await updateBOM(params.id, body)
    return bom ? NextResponse.json(bom) : NextResponse.json({ error: 'BOM not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update BOM' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser(request)
    if (!user || !hasPermission(user.role, 'manage_production')) {
      return NextResponse.json({ error: user ? 'Forbidden' : 'Unauthorized' }, { status: user ? 403 : 401 })
    }

    const success = await deleteBOM(params.id)
    return success ? NextResponse.json({ message: 'BOM deleted' }) : NextResponse.json({ error: 'BOM not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete BOM' }, { status: 500 })
  }
}

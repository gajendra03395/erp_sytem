import { NextRequest, NextResponse } from 'next/server'
import { updateAsset, deleteAsset, readAssets } from '@/lib/utils/assets-storage'
import { hasPermission } from '@/lib/auth/permissions'
import { getAuthUser } from '@/lib/auth/server-auth'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser(request)
    if (!user || !hasPermission(user.role, 'view_inventory')) {
      return NextResponse.json({ error: user ? 'Forbidden' : 'Unauthorized' }, { status: user ? 403 : 401 })
    }

    const assets = await readAssets()
    const asset = assets.find(a => a.id === params.id)
    return asset ? NextResponse.json(asset) : NextResponse.json({ error: 'Asset not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch asset' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser(request)
    if (!user || !hasPermission(user.role, 'edit_inventory')) {
      return NextResponse.json({ error: user ? 'Forbidden' : 'Unauthorized' }, { status: user ? 403 : 401 })
    }

    const body = await request.json()
    const asset = await updateAsset(params.id, body)
    return asset ? NextResponse.json(asset) : NextResponse.json({ error: 'Asset not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update asset' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser(request)
    if (!user || !hasPermission(user.role, 'delete_inventory')) {
      return NextResponse.json({ error: user ? 'Forbidden' : 'Unauthorized' }, { status: user ? 403 : 401 })
    }

    const success = await deleteAsset(params.id)
    return success ? NextResponse.json({ message: 'Asset deleted' }) : NextResponse.json({ error: 'Asset not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete asset' }, { status: 500 })
  }
}

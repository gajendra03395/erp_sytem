import { NextRequest, NextResponse } from 'next/server'
import { createAsset, readAssets } from '@/lib/utils/assets-storage'
import { hasPermission } from '@/lib/auth/permissions'
import { getAuthUser } from '@/lib/auth/server-auth'

export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!hasPermission(user.role, 'view_inventory')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const assets = await readAssets()
    return NextResponse.json(assets)
  } catch (error) {
    console.error('Failed to fetch assets:', error)
    return NextResponse.json({ error: 'Failed to fetch assets' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getAuthUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!hasPermission(user.role, 'edit_inventory')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const asset = await createAsset(body)
    return NextResponse.json(asset, { status: 201 })
  } catch (error) {
    console.error('Failed to create asset:', error)
    return NextResponse.json({ error: 'Failed to create asset' }, { status: 500 })
  }
}

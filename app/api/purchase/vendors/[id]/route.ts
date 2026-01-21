import { NextRequest, NextResponse } from 'next/server'
import { updateVendor, deleteVendor, readVendors } from '@/lib/utils/purchase-storage'
import { hasPermission } from '@/lib/auth/permissions'
import { getAuthUser } from '@/lib/auth/server-auth'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser(request)
    if (!user || !hasPermission(user.role, 'view_inventory')) {
      return NextResponse.json({ error: user ? 'Forbidden' : 'Unauthorized' }, { status: user ? 403 : 401 })
    }

    const vendors = await readVendors()
    const vendor = vendors.find(v => v.id === params.id)
    return vendor ? NextResponse.json(vendor) : NextResponse.json({ error: 'Vendor not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch vendor' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser(request)
    if (!user || !hasPermission(user.role, 'edit_inventory')) {
      return NextResponse.json({ error: user ? 'Forbidden' : 'Unauthorized' }, { status: user ? 403 : 401 })
    }

    const body = await request.json()
    const vendor = await updateVendor(params.id, body)
    return vendor ? NextResponse.json(vendor) : NextResponse.json({ error: 'Vendor not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update vendor' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser(request)
    if (!user || !hasPermission(user.role, 'delete_inventory')) {
      return NextResponse.json({ error: user ? 'Forbidden' : 'Unauthorized' }, { status: user ? 403 : 401 })
    }

    const success = await deleteVendor(params.id)
    return success ? NextResponse.json({ message: 'Vendor deleted' }) : NextResponse.json({ error: 'Vendor not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete vendor' }, { status: 500 })
  }
}

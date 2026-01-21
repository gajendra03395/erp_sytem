import { NextRequest, NextResponse } from 'next/server'
import { updateOpportunity, deleteOpportunity, readOpportunities } from '@/lib/utils/crm-storage'
import { hasPermission } from '@/lib/auth/permissions'
import { getAuthUser } from '@/lib/auth/server-auth'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser(request)
    if (!user || !hasPermission(user.role, 'view_inventory')) {
      return NextResponse.json({ error: user ? 'Forbidden' : 'Unauthorized' }, { status: user ? 403 : 401 })
    }

    const opportunities = await readOpportunities()
    const opportunity = opportunities.find(o => o.id === params.id)
    return opportunity ? NextResponse.json(opportunity) : NextResponse.json({ error: 'Opportunity not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch opportunity' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser(request)
    if (!user || !hasPermission(user.role, 'edit_inventory')) {
      return NextResponse.json({ error: user ? 'Forbidden' : 'Unauthorized' }, { status: user ? 403 : 401 })
    }

    const body = await request.json()
    const opportunity = await updateOpportunity(params.id, body)
    return opportunity ? NextResponse.json(opportunity) : NextResponse.json({ error: 'Opportunity not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update opportunity' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser(request)
    if (!user || !hasPermission(user.role, 'delete_inventory')) {
      return NextResponse.json({ error: user ? 'Forbidden' : 'Unauthorized' }, { status: user ? 403 : 401 })
    }

    const success = await deleteOpportunity(params.id)
    return success ? NextResponse.json({ message: 'Opportunity deleted' }) : NextResponse.json({ error: 'Opportunity not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete opportunity' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { updateLead, deleteLead, readLeads } from '@/lib/utils/crm-storage'
import { hasPermission } from '@/lib/auth/permissions'
import { getAuthUser } from '@/lib/auth/server-auth'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser(request)
    if (!user || !hasPermission(user.role, 'view_inventory')) {
      return NextResponse.json({ error: user ? 'Forbidden' : 'Unauthorized' }, { status: user ? 403 : 401 })
    }

    const leads = await readLeads()
    const lead = leads.find(l => l.id === params.id)
    return lead ? NextResponse.json(lead) : NextResponse.json({ error: 'Lead not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch lead' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser(request)
    if (!user || !hasPermission(user.role, 'edit_inventory')) {
      return NextResponse.json({ error: user ? 'Forbidden' : 'Unauthorized' }, { status: user ? 403 : 401 })
    }

    const body = await request.json()
    const lead = await updateLead(params.id, body)
    return lead ? NextResponse.json(lead) : NextResponse.json({ error: 'Lead not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser(request)
    if (!user || !hasPermission(user.role, 'delete_inventory')) {
      return NextResponse.json({ error: user ? 'Forbidden' : 'Unauthorized' }, { status: user ? 403 : 401 })
    }

    const success = await deleteLead(params.id)
    return success ? NextResponse.json({ message: 'Lead deleted' }) : NextResponse.json({ error: 'Lead not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 })
  }
}

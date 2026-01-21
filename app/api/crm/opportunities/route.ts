import { NextRequest, NextResponse } from 'next/server'
import { createOpportunity, readOpportunities } from '@/lib/utils/crm-storage'
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

    const opportunities = await readOpportunities()
    return NextResponse.json(opportunities)
  } catch (error) {
    console.error('Failed to fetch opportunities:', error)
    return NextResponse.json({ error: 'Failed to fetch opportunities' }, { status: 500 })
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
    const opportunity = await createOpportunity(body)
    return NextResponse.json(opportunity, { status: 201 })
  } catch (error) {
    console.error('Failed to create opportunity:', error)
    return NextResponse.json({ error: 'Failed to create opportunity' }, { status: 500 })
  }
}

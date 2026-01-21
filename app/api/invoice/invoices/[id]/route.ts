import { NextRequest, NextResponse } from 'next/server'
import { updateInvoice, deleteInvoice, readInvoices } from '@/lib/utils/invoice-storage'
import { hasPermission } from '@/lib/auth/permissions'
import { getAuthUser } from '@/lib/auth/server-auth'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser(request)
    if (!user || !hasPermission(user.role, 'view_inventory')) {
      return NextResponse.json({ error: user ? 'Forbidden' : 'Unauthorized' }, { status: user ? 403 : 401 })
    }

    const invoices = await readInvoices()
    const invoice = invoices.find(inv => inv.id === params.id)
    return invoice ? NextResponse.json(invoice) : NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch invoice' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser(request)
    if (!user || !hasPermission(user.role, 'edit_inventory')) {
      return NextResponse.json({ error: user ? 'Forbidden' : 'Unauthorized' }, { status: user ? 403 : 401 })
    }

    const body = await request.json()
    const invoice = await updateInvoice(params.id, body)
    return invoice ? NextResponse.json(invoice) : NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser(request)
    if (!user || !hasPermission(user.role, 'delete_inventory')) {
      return NextResponse.json({ error: user ? 'Forbidden' : 'Unauthorized' }, { status: user ? 403 : 401 })
    }

    const success = await deleteInvoice(params.id)
    return success ? NextResponse.json({ message: 'Invoice deleted' }) : NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete invoice' }, { status: 500 })
  }
}

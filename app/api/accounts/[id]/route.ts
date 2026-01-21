import { NextRequest, NextResponse } from 'next/server'
import { updateStoredAccount, deleteStoredAccount, getStoredAccountById } from '@/lib/utils/account-storage'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const account = getStoredAccountById(params.id)
    if (!account) {
      return NextResponse.json(
        { success: false, error: 'Account not found' },
        { status: 404 }
      )
    }
    return NextResponse.json({ success: true, data: account })
  } catch (error) {
    console.error('Error fetching account:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch account' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const updates = await request.json()
    const updatedAccount = updateStoredAccount(params.id, updates)
    return NextResponse.json({ success: true, data: updatedAccount })
  } catch (error) {
    console.error('Error updating account:', error)
    const message = error instanceof Error ? error.message : 'Failed to update account'
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    deleteStoredAccount(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting account:', error)
    const message = error instanceof Error ? error.message : 'Failed to delete account'
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    )
  }
}

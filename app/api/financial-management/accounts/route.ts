import { NextRequest, NextResponse } from 'next/server'
import { getAccounts, createAccount, updateAccount, deleteAccount } from '@/lib/db/prisma'
import type { Account, CreateAccount, UpdateAccount } from '@/lib/db/prisma'

export async function GET() {
  try {
    const accounts = await getAccounts()
    return NextResponse.json({
      success: true,
      data: accounts
    })
  } catch (error) {
    console.error('Error fetching accounts:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch accounts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateAccount = await request.json()
    
    const newAccount: Account = await createAccount(body)

    return NextResponse.json({
      success: true,
      data: newAccount
    })
  } catch (error) {
    console.error('Error creating account:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create account' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body: { id: string } & UpdateAccount = await request.json()
    const { id, ...updates } = body
    
    const updatedAccount = await updateAccount(id, updates)

    return NextResponse.json({
      success: true,
      data: updatedAccount
    })
  } catch (error) {
    console.error('Error updating account:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update account' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Account ID is required' },
        { status: 400 }
      )
    }

    await deleteAccount(id)

    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting account:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete account' },
      { status: 500 }
    )
  }
}

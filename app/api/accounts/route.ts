import { NextRequest, NextResponse } from 'next/server'
import { getStoredAccounts, addStoredAccount } from '@/lib/utils/account-storage'

// GET all accounts
export async function GET() {
  try {
    const accounts = getStoredAccounts()
    return NextResponse.json({
      success: true,
      data: accounts,
    })
  } catch (error) {
    console.error('Error fetching accounts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch accounts' },
      { status: 500 }
    )
  }
}

// POST new account
export async function POST(request: NextRequest) {
  try {
    const accountData = await request.json()

    // Validate required fields
    if (!accountData.account_code || !accountData.account_name || !accountData.account_type) {
      return NextResponse.json(
        { error: 'Missing required account information' },
        { status: 400 }
      )
    }

    // Add account to storage
    const newAccount = addStoredAccount(accountData)

    return NextResponse.json({
      success: true,
      data: newAccount,
    }, { status: 201 })
  } catch (error) {
    console.error('Error adding account:', error)
    const message = error instanceof Error ? error.message : 'Failed to add account'
    return NextResponse.json(
      { error: message },
      { status: 400 }
    )
  }
}

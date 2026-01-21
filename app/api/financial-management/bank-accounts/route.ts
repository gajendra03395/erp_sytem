import { NextRequest, NextResponse } from 'next/server'
import { getBankAccounts, getActiveBankAccounts, createBankAccount, updateBankAccount, deleteBankAccount } from '@/lib/db/prisma'
import type { BankAccount, CreateBankAccount, UpdateBankAccount } from '@/lib/db/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const active = searchParams.get('active')
    
    let bankAccounts
    if (active === 'true') {
      bankAccounts = await getActiveBankAccounts()
    } else {
      bankAccounts = await getBankAccounts()
    }

    return NextResponse.json({
      success: true,
      data: bankAccounts
    })
  } catch (error) {
    console.error('Error fetching bank accounts:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bank accounts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateBankAccount = await request.json()
    
    const newBankAccount: BankAccount = await createBankAccount(body)

    return NextResponse.json({
      success: true,
      data: newBankAccount
    })
  } catch (error) {
    console.error('Error creating bank account:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create bank account' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body: { id: string } & UpdateBankAccount = await request.json()
    const { id, ...updates } = body
    
    const updatedBankAccount = await updateBankAccount(id, updates)

    return NextResponse.json({
      success: true,
      data: updatedBankAccount
    })
  } catch (error) {
    console.error('Error updating bank account:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update bank account' },
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
        { success: false, error: 'Bank account ID is required' },
        { status: 400 }
      )
    }

    await deleteBankAccount(id)

    return NextResponse.json({
      success: true,
      message: 'Bank account deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting bank account:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete bank account' },
      { status: 500 }
    )
  }
}

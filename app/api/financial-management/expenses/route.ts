import { NextRequest, NextResponse } from 'next/server'
import { getExpenses, getExpensesByStatus, createExpense, updateExpense, deleteExpense } from '@/lib/db/prisma'
import type { Expense, CreateExpense, UpdateExpense } from '@/lib/db/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    
    let expenses
    if (status) {
      expenses = await getExpensesByStatus(status)
    } else {
      expenses = await getExpenses()
    }

    return NextResponse.json({
      success: true,
      data: expenses
    })
  } catch (error) {
    console.error('Error fetching expenses:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch expenses' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateExpense = await request.json()
    
    const newExpense: Expense = await createExpense(body)

    return NextResponse.json({
      success: true,
      data: newExpense
    })
  } catch (error) {
    console.error('Error creating expense:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create expense' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body: { id: string } & UpdateExpense = await request.json()
    const { id, ...updates } = body
    
    const updatedExpense = await updateExpense(id, updates)

    return NextResponse.json({
      success: true,
      data: updatedExpense
    })
  } catch (error) {
    console.error('Error updating expense:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update expense' },
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
        { success: false, error: 'Expense ID is required' },
        { status: 400 }
      )
    }

    await deleteExpense(id)

    return NextResponse.json({
      success: true,
      message: 'Expense deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting expense:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete expense' },
      { status: 500 }
    )
  }
}

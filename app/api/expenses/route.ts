import { NextRequest, NextResponse } from 'next/server'
import { getStoredExpenses, addStoredExpense } from '@/lib/utils/expense-storage'

// GET all expenses
export async function GET() {
  try {
    const expenses = getStoredExpenses()
    return NextResponse.json({
      success: true,
      data: expenses,
    })
  } catch (error) {
    console.error('Error fetching expenses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch expenses' },
      { status: 500 }
    )
  }
}

// POST new expense
export async function POST(request: NextRequest) {
  try {
    const expenseData = await request.json()

    // Validate required fields
    if (!expenseData.description || !expenseData.amount || !expenseData.category || !expenseData.department || !expenseData.date) {
      return NextResponse.json(
        { error: 'Missing required expense information' },
        { status: 400 }
      )
    }

    // Add expense to storage
    const newExpense = addStoredExpense(expenseData)

    return NextResponse.json({
      success: true,
      data: newExpense,
    }, { status: 201 })
  } catch (error) {
    console.error('Error adding expense:', error)
    const message = error instanceof Error ? error.message : 'Failed to add expense'
    return NextResponse.json(
      { error: message },
      { status: 400 }
    )
  }
}

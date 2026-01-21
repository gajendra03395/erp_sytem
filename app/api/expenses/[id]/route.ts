import { NextRequest, NextResponse } from 'next/server'
import { updateStoredExpense, deleteStoredExpense, getStoredExpenseById } from '@/lib/utils/expense-storage'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const expense = getStoredExpenseById(params.id)
    if (!expense) {
      return NextResponse.json(
        { success: false, error: 'Expense not found' },
        { status: 404 }
      )
    }
    return NextResponse.json({ success: true, data: expense })
  } catch (error) {
    console.error('Error fetching expense:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch expense' },
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
    const updatedExpense = updateStoredExpense(params.id, updates)
    return NextResponse.json({ success: true, data: updatedExpense })
  } catch (error) {
    console.error('Error updating expense:', error)
    const message = error instanceof Error ? error.message : 'Failed to update expense'
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
    deleteStoredExpense(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting expense:', error)
    const message = error instanceof Error ? error.message : 'Failed to delete expense'
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    )
  }
}

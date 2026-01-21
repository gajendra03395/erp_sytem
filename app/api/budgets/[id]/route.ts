import { NextRequest, NextResponse } from 'next/server'
import { updateStoredBudget, deleteStoredBudget, getStoredBudgetById } from '@/lib/utils/budget-storage'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const budget = getStoredBudgetById(params.id)
    if (!budget) {
      return NextResponse.json(
        { success: false, error: 'Budget not found' },
        { status: 404 }
      )
    }
    return NextResponse.json({ success: true, data: budget })
  } catch (error) {
    console.error('Error fetching budget:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch budget' },
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
    const updatedBudget = updateStoredBudget(params.id, updates)
    return NextResponse.json({ success: true, data: updatedBudget })
  } catch (error) {
    console.error('Error updating budget:', error)
    const message = error instanceof Error ? error.message : 'Failed to update budget'
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
    deleteStoredBudget(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting budget:', error)
    const message = error instanceof Error ? error.message : 'Failed to delete budget'
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    )
  }
}

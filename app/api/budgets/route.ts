import { NextRequest, NextResponse } from 'next/server'
import { getStoredBudgets, addStoredBudget } from '@/lib/utils/budget-storage'

// GET all budgets
export async function GET() {
  try {
    const budgets = getStoredBudgets()
    return NextResponse.json({
      success: true,
      data: budgets,
    })
  } catch (error) {
    console.error('Error fetching budgets:', error)
    return NextResponse.json(
      { error: 'Failed to fetch budgets' },
      { status: 500 }
    )
  }
}

// POST new budget
export async function POST(request: NextRequest) {
  try {
    const budgetData = await request.json()

    // Validate required fields
    if (!budgetData.department || !budgetData.category || !budgetData.planned_amount || !budgetData.period || !budgetData.year) {
      return NextResponse.json(
        { error: 'Missing required budget information' },
        { status: 400 }
      )
    }

    // Add budget to storage
    const newBudget = addStoredBudget(budgetData)

    return NextResponse.json({
      success: true,
      data: newBudget,
    }, { status: 201 })
  } catch (error) {
    console.error('Error adding budget:', error)
    const message = error instanceof Error ? error.message : 'Failed to add budget'
    return NextResponse.json(
      { error: message },
      { status: 400 }
    )
  }
}

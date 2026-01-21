import { NextRequest, NextResponse } from 'next/server'
import { getBudgets, getBudgetsByYear, createBudget, updateBudget, deleteBudget } from '@/lib/db/prisma'
import type { Budget, CreateBudget, UpdateBudget } from '@/lib/db/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const year = searchParams.get('year')
    
    let budgets
    if (year) {
      budgets = await getBudgetsByYear(parseInt(year))
    } else {
      budgets = await getBudgets()
    }

    return NextResponse.json({
      success: true,
      data: budgets
    })
  } catch (error) {
    console.error('Error fetching budgets:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch budgets' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateBudget = await request.json()
    
    const newBudget: Budget = await createBudget(body)

    return NextResponse.json({
      success: true,
      data: newBudget
    })
  } catch (error) {
    console.error('Error creating budget:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create budget' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body: { id: string } & UpdateBudget = await request.json()
    const { id, ...updates } = body
    
    const updatedBudget = await updateBudget(id, updates)

    return NextResponse.json({
      success: true,
      data: updatedBudget
    })
  } catch (error) {
    console.error('Error updating budget:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update budget' },
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
        { success: false, error: 'Budget ID is required' },
        { status: 400 }
      )
    }

    await deleteBudget(id)

    return NextResponse.json({
      success: true,
      message: 'Budget deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting budget:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete budget' },
      { status: 500 }
    )
  }
}

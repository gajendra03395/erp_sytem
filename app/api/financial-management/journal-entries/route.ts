import { NextRequest, NextResponse } from 'next/server'
import { getJournalEntries, createJournalEntry, updateJournalEntry, deleteJournalEntry } from '@/lib/db/prisma'
import type { JournalEntry, CreateJournalEntry, UpdateJournalEntry } from '@/lib/db/prisma'

export async function GET() {
  try {
    const entries = await getJournalEntries()
    return NextResponse.json({
      success: true,
      data: entries
    })
  } catch (error) {
    console.error('Error fetching journal entries:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch journal entries' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateJournalEntry = await request.json()
    
    const newEntry: JournalEntry = await createJournalEntry(body)

    return NextResponse.json({
      success: true,
      data: newEntry
    })
  } catch (error) {
    console.error('Error creating journal entry:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create journal entry' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body: { id: string } & UpdateJournalEntry = await request.json()
    const { id, ...updates } = body
    
    const updatedEntry = await updateJournalEntry(id, updates)

    return NextResponse.json({
      success: true,
      data: updatedEntry
    })
  } catch (error) {
    console.error('Error updating journal entry:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update journal entry' },
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
        { success: false, error: 'Journal entry ID is required' },
        { status: 400 }
      )
    }

    await deleteJournalEntry(id)

    return NextResponse.json({
      success: true,
      message: 'Journal entry deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting journal entry:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete journal entry' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { getStoredMachineById, updateStoredMachine, deleteStoredMachine } from '@/lib/utils/machines-storage'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const machine = getStoredMachineById(params.id)
    if (!machine) {
      return NextResponse.json(
        { success: false, error: 'Machine not found' },
        { status: 404 }
      )
    }
    return NextResponse.json({ success: true, data: machine })
  } catch (error) {
    console.error('Error fetching machine:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch machine' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const updatedMachine = updateStoredMachine(params.id, body)
    return NextResponse.json({ success: true, data: updatedMachine })
  } catch (error) {
    console.error('Error updating machine:', error)
    const message = error instanceof Error ? error.message : 'Failed to update machine'
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
    deleteStoredMachine(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting machine:', error)
    const message = error instanceof Error ? error.message : 'Failed to delete machine'
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    )
  }
}

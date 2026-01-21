import { NextRequest, NextResponse } from 'next/server'
import { getStoredQualityCheckById, updateStoredQualityCheck, deleteStoredQualityCheck } from '@/lib/utils/quality-storage'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const record = getStoredQualityCheckById(params.id)
    if (!record) {
      return NextResponse.json(
        { success: false, error: 'QC record not found' },
        { status: 404 }
      )
    }
    return NextResponse.json({ success: true, data: record })
  } catch (error) {
    console.error('Error fetching QC record:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch QC record' },
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
    const updatedRecord = updateStoredQualityCheck(params.id, body)
    return NextResponse.json({ success: true, data: updatedRecord })
  } catch (error) {
    console.error('Error updating QC record:', error)
    const message = error instanceof Error ? error.message : 'Failed to update QC record'
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
    deleteStoredQualityCheck(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting QC record:', error)
    const message = error instanceof Error ? error.message : 'Failed to delete QC record'
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    )
  }
}

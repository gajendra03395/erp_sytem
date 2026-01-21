import { NextRequest, NextResponse } from 'next/server'
import { getStoredQualityChecks, addStoredQualityCheck } from '@/lib/utils/quality-storage'

export async function GET() {
  try {
    const records = getStoredQualityChecks()
    return NextResponse.json({ success: true, data: records })
  } catch (error) {
    console.error('Error fetching QC records:', error)
    return NextResponse.json(
      { error: 'Failed to fetch QC records' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (!body.batch_no || !body.product_name || !body.quantity_inspected || !body.result || !body.inspector_name || !body.inspector_id || !body.inspection_date) {
      return NextResponse.json(
        { error: 'Missing required QC information' },
        { status: 400 }
      )
    }
    const newRecord = addStoredQualityCheck(body)
    return NextResponse.json({ success: true, data: newRecord }, { status: 201 })
  } catch (error) {
    console.error('Error creating QC record:', error)
    const message = error instanceof Error ? error.message : 'Failed to create QC record'
    return NextResponse.json(
      { error: message },
      { status: 400 }
    )
  }
}

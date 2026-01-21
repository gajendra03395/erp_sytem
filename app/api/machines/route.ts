import { NextRequest, NextResponse } from 'next/server'
import { getStoredMachines, addStoredMachine } from '@/lib/utils/machines-storage'

export async function GET() {
  try {
    const machines = getStoredMachines()
    return NextResponse.json({ success: true, data: machines })
  } catch (error) {
    console.error('Error fetching machines:', error)
    return NextResponse.json(
      { error: 'Failed to fetch machines' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const machineData = await request.json()

    if (!machineData.machine_name || !machineData.machine_type || !machineData.last_service_date) {
      return NextResponse.json(
        { error: 'Missing required machine information' },
        { status: 400 }
      )
    }

    const newMachine = addStoredMachine(machineData)
    return NextResponse.json({ success: true, data: newMachine }, { status: 201 })
  } catch (error) {
    console.error('Error creating machine:', error)
    const message = error instanceof Error ? error.message : 'Failed to create machine'
    return NextResponse.json(
      { error: message },
      { status: 400 }
    )
  }
}

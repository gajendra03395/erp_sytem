import { NextResponse } from 'next/server'
import { getTrialBalance } from '@/lib/db/prisma'

export async function GET() {
  try {
    const trialBalanceData = await getTrialBalance()
    return NextResponse.json({
      success: true,
      ...trialBalanceData
    })
  } catch (error) {
    console.error('Error generating trial balance:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate trial balance' },
      { status: 500 }
    )
  }
}

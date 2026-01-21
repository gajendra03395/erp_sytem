import { NextRequest, NextResponse } from 'next/server'
import { getTaxConfigurations, getActiveTaxConfigurations, createTaxConfiguration, updateTaxConfiguration, deleteTaxConfiguration } from '@/lib/db/prisma'
import type { TaxConfiguration, CreateTaxConfiguration, UpdateTaxConfiguration } from '@/lib/db/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const active = searchParams.get('active')
    
    let taxConfigs
    if (active === 'true') {
      taxConfigs = await getActiveTaxConfigurations()
    } else {
      taxConfigs = await getTaxConfigurations()
    }

    return NextResponse.json({
      success: true,
      data: taxConfigs
    })
  } catch (error) {
    console.error('Error fetching tax configurations:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tax configurations' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateTaxConfiguration = await request.json()
    
    const newTaxConfig: TaxConfiguration = await createTaxConfiguration(body)

    return NextResponse.json({
      success: true,
      data: newTaxConfig
    })
  } catch (error) {
    console.error('Error creating tax configuration:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create tax configuration' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body: { id: string } & UpdateTaxConfiguration = await request.json()
    const { id, ...updates } = body
    
    const updatedTaxConfig = await updateTaxConfiguration(id, updates)

    return NextResponse.json({
      success: true,
      data: updatedTaxConfig
    })
  } catch (error) {
    console.error('Error updating tax configuration:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update tax configuration' },
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
        { success: false, error: 'Tax configuration ID is required' },
        { status: 400 }
      )
    }

    await deleteTaxConfiguration(id)

    return NextResponse.json({
      success: true,
      message: 'Tax configuration deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting tax configuration:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete tax configuration' },
      { status: 500 }
    )
  }
}

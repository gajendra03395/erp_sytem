import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma-client'
import type { FinancialReport } from '@/types/financial'

export async function GET() {
  try {
    // Get reports from database - for now using TaxReport as a base
    // In a real implementation, you'd have a dedicated FinancialReport model
    const taxReports = await (prisma as any).taxReport.findMany({
      orderBy: { createdAt: 'desc' }
    })

    // Transform tax reports to financial reports format
    const reports: FinancialReport[] = taxReports.map((report: any) => ({
      id: report.id,
      reportType: 'tax-report' as const,
      title: `Tax Report - ${report.periodStart.toLocaleDateString()} to ${report.periodEnd.toLocaleDateString()}`,
      period: `${report.periodStart.toLocaleDateString()} - ${report.periodEnd.toLocaleDateString()}`,
      generatedAt: report.createdAt.toISOString(),
      data: {
        totalSales: report.totalSales,
        totalPurchases: report.totalPurchases,
        taxableAmount: report.taxableAmount,
        taxAmount: report.taxAmount,
        inputTaxCredit: report.inputTaxCredit,
        netTaxPayable: report.netTaxPayable
      }
    }))

    return NextResponse.json({
      success: true,
      data: reports
    })
  } catch (error) {
    console.error('Error fetching reports:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reports' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { reportType, period } = await request.json()
    
    // Generate report based on type using real database data
    let reportData = {}
    let title = ''
    
    switch (reportType) {
      case 'balance-sheet':
        title = `Balance Sheet - ${period}`
        // Get real data from accounts
        const accounts = await prisma.account.findMany()
        const assets = accounts.filter(acc => acc.type === 'asset').reduce((sum, acc) => sum + acc.balance, 0)
        const liabilities = accounts.filter(acc => acc.type === 'liability').reduce((sum, acc) => sum + acc.balance, 0)
        const equity = accounts.filter(acc => acc.type === 'equity').reduce((sum, acc) => sum + acc.balance, 0)
        
        reportData = {
          assets: { total: assets },
          liabilities: { total: liabilities },
          equity: { total: equity }
        }
        break
        
      case 'income-statement':
        title = `Income Statement - ${period}`
        // Get real data from accounts
        const revenueAccounts = await prisma.account.findMany({ where: { type: 'revenue' } })
        const expenseAccounts = await prisma.account.findMany({ where: { type: 'expense' } })
        const revenue = revenueAccounts.reduce((sum, acc) => sum + acc.balance, 0)
        const expenses = expenseAccounts.reduce((sum, acc) => sum + acc.balance, 0)
        
        reportData = {
          revenue,
          expenses: { total: expenses },
          netIncome: revenue - expenses
        }
        break
        
      case 'cash-flow':
        title = `Cash Flow Statement - ${period}`
        // This would require more complex calculation from journal entries
        reportData = {
          operating: 75000, // Placeholder
          investing: -25000, // Placeholder
          financing: 10000, // Placeholder
          netChange: 60000 // Placeholder
        }
        break
    }

    const newReport: FinancialReport = {
      id: Date.now().toString(),
      reportType,
      title,
      period,
      generatedAt: new Date().toISOString(),
      data: reportData
    }

    return NextResponse.json({
      success: true,
      data: newReport
    })
  } catch (error) {
    console.error('Error generating report:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate report' },
      { status: 500 }
    )
  }
}

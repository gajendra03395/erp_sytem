import { NextRequest, NextResponse } from 'next/server'
import { getInventoryItems, getFinancialStats, getEmployees } from '@/lib/db/prisma'

export async function POST(request: NextRequest) {
  try {
    const { type, format, filters } = await request.json()

    let data: any[] = []
    let filename = ''
    let headers: string[] = []

    switch (type) {
      case 'inventory':
        const inventory = await getInventoryItems()
        data = inventory.map((item: any) => ({
          'Item Name': item.item_name,
          'Stock Level': item.stock_level,
          'Reorder Point': item.reorder_point,
          'Unit': item.unit,
          'Location': item.location,
          'Category': item.category,
          'Unit Cost': item.unit_cost || 0,
          'Warehouse': item.location,
          'Status': item.is_active ? 'Active' : 'Inactive'
        }))
        filename = `inventory_export_${new Date().toISOString().split('T')[0]}`
        headers = ['Item Name', 'Stock Level', 'Reorder Point', 'Unit', 'Location', 'Category', 'Unit Cost', 'Warehouse', 'Status']
        break

      case 'financial':
        const financial = await getFinancialStats()
        data = [{
          'Total Revenue': financial.totalRevenue || 0,
          'Total Expenses': financial.totalExpenses || 0,
          'Net Profit': (financial.totalRevenue || 0) - (financial.totalExpenses || 0),
          'Profit Margin': `${((financial.totalRevenue || 0) - (financial.totalExpenses || 0)) / (financial.totalRevenue || 1) * 100}%`,
          'Total Assets': financial.totalAssets || 0,
          'Total Liabilities': financial.totalLiabilities || 0,
          'Cash Flow': (financial.totalReceivables || 0) - (financial.totalPayables || 0),
          'Export Date': new Date().toLocaleDateString()
        }]
        filename = `financial_export_${new Date().toISOString().split('T')[0]}`
        headers = ['Total Revenue', 'Total Expenses', 'Net Profit', 'Profit Margin', 'Total Assets', 'Total Liabilities', 'Cash Flow', 'Export Date']
        break

      case 'employees':
        const employees = await getEmployees()
        data = employees.map((emp: any) => ({
          'Employee ID': emp.employee_id,
          'Name': emp.name,
          'Email': emp.email,
          'Phone': emp.phone || '',
          'Department': emp.department,
          'Status': emp.status,
          'Join Date': emp.join_date ? new Date(emp.join_date).toLocaleDateString() : '',
          'Created At': new Date(emp.createdAt).toLocaleDateString()
        }))
        filename = `employees_export_${new Date().toISOString().split('T')[0]}`
        headers = ['Employee ID', 'Name', 'Email', 'Phone', 'Department', 'Status', 'Join Date', 'Created At']
        break

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid export type' },
          { status: 400 }
        )
    }

    // Apply filters if provided
    if (filters && Object.keys(filters).length > 0) {
      data = data.filter(item => {
        return Object.entries(filters).every(([key, value]) => {
          if (!value) return true
          const itemValue = item[key]
          if (typeof itemValue === 'string') {
            return itemValue.toLowerCase().includes(value.toString().toLowerCase())
          }
          if (typeof itemValue === 'number') {
            return itemValue === Number(value)
          }
          return true
        })
      })
    }

    if (format === 'csv') {
      // Generate CSV
      const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
      ].join('\n')

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${filename}.csv"`
        }
      })
    } else if (format === 'json') {
      // Generate JSON
      return NextResponse.json({
        success: true,
        data,
        filename: `${filename}.json`
      })
    } else if (format === 'excel') {
      // For Excel, we'll return CSV that can be opened in Excel
      // In a real implementation, you'd use a library like xlsx
      const csvContent = [
        headers.join('\t'),
        ...data.map(row => headers.map(header => row[header] || '').join('\t'))
      ].join('\n')

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'application/vnd.ms-excel',
          'Content-Disposition': `attachment; filename="${filename}.xls"`
        }
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid format' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to export data' },
      { status: 500 }
    )
  }
}

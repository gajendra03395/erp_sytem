import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma-client'
import bcrypt from 'bcryptjs'
import Papa from 'papaparse'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const dataType = formData.get('type') as string
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    // Parse CSV/Excel file using PapaParse for better CSV handling
    const text = await file.text()
    const parseResult = await new Promise<any>((resolve, reject) => {
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header: string) => header.trim(),
        complete: resolve,
        error: reject
      })
    })
    
    const records = parseResult.data || []
    
    if (records.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No data found in file' },
        { status: 400 }
      )
    }
    
    const results = []
    const errors = []
    
    // Process each record
    for (let i = 0; i < records.length; i++) {
      const row = records[i]
      
      try {
        let result
        
        switch (dataType) {
          case 'inventory':
            result = await prisma.inventoryItem.create({
              data: {
                itemName: row['Item Name'] || row['item_name'] || row['itemName'],
                stockLevel: parseInt(row['Stock Level'] || row['stock_level'] || row['stockLevel'] || 0),
                reorderPoint: parseInt(row['Reorder Point'] || row['reorder_point'] || row['reorderPoint'] || 0),
                unit: row['Unit'] || row['unit'],
                location: row['Location'] || row['location'],
                category: row['Category'] || row['category'],
                unitCost: parseFloat(row['Unit Cost'] || row['unit_cost'] || row['unitCost'] || 0),
                warehouseId: row['Warehouse ID'] || row['warehouse_id'] || row['warehouseId'],
                barcode: row['Barcode'] || row['barcode'],
                costMethod: (row['Cost Method'] || row['cost_method'] || 'WEIGHTED_AVERAGE') as 'FIFO' | 'LIFO' | 'WEIGHTED_AVERAGE',
                minStockLevel: parseInt(row['Min Stock Level'] || row['min_stock_level'] || row['minStockLevel'] || 0),
                maxStockLevel: row['Max Stock Level'] || row['max_stock_level'] ? parseInt(row['Max Stock Level'] || row['maxStockLevel']) : undefined,
                leadTimeDays: parseInt(row['Lead Time Days'] || row['lead_time_days'] || row['leadTimeDays'] || 0),
                isActive: (row['Active'] || row['active'] || 'true') === 'true'
              }
            })
            break
            
          case 'employees':
            // Get data from row
            const email = row['Email'] || row['email']
            if (!email) {
              throw new Error(`Email is required for row ${i + 1}`)
            }
            
            // Normalize and validate role
            let role = row['Role'] || row['role'] || 'OPERATOR'
            const validRoles = ['ADMIN', 'SUPERVISOR', 'OPERATOR', 'SUPERUSER']
            if (!validRoles.includes(role.toUpperCase())) {
              role = 'OPERATOR' // Default to OPERATOR if invalid role
            }
            
            // Get other fields
            const employeeId = row['Employee ID'] || row['employee_id'] || `EMP${Date.now()}`
            const name = row['Name'] || row['name']
            const phone = row['Phone'] || row['phone']
            let departmentValue = row['Department'] || row['department'] || 'production'
            const shift = row['Shift'] || row['shift'] || 'Day'
            let statusValue = row['Status'] || row['status'] || 'active'
            
            // Normalize department to match enum values
            const departmentMap: Record<string, string> = {
              'production': 'production',
              'Production': 'production',
              'qc': 'qc',
              'QC': 'qc',
              'Quality Control': 'qc',
              'maintenance': 'maintenance',
              'Maintenance': 'maintenance',
              'admin': 'admin',
              'Admin': 'admin',
              'financial': 'financial',
              'Financial': 'financial',
              'inventory': 'inventory',
              'Inventory': 'inventory',
              'sales': 'sales',
              'Sales': 'sales',
              'hr': 'hr',
              'HR': 'hr'
            }
            const department = departmentMap[departmentValue] || 'production'
            
            // Normalize status to match enum values
            const statusMap: Record<string, string> = {
              'active': 'active',
              'Active': 'active',
              'inactive': 'inactive',
              'Inactive': 'inactive',
              'on_leave': 'on_leave',
              'On Leave': 'on_leave',
              'on-leave': 'on_leave'
            }
            const status = statusMap[statusValue] || 'active'
            
            if (!name || !department) {
              throw new Error(`Name and Department are required for row ${i + 1}`)
            }
            
            // Create or update user
            const passwordHash = await bcrypt.hash('defaultPassword123', 12)
            const user = await prisma.user.upsert({
              where: { email },
              update: {
                role: role as any,
              },
              create: {
                email,
                passwordHash,
                role: role as any,
              }
            })

            // Create or update employee
            result = await prisma.employee.upsert({
              where: { employeeId },
              update: {
                name,
                email,
                phone,
                department: department as any, // Cast to any to bypass enum check
                status: status as any, // Cast to any to bypass enum check
                shift,
                user: {
                  connect: {
                    id: user.id
                  }
                }
              },
              create: {
                employeeId,
                name,
                email,
                phone,
                department: department as any, // Cast to any to bypass enum check
                status: status as any, // Cast to any to bypass enum check
                shift,
                user: {
                  connect: {
                    id: user.id
                  }
                }
              },
              include: {
                user: {
                  select: {
                    email: true,
                    role: true,
                  }
                }
              }
            })
            
            // Generate credentials for the employee
            try {
              const { addEmployeeCredentials } = await import('@/lib/utils/credentials')
              addEmployeeCredentials({
                id: result.id,
                name: result.name,
                email: result.email,
                employee_id: result.employeeId,
                role: result.user?.role || 'OPERATOR'
              })
            } catch (credError) {
              console.error('Failed to generate credentials:', credError)
              // Don't fail the import, just log the error
            }
            
            break
            
          case 'customers':
            result = await prisma.customer.create({
              data: {
                name: row['Name'] || row['name'],
                email: row['Email'] || row['email'],
                phone: row['Phone'] || row['phone'],
                address: row['Address'] || row['address'],
                taxNumber: row['Tax Number'] || row['taxNumber'],
                creditLimit: parseFloat(row['Credit Limit'] || row['creditLimit'] || 0),
                isActive: true
              }
            })
            break
            
          case 'vendors':
            result = await prisma.vendor.create({
              data: {
                name: row['Name'] || row['name'],
                email: row['Email'] || row['email'],
                phone: row['Phone'] || row['phone'],
                address: row['Address'] || row['address'],
                taxNumber: row['Tax Number'] || row['taxNumber'],
                paymentTerms: row['Payment Terms'] || row['paymentTerms'],
                isActive: true
              }
            })
            break
            
          case 'budgets':
            result = await prisma.budget.create({
              data: {
                name: row['Name'] || row['name'],
                department: row['Department'] || row['department'],
                amount: parseFloat(row['Amount'] || row['amount'] || 0),
                spent: 0,
                year: parseInt(row['Year'] || row['year'] || new Date().getFullYear()),
                description: row['Description'] || row['description'],
                isActive: true
              }
            })
            break
            
          case 'expenses':
            result = await prisma.expense.create({
              data: {
                title: row['Title'] || row['title'],
                description: row['Description'] || row['description'],
                amount: parseFloat(row['Amount'] || row['amount'] || 0),
                date: new Date(row['Date'] || row['date']),
                category: row['Category'] || row['category'],
                status: (row['Status'] || row['status'] || 'pending') as 'pending' | 'approved' | 'rejected'
              }
            })
            break
            
          default:
            throw new Error(`Unsupported data type: ${dataType}`)
        }
        
        results.push({
          row: i + 1,
          success: true,
          data: result,
          message: `Successfully imported row ${i + 1}`
        })
        
      } catch (error) {
        errors.push({
          row: i + 1,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          data: row
        })
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Import completed. ${results.length} rows processed, ${errors.length} errors.`,
      results,
      errors,
      totalRows: records.length
    })
    
  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to import data' },
      { status: 500 }
    )
  }
}

// GET endpoint to get import templates and validation rules
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const dataType = searchParams.get('type')
    
    const templates = {
      inventory: {
        name: 'Inventory Items',
        requiredColumns: ['Item Name', 'Stock Level', 'Reorder Point', 'Unit', 'Location', 'Category'],
        optionalColumns: ['Unit Cost', 'Warehouse ID', 'Barcode', 'Cost Method', 'Min Stock Level', 'Max Stock Level', 'Lead Time Days', 'Active'],
        sampleData: {
          'Item Name': 'Sample Item',
          'Stock Level': '100',
          'Reorder Point': '20',
          'Unit': 'pcs',
          'Location': 'Warehouse A',
          'Category': 'Raw Materials',
          'Unit Cost': '10.50',
          'Active': 'true'
        }
      },
      employees: {
        name: 'Employees',
        requiredColumns: ['Name', 'Email', 'Department', 'Status'],
        optionalColumns: ['Phone', 'Shift'],
        sampleData: {
          'Name': 'John Doe',
          'Email': 'john@example.com',
          'Department': 'Production',
          'Status': 'active',
          'Phone': '123-456-7890'
        }
      },
      customers: {
        name: 'Customers',
        requiredColumns: ['Name', 'Email'],
        optionalColumns: ['Phone', 'Address', 'Tax Number', 'Credit Limit'],
        sampleData: {
          'Name': 'Customer ABC',
          'Email': 'customer@abc.com',
          'Phone': '123-456-7890',
          'Address': '123 Main St',
          'Credit Limit': '10000'
        }
      },
      vendors: {
        name: 'Vendors',
        requiredColumns: ['Name', 'Email'],
        optionalColumns: ['Phone', 'Address', 'Tax Number', 'Payment Terms'],
        sampleData: {
          'Name': 'Vendor XYZ',
          'Email': 'vendor@xyz.com',
          'Phone': '123-456-7890',
          'Address': '456 Vendor St',
          'Payment Terms': 'Net 30'
        }
      },
      budgets: {
        name: 'Budgets',
        requiredColumns: ['Name', 'Department', 'Amount', 'Year'],
        optionalColumns: ['Description'],
        sampleData: {
          'Name': 'Q1 Production Budget',
          'Department': 'Production',
          'Amount': '50000',
          'Year': '2024',
          'Description': 'Q1 production budget'
        }
      },
      expenses: {
        name: 'Expenses',
        requiredColumns: ['Title', 'Amount', 'Date', 'Category'],
        optionalColumns: ['Description', 'Status'],
        sampleData: {
          'Title': 'Office Supplies',
          'Amount': '150',
          'Date': '2024-01-15',
          'Category': 'Office',
          'Status': 'pending'
        }
      }
    }
    
    if (dataType && templates[dataType as keyof typeof templates]) {
      return NextResponse.json({
        success: true,
        template: templates[dataType as keyof typeof templates],
        availableTypes: Object.keys(templates)
      })
    }
    
    return NextResponse.json({
      success: true,
      availableTypes: Object.keys(templates),
      templates
    })
    
  } catch (error) {
    console.error('Template fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch templates' },
      { status: 500 }
    )
  }
}

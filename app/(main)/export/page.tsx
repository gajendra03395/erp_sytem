'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Download, 
  FileText, 
  Database, 
  Users, 
  DollarSign, 
  Package,
  Filter,
  Search,
  Calendar,
  Settings,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'

interface ExportOption {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  fields: ExportField[]
  filters?: ExportFilter[]
}

interface ExportField {
  key: string
  label: string
  type: 'text' | 'number' | 'date' | 'boolean'
  required?: boolean
}

interface ExportFilter {
  key: string
  label: string
  type: 'text' | 'select' | 'date' | 'number'
  options?: string[]
}

interface ExportHistory {
  id: string
  type: string
  format: string
  filename: string
  status: 'completed' | 'processing' | 'failed'
  createdAt: Date
  completedAt?: Date
  fileSize?: number
  recordCount?: number
}

export default function DataExportPage() {
  const { theme } = useTheme()
  const [selectedType, setSelectedType] = useState('')
  const [selectedFormat, setSelectedFormat] = useState('csv')
  const [selectedFields, setSelectedFields] = useState<string[]>([])
  const [filters, setFilters] = useState<Record<string, any>>({})
  const [isExporting, setIsExporting] = useState(false)
  const [exportHistory, setExportHistory] = useState<ExportHistory[]>([
    {
      id: '1',
      type: 'inventory',
      format: 'csv',
      filename: 'inventory_export_2024-01-15',
      status: 'completed',
      createdAt: new Date('2024-01-15T10:30:00'),
      completedAt: new Date('2024-01-15T10:30:15'),
      fileSize: 245760,
      recordCount: 156
    },
    {
      id: '2',
      type: 'financial',
      format: 'excel',
      filename: 'financial_export_2024-01-14',
      status: 'completed',
      createdAt: new Date('2024-01-14T16:45:00'),
      completedAt: new Date('2024-01-14T16:45:30'),
      fileSize: 524288,
      recordCount: 1
    },
    {
      id: '3',
      type: 'employees',
      format: 'csv',
      filename: 'employees_export_2024-01-13',
      status: 'completed',
      createdAt: new Date('2024-01-13T09:15:00'),
      completedAt: new Date('2024-01-13T09:15:10'),
      fileSize: 122880,
      recordCount: 45
    }
  ])

  const exportOptions: ExportOption[] = [
    {
      id: 'inventory',
      name: 'Inventory Data',
      description: 'Export inventory items, stock levels, and warehouse information',
      icon: <Package className="h-5 w-5" />,
      fields: [
        { key: 'item_name', label: 'Item Name', type: 'text', required: true },
        { key: 'stock_level', label: 'Stock Level', type: 'number', required: true },
        { key: 'reorder_point', label: 'Reorder Point', type: 'number', required: true },
        { key: 'unit', label: 'Unit', type: 'text', required: true },
        { key: 'location', label: 'Location', type: 'text', required: true },
        { key: 'category', label: 'Category', type: 'text', required: true },
        { key: 'unit_cost', label: 'Unit Cost', type: 'number' },
        { key: 'warehouse_id', label: 'Warehouse ID', type: 'text' },
        { key: 'is_active', label: 'Active Status', type: 'boolean' }
      ],
      filters: [
        { key: 'category', label: 'Category', type: 'select', options: ['Raw Materials', 'Finished Goods', 'Components'] },
        { key: 'location', label: 'Location', type: 'text' },
        { key: 'min_stock', label: 'Min Stock Level', type: 'number' },
        { key: 'max_stock', label: 'Max Stock Level', type: 'number' }
      ]
    },
    {
      id: 'financial',
      name: 'Financial Reports',
      description: 'Export financial statements, transactions, and reports',
      icon: <DollarSign className="h-5 w-5" />,
      fields: [
        { key: 'total_revenue', label: 'Total Revenue', type: 'number', required: true },
        { key: 'total_expenses', label: 'Total Expenses', type: 'number', required: true },
        { key: 'net_profit', label: 'Net Profit', type: 'number', required: true },
        { key: 'profit_margin', label: 'Profit Margin', type: 'number' },
        { key: 'total_assets', label: 'Total Assets', type: 'number' },
        { key: 'total_liabilities', label: 'Total Liabilities', type: 'number' },
        { key: 'cash_flow', label: 'Cash Flow', type: 'number' },
        { key: 'accounts_receivable', label: 'Accounts Receivable', type: 'number' },
        { key: 'accounts_payable', label: 'Accounts Payable', type: 'number' }
      ],
      filters: [
        { key: 'date_from', label: 'Date From', type: 'date' },
        { key: 'date_to', label: 'Date To', type: 'date' },
        { key: 'account_type', label: 'Account Type', type: 'select', options: ['Assets', 'Liabilities', 'Equity', 'Revenue', 'Expenses'] }
      ]
    },
    {
      id: 'employees',
      name: 'Employee Data',
      description: 'Export employee information, roles, and attendance',
      icon: <Users className="h-5 w-5" />,
      fields: [
        { key: 'employee_id', label: 'Employee ID', type: 'text', required: true },
        { key: 'name', label: 'Name', type: 'text', required: true },
        { key: 'email', label: 'Email', type: 'text', required: true },
        { key: 'phone', label: 'Phone', type: 'text' },
        { key: 'department', label: 'Department', type: 'text', required: true },
        { key: 'status', label: 'Status', type: 'text', required: true },
        { key: 'join_date', label: 'Join Date', type: 'date' },
        { key: 'salary', label: 'Salary', type: 'number' },
        { key: 'role', label: 'Role', type: 'text' }
      ],
      filters: [
        { key: 'department', label: 'Department', type: 'select', options: ['Production', 'Quality', 'Maintenance', 'Admin', 'Finance'] },
        { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive', 'On Leave'] },
        { key: 'join_date_from', label: 'Join Date From', type: 'date' },
        { key: 'join_date_to', label: 'Join Date To', type: 'date' }
      ]
    },
    {
      id: 'production',
      name: 'Production Data',
      description: 'Export production orders, work orders, and quality data',
      icon: <Database className="h-5 w-5" />,
      fields: [
        { key: 'order_id', label: 'Order ID', type: 'text', required: true },
        { key: 'product_name', label: 'Product Name', type: 'text', required: true },
        { key: 'quantity', label: 'Quantity', type: 'number', required: true },
        { key: 'status', label: 'Status', type: 'text', required: true },
        { key: 'start_date', label: 'Start Date', type: 'date' },
        { key: 'end_date', label: 'End Date', type: 'date' },
        { key: 'quality_score', label: 'Quality Score', type: 'number' },
        { key: 'efficiency', label: 'Efficiency', type: 'number' }
      ],
      filters: [
        { key: 'status', label: 'Status', type: 'select', options: ['Pending', 'In Progress', 'Completed', 'Cancelled'] },
        { key: 'date_from', label: 'Date From', type: 'date' },
        { key: 'date_to', label: 'Date To', type: 'date' },
        { key: 'min_quality_score', label: 'Min Quality Score', type: 'number' }
      ]
    }
  ]

  const formatOptions = [
    { value: 'csv', label: 'CSV', description: 'Comma-separated values' },
    { value: 'excel', label: 'Excel', description: 'Microsoft Excel format' },
    { value: 'json', label: 'JSON', description: 'JavaScript Object Notation' }
  ]

  const selectedOption = exportOptions.find(option => option.id === selectedType)

  const handleFieldToggle = (fieldKey: string, checked: boolean) => {
    if (checked) {
      setSelectedFields(prev => [...prev, fieldKey])
    } else {
      setSelectedFields(prev => prev.filter(f => f !== fieldKey))
    }
  }

  const handleExport = async () => {
    if (!selectedType || !selectedFormat) return

    setIsExporting(true)
    
    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: selectedType,
          format: selectedFormat,
          fields: selectedFields,
          filters
        })
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        
        // Get filename from response headers or create default
        const contentDisposition = response.headers.get('content-disposition')
        let filename = `${selectedType}_export.${selectedFormat}`
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="(.+)"/)
          if (filenameMatch) {
            filename = filenameMatch[1]
          }
        }
        
        a.download = filename
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        // Add to history
        const newHistoryItem: ExportHistory = {
          id: Date.now().toString(),
          type: selectedType,
          format: selectedFormat,
          filename: filename.replace(/\.[^/.]+$/, ''),
          status: 'completed',
          createdAt: new Date(),
          completedAt: new Date(),
          recordCount: selectedFields.length
        }
        setExportHistory(prev => [newHistoryItem, ...prev])
      } else {
        console.error('Export failed')
      }
    } catch (error) {
      console.error('Export error:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Download className="h-8 w-8 text-green-500" />
            Data Export
          </h1>
          <p className="text-muted-foreground">Export data in various formats</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Exports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exportHistory.length}</div>
            <p className="text-xs text-muted-foreground">All time exports</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {exportHistory.filter(h => {
                const weekAgo = new Date()
                weekAgo.setDate(weekAgo.getDate() - 7)
                return h.createdAt >= weekAgo
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Volume</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {exportHistory.reduce((acc, h) => acc + (h.recordCount || 0), 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Total records</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">File Size</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatFileSize(exportHistory.reduce((acc, h) => acc + (h.fileSize || 0), 0))}
            </div>
            <p className="text-xs text-muted-foreground">Total exported</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Export Configuration */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configure Export</CardTitle>
              <CardDescription>Select data type and configure export options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Data Type Selection */}
              <div>
                <Label>Data Type</Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select data type to export" />
                  </SelectTrigger>
                  <SelectContent>
                    {exportOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        <div className="flex items-center gap-2">
                          {option.icon}
                          {option.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedOption && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {selectedOption.description}
                  </p>
                )}
              </div>

              {/* Format Selection */}
              <div>
                <Label>Export Format</Label>
                <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select export format" />
                  </SelectTrigger>
                  <SelectContent>
                    {formatOptions.map((format) => (
                      <SelectItem key={format.value} value={format.value}>
                        <div>
                          <div className="font-medium">{format.label}</div>
                          <div className="text-sm text-muted-foreground">{format.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Field Selection */}
              {selectedOption && (
                <div>
                  <Label>Fields to Export</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {selectedOption.fields.map((field) => (
                      <div key={field.key} className="flex items-center space-x-2">
                        <Checkbox
                          id={field.key}
                          checked={selectedFields.includes(field.key)}
                          onCheckedChange={(checked) => handleFieldToggle(field.key, checked as boolean)}
                        />
                        <Label htmlFor={field.key} className="text-sm">
                          {field.label}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Filters */}
              {selectedOption && selectedOption.filters && (
                <div>
                  <Label className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filters (Optional)
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    {selectedOption.filters.map((filter) => (
                      <div key={filter.key}>
                        <Label htmlFor={filter.key}>{filter.label}</Label>
                        {filter.type === 'select' ? (
                          <Select
                            value={filters[filter.key] || ''}
                            onValueChange={(value) => setFilters(prev => ({ ...prev, [filter.key]: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={`Select ${filter.label}`} />
                            </SelectTrigger>
                            <SelectContent>
                              {filter.options?.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : filter.type === 'date' ? (
                          <Input
                            type="date"
                            id={filter.key}
                            value={filters[filter.key] || ''}
                            onChange={(e) => setFilters(prev => ({ ...prev, [filter.key]: e.target.value }))}
                          />
                        ) : (
                          <Input
                            type={filter.type}
                            id={filter.key}
                            placeholder={`Enter ${filter.label}`}
                            value={filters[filter.key] || ''}
                            onChange={(e) => setFilters(prev => ({ ...prev, [filter.key]: e.target.value }))}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Export Button */}
              <Button 
                onClick={handleExport} 
                disabled={!selectedType || !selectedFormat || selectedFields.length === 0 || isExporting}
                className="w-full"
              >
                {isExporting ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Export History */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Export History</CardTitle>
              <CardDescription>Recent export activities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {exportHistory.map((history) => {
                const option = exportOptions.find(o => o.id === history.type)
                return (
                  <div key={history.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded">
                        {option?.icon}
                      </div>
                      <div>
                        <div className="font-medium">{history.filename}</div>
                        <div className="text-sm text-muted-foreground">
                          {history.format.toUpperCase()} • {history.recordCount} records
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(history.createdAt)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={history.status === 'completed' ? 'default' : 'secondary'}>
                        {history.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {history.status === 'processing' && <Clock className="h-3 w-3 mr-1" />}
                        {history.status === 'failed' && <AlertTriangle className="h-3 w-3 mr-1" />}
                        {history.status}
                      </Badge>
                      {history.fileSize && (
                        <span className="text-sm text-muted-foreground">
                          {formatFileSize(history.fileSize)}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common export tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Package className="h-4 w-4 mr-2" />
                Export All Inventory
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <DollarSign className="h-4 w-4 mr-2" />
                Export Financial Summary
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Export Employee List
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Database className="h-4 w-4 mr-2" />
                Export Production Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

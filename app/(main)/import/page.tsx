'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  Upload, 
  FileText, 
  Database, 
  Users, 
  Package, 
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Download,
  Eye,
  Trash2,
  FileSpreadsheet
} from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'
import { useAuth } from '@/components/providers/AuthProvider'
import { canEditInventory, canEditFinancial } from '@/lib/auth/permissions'

interface ImportTemplate {
  name: string
  description: string
  requiredColumns: string[]
  optionalColumns: string[]
  sampleData: Record<string, string>
}

interface ImportResult {
  row: number
  success: boolean
  data?: any
  message: string
  error?: string
}

interface ImportHistory {
  id: string
  type: string
  fileName: string
  totalRows: number
  successCount: number
  errorCount: number
  createdAt: Date
  completedAt?: Date
  status: 'processing' | 'completed' | 'failed'
}

export default function DataImportPage() {
  const { theme } = useTheme()
  const { currentRole } = useAuth()
  const [selectedType, setSelectedType] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [importResults, setImportResults] = useState<ImportResult[]>([])
  const [templates, setTemplates] = useState<Record<string, ImportTemplate>>({})
  const [importHistory, setImportHistory] = useState<ImportHistory[]>([])
  const [activeTab, setActiveTab] = useState('upload')
  const [dragActive, setDragActive] = useState(false)

  const dataTypes = [
    { 
      id: 'inventory', 
      name: 'Inventory Items', 
      icon: <Package className="h-5 w-5" />,
      description: 'Import inventory items with stock levels and details' 
    },
    { 
      id: 'employees', 
      name: 'Employees', 
      icon: <Users className="h-5 w-5" />,
      description: 'Import employee information and details' 
    },
    { 
      id: 'customers', 
      name: 'Customers', 
      icon: <Database className="h-5 w-5" />,
      description: 'Import customer data and contact information' 
    },
    { 
      id: 'vendors', 
      name: 'Vendors', 
      icon: <Database className="h-5 w-5" />,
      description: 'Import vendor information and details' 
    },
    { 
      id: 'budgets', 
      name: 'Budgets', 
      icon: <DollarSign className="h-5 w-5" />,
      description: 'Import budget data and financial planning' 
    },
    { 
      id: 'expenses', 
      name: 'Expenses', 
      icon: <FileText className="h-5 w-5" />,
      description: 'Import expense records and transactions' 
    }
  ]

  useEffect(() => {
    fetchTemplates()
    fetchImportHistory()
  }, [])

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/import')
      const data = await response.json()
      if (data.success) {
        setTemplates(data.templates)
      }
    } catch (error) {
      console.error('Failed to fetch templates:', error)
    }
  }

  const fetchImportHistory = async () => {
    try {
      const mockHistory: ImportHistory[] = [
        {
          id: '1',
          type: 'inventory',
          fileName: 'inventory_import_2024_01_15.csv',
          totalRows: 156,
          successCount: 154,
          errorCount: 2,
          createdAt: new Date('2024-01-15T10:30:00'),
          completedAt: new Date('2024-01-15T10:32:15'),
          status: 'completed'
        }
      ]
      setImportHistory(mockHistory)
    } catch (error) {
      console.error('Failed to fetch import history:', error)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setDragActive(false)
    const droppedFile = event.dataTransfer.files[0]
    if (droppedFile) {
      setFile(droppedFile)
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault()
    setDragActive(false)
  }

  const handleImport = async () => {
    if (!file || !selectedType) return

    setIsUploading(true)
    setImportResults([])
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', selectedType)

      const response = await fetch('/api/import', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      
      if (data.success) {
        setImportResults(data.results || [])
        setFile(null)
        setSelectedType('')
      }
    } catch (error) {
      console.error('Import error:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const downloadTemplate = (type: string) => {
    const template = templates[type]
    if (!template) return
    
    const csvContent = [
      template.requiredColumns.join(','),
      template.optionalColumns.join(','),
      ...Object.values(template.sampleData).map(row => 
        Object.entries(row).map(([key, value]) => value
      ).join(',')
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${type}_template.csv`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
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

  const canImport = canEditInventory(currentRole) || canEditFinancial(currentRole)

  if (!canImport) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Access Restricted</h2>
          <p className="text-muted-foreground">You don&apos;t have permission to import data.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Upload className="h-8 w-8 text-blue-500" />
            Data Import System
          </h1>
          <p className="text-muted-foreground">Import data from CSV/Excel files</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => downloadTemplate(selectedType)} disabled={!selectedType}>
            <Download className="h-4 w-4 mr-2" />
            Download Template
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Imports</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{importHistory.length}</div>
            <p className="text-xs text-muted-foreground">All time imports</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {importHistory.length > 0 
                ? ((importHistory.reduce((acc, h) => acc + (h.successCount / h.totalRows) * 100, 0) / importHistory.length).toFixed(1) + '%')
                : '0%'
              }
            </div>
            <p className="text-xs text-muted-foreground">Average success rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Types</CardTitle>
            <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dataTypes.length}</div>
            <p className="text-xs text-muted-foreground">Available for import</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {importHistory.reduce((acc, h) => acc + h.totalRows, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Records imported</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload Data File</CardTitle>
              <CardDescription>Select data type and upload your CSV/Excel file</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Data Type Selection */}
              <div>
                <Label>Data Type</Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select data type to import" />
                  </SelectTrigger>
                  <SelectContent>
                    {dataTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        <div className="flex items-center gap-2">
                          {type.icon}
                          {type.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* File Upload */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <div className="space-y-2">
                  <p className="text-lg font-medium">Drop your CSV or Excel file here</p>
                  <p className="text-sm text-muted-foreground">
                    or click to browse
                  </p>
                </div>
                <Input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileSelect}
                  className="cursor-pointer"
                  disabled={isUploading}
                />
              </div>

              {/* File Info */}
              {file && (
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(file.size)} • {file.type}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setFile(null)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Import Button */}
              <Button 
                onClick={handleImport}
                disabled={!file || !selectedType || isUploading}
                className="w-full"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-b-2 border-primary border-t-transparent" />
                    <span className="ml-2">Importing...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Import Data
                  </>
                )}
              </Button>

              {/* Results */}
              {importResults.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Import Results</h3>
                    <Badge variant={importResults.filter(r => r.success).length === importResults.length ? 'default' : 'secondary'}>
                      {importResults.filter(r => r.success).length}/{importResults.length} Successful
                    </Badge>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {importResults.map((result, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border ${
                          result.success 
                            ? 'border-green-200 bg-green-50' 
                            : 'border-red-200 bg-red-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {result.success ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                            )}
                            <span className="font-medium">Row {result.row}</span>
                          </div>
                          <Badge variant={result.success ? 'default' : 'destructive'}>
                            {result.success ? 'Success' : 'Error'}
                          </Badge>
                        </div>
                        {!result.success && (
                          <p className="text-sm text-red-600 mt-1">
                            {result.error}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(templates).map(([type, template]) => (
              <Card key={type}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileSpreadsheet className="h-5 w-5" />
                    {template.name}
                  </CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Required Columns ({template.requiredColumns.length})</Label>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {template.requiredColumns.map((col) => (
                        <Badge key={col} variant="secondary" className="text-xs">
                          {col}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <Button 
                      onClick={() => downloadTemplate(type)}
                      className="w-full"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Sample CSV
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="space-y-4">
            {importHistory.map((history) => {
              const dataType = dataTypes.find(t => t.id === history.type)
              return (
                <Card key={history.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {dataType?.icon}
                        <div>
                          <div className="font-semibold">{history.fileName}</div>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(history.createdAt)}
                          </p>
                        </div>
                      </div>
                      <Badge variant={history.status === 'completed' ? 'default' : 'secondary'}>
                        {history.status}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Total Rows</p>
                        <p className="font-medium">{history.totalRows.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Success</p>
                        <p className="font-medium text-green-600">{history.successCount}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Errors</p>
                        <p className="font-medium text-red-600">{history.errorCount}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

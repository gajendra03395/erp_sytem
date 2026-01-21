'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Edit, Trash2, DollarSign, Calendar, User, FileText, Eye } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'
import { useAuth } from '@/components/providers/AuthProvider'
import { canEditFinancial } from '@/lib/auth/permissions'
import type { Invoice, Customer } from '@/types/financial'

export default function AccountsReceivablePage() {
  const { theme } = useTheme()
  const { currentRole } = useAuth()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(false)
  const [showInvoiceDialog, setShowInvoiceDialog] = useState(false)

  useEffect(() => {
    fetchReceivablesData()
  }, [])

  const fetchReceivablesData = async () => {
    setLoading(true)
    try {
      const [invoicesRes, customersRes] = await Promise.all([
        fetch('/api/financial-management/receivables'),
        fetch('/api/financial-management/customers')
      ])

      if (invoicesRes.ok) {
        const invoicesData = await invoicesRes.json()
        setInvoices(invoicesData.data || [])
      }

      if (customersRes.ok) {
        const customersData = await customersRes.json()
        setCustomers(customersData.data || [])
      }
    } catch (error) {
      console.error('Error fetching receivables data:', error)
    } finally {
      setLoading(false)
    }
  }

  const totalReceivables = invoices
    .filter(inv => inv.type === 'receivable')
    .reduce((sum, inv) => sum + inv.balanceAmount, 0)

  const overdueAmount = invoices
    .filter(inv => inv.type === 'receivable' && inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.balanceAmount, 0)

  const dueThisMonth = invoices
    .filter(inv => {
      const dueDate = new Date(inv.dueDate)
      const now = new Date()
      return inv.type === 'receivable' && 
             dueDate.getMonth() === now.getMonth() && 
             dueDate.getFullYear() === now.getFullYear()
    })
    .reduce((sum, inv) => sum + inv.balanceAmount, 0)

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Accounts Receivable</h1>
          <p className="text-muted-foreground">Manage customer invoices and collections</p>
        </div>
        <div className="flex gap-2">
          {canEditFinancial(currentRole) && (
            <Dialog open={showInvoiceDialog} onOpenChange={setShowInvoiceDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Invoice
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Customer Invoice</DialogTitle>
                  <DialogDescription>
                    Generate a new invoice for your customers.
                  </DialogDescription>
                </DialogHeader>
                <InvoiceForm 
                  type="receivable" 
                  customers={customers}
                  onClose={() => setShowInvoiceDialog(false)} 
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Receivables</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalReceivables.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              All outstanding customer invoices
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Amount</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">${overdueAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Invoices past due date
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due This Month</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${dueThisMonth.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Payments due this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Invoices</CardTitle>
          <CardDescription>Manage all accounts receivable invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices
                .filter(inv => inv.type === 'receivable')
                .map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {customers.find(c => c.id === invoice.customerId)?.name || 'Unknown Customer'}
                    </div>
                  </TableCell>
                  <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>${invoice.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>${invoice.balanceAmount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={
                      invoice.status === 'paid' ? 'default' :
                      invoice.status === 'overdue' ? 'destructive' :
                      invoice.status === 'sent' ? 'secondary' : 'outline'
                    }>
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {canEditFinancial(currentRole) && (
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function InvoiceForm({ type, customers, onClose }: { 
  type: 'payable' | 'receivable', 
  customers: Customer[],
  onClose: () => void 
}) {
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    customerId: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    subtotal: 0,
    taxAmount: 0,
    totalAmount: 0,
    lineItems: [
      { description: '', quantity: 1, unitPrice: 0, totalAmount: 0, taxRate: 0 }
    ]
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // API call to create invoice would go here
    console.log('Creating invoice:', formData)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="invoiceNumber">Invoice Number</Label>
          <Input
            id="invoiceNumber"
            value={formData.invoiceNumber}
            onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="customerId">Customer</Label>
          <Select value={formData.customerId} onValueChange={(value) => setFormData({ ...formData, customerId: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select customer" />
            </SelectTrigger>
            <SelectContent>
              {customers.map((customer) => (
                <SelectItem key={customer.id} value={customer.id}>
                  {customer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="date">Issue Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="dueDate">Due Date</Label>
          <Input
            id="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Line Items</Label>
        {formData.lineItems.map((item, index) => (
          <div key={index} className="grid grid-cols-5 gap-2">
            <Input placeholder="Description" />
            <Input type="number" placeholder="Qty" />
            <Input type="number" placeholder="Unit Price" />
            <Input type="number" placeholder="Tax Rate" />
            <Input type="number" placeholder="Total" readOnly />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Subtotal</Label>
          <Input value={formData.subtotal} readOnly />
        </div>
        <div>
          <Label>Tax Amount</Label>
          <Input value={formData.taxAmount} readOnly />
        </div>
        <div>
          <Label>Total Amount</Label>
          <Input value={formData.totalAmount} readOnly />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Create Invoice</Button>
      </div>
    </form>
  )
}

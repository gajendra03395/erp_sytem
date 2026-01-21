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
import { Plus, Edit, DollarSign, Clock, CheckCircle, XCircle, AlertTriangle, FileText } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'
import { useAuth } from '@/components/providers/AuthProvider'
import { canEditFinancial } from '@/lib/auth/permissions'
import type { Expense } from '@/types/financial'

export default function ExpenseTrackingPage() {
  const { theme } = useTheme()
  const { currentRole } = useAuth()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(false)
  const [showExpenseDialog, setShowExpenseDialog] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    fetchExpenses()
  }, [])

  const fetchExpenses = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/financial-management/expenses')
      if (response.ok) {
        const data = await response.json()
        setExpenses(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching expenses:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredExpenses = statusFilter === 'all' 
    ? expenses 
    : expenses.filter(expense => expense.status === statusFilter)

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const pendingExpenses = expenses.filter(e => e.status === 'pending').reduce((sum, expense) => sum + expense.amount, 0)
  const approvedExpenses = expenses.filter(e => e.status === 'approved').reduce((sum, expense) => sum + expense.amount, 0)
  const paidExpenses = expenses.filter(e => e.status === 'paid').reduce((sum, expense) => sum + expense.amount, 0)

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Expense Tracking</h1>
          <p className="text-muted-foreground">Manage expenses with approval workflows</p>
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Expenses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
            </SelectContent>
          </Select>
          {canEditFinancial(currentRole) && (
            <Dialog open={showExpenseDialog} onOpenChange={setShowExpenseDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Submit Expense
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Submit New Expense</DialogTitle>
                  <DialogDescription>
                    Submit a new expense for approval and processing.
                  </DialogDescription>
                </DialogHeader>
                <ExpenseForm onClose={() => setShowExpenseDialog(false)} />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              All time expenses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${pendingExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${approvedExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Approved for payment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${paidExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Processed payments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Expenses Table */}
      <Card>
        <CardHeader>
          <CardTitle>Expense Reports</CardTitle>
          <CardDescription>Track and manage all expense submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Expense #</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Cost Center</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">{expense.expenseNumber}</TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{expense.category}</Badge>
                  </TableCell>
                  <TableCell>{expense.costCenter}</TableCell>
                  <TableCell>${expense.amount.toLocaleString()}</TableCell>
                  <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={
                      expense.status === 'paid' ? 'default' :
                      expense.status === 'approved' ? 'secondary' :
                      expense.status === 'pending' ? 'outline' :
                      expense.status === 'rejected' ? 'destructive' : 'outline'
                    }>
                      <div className="flex items-center gap-1">
                        {expense.status === 'pending' && <Clock className="h-3 w-3" />}
                        {expense.status === 'approved' && <CheckCircle className="h-3 w-3" />}
                        {expense.status === 'rejected' && <XCircle className="h-3 w-3" />}
                        {expense.status === 'paid' && <DollarSign className="h-3 w-3" />}
                        {expense.status}
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4" />
                      </Button>
                      {canEditFinancial(currentRole) && expense.status === 'pending' && (
                        <Button variant="outline" size="sm">
                          <CheckCircle className="h-4 w-4" />
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

function ExpenseForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    expenseNumber: '',
    description: '',
    amount: 0,
    category: '',
    costCenter: '',
    date: new Date().toISOString().split('T')[0],
    receiptUrl: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // API call to create expense would go here
    console.log('Creating expense:', formData)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="expenseNumber">Expense Number</Label>
          <Input
            id="expenseNumber"
            value={formData.expenseNumber}
            onChange={(e) => setFormData({ ...formData, expenseNumber: e.target.value })}
            placeholder="e.g., EXP-001"
            required
          />
        </div>
        <div>
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
            min="0"
            step="0.01"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe the expense purpose"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="travel">Travel</SelectItem>
              <SelectItem value="meals">Meals & Entertainment</SelectItem>
              <SelectItem value="supplies">Office Supplies</SelectItem>
              <SelectItem value="software">Software & Subscriptions</SelectItem>
              <SelectItem value="training">Training & Education</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="utilities">Utilities</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="costCenter">Cost Center</Label>
          <Input
            id="costCenter"
            value={formData.costCenter}
            onChange={(e) => setFormData({ ...formData, costCenter: e.target.value })}
            placeholder="e.g., Marketing-001"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="date">Expense Date</Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="receiptUrl">Receipt URL (Optional)</Label>
        <Input
          id="receiptUrl"
          value={formData.receiptUrl}
          onChange={(e) => setFormData({ ...formData, receiptUrl: e.target.value })}
          placeholder="Link to receipt document"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Submit Expense</Button>
      </div>
    </form>
  )
}

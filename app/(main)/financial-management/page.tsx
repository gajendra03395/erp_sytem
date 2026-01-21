'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Edit, Trash2, DollarSign, TrendingUp, TrendingDown, FileText, Calculator, Target } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'
import { useAuth } from '@/components/providers/AuthProvider'
import { canEditFinancial, canViewAnalytics } from '@/lib/auth/permissions'
import type { Account, JournalEntry, TrialBalance, FinancialReport } from '@/types/financial'

export default function FinancialManagementPage() {
  const { theme } = useTheme()
  const { currentRole } = useAuth()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([])
  const [trialBalance, setTrialBalance] = useState<TrialBalance[]>([])
  const [reports, setReports] = useState<FinancialReport[]>([])
  const [loading, setLoading] = useState(false)
  const [showJournalEntryDialog, setShowJournalEntryDialog] = useState(false)

  useEffect(() => {
    fetchFinancialData()
  }, [])

  const fetchFinancialData = async () => {
    setLoading(true)
    try {
      const [accountsRes, entriesRes, trialRes, reportsRes] = await Promise.all([
        fetch('/api/financial-management/accounts'),
        fetch('/api/financial-management/journal-entries'),
        fetch('/api/financial-management/trial-balance'),
        fetch('/api/financial-management/reports')
      ])

      if (accountsRes.ok) {
        const accountsData = await accountsRes.json()
        setAccounts(accountsData.data || [])
      }

      if (entriesRes.ok) {
        const entriesData = await entriesRes.json()
        setJournalEntries(entriesData.data || [])
      }

      if (trialRes.ok) {
        const trialData = await trialRes.json()
        setTrialBalance(trialData.data || [])
      }

      if (reportsRes.ok) {
        const reportsData = await reportsRes.json()
        setReports(reportsData.data || [])
      }
    } catch (error) {
      console.error('Error fetching financial data:', error)
    } finally {
      setLoading(false)
    }
  }

  const totalAssets = accounts
    .filter(acc => acc.accountType === 'asset')
    .reduce((sum, acc) => sum + acc.balance, 0)

  const totalLiabilities = accounts
    .filter(acc => acc.accountType === 'liability')
    .reduce((sum, acc) => sum + acc.balance, 0)

  const totalEquity = accounts
    .filter(acc => acc.accountType === 'equity')
    .reduce((sum, acc) => sum + acc.balance, 0)

  const totalRevenue = accounts
    .filter(acc => acc.accountType === 'revenue')
    .reduce((sum, acc) => sum + acc.balance, 0)

  const totalExpenses = accounts
    .filter(acc => acc.accountType === 'expense')
    .reduce((sum, acc) => sum + acc.balance, 0)

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Financial Management</h1>
          <p className="text-muted-foreground">Complete accounting and financial operations</p>
        </div>
        <div className="flex gap-2">
          {canEditFinancial(currentRole) && (
            <Dialog open={showJournalEntryDialog} onOpenChange={setShowJournalEntryDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Journal Entry
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Journal Entry</DialogTitle>
                  <DialogDescription>
                    Create a new journal entry for your accounting records.
                  </DialogDescription>
                </DialogHeader>
                <JournalEntryForm onClose={() => setShowJournalEntryDialog(false)} />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalAssets.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +2.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Liabilities</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalLiabilities.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingDown className="h-3 w-3 inline mr-1" />
              -1.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +5.8% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingDown className="h-3 w-3 inline mr-1" />
              -3.1% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="accounts" className="space-y-4">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="journal">Journal</TabsTrigger>
          <TabsTrigger value="trial-balance">Trial Balance</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="payables">Payables</TabsTrigger>
          <TabsTrigger value="receivables">Receivables</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Chart of Accounts</CardTitle>
              <CardDescription>Manage your account structure and balances</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account Code</TableHead>
                    <TableHead>Account Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell className="font-medium">{account.accountCode}</TableCell>
                      <TableCell>{account.accountName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {account.accountType}
                        </Badge>
                      </TableCell>
                      <TableCell>${account.balance.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={account.isActive ? "default" : "secondary"}>
                          {account.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="journal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Journal Entries</CardTitle>
              <CardDescription>View and manage journal entries</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Entry Number</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Total Debit</TableHead>
                    <TableHead>Total Credit</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {journalEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">{entry.entryNumber}</TableCell>
                      <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                      <TableCell>{entry.description}</TableCell>
                      <TableCell>${entry.totalDebit.toLocaleString()}</TableCell>
                      <TableCell>${entry.totalCredit.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={
                          entry.status === 'posted' ? 'default' :
                          entry.status === 'draft' ? 'secondary' : 'destructive'
                        }>
                          {entry.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trial-balance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trial Balance</CardTitle>
              <CardDescription>Current trial balance for all accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account Code</TableHead>
                    <TableHead>Account Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Debit Balance</TableHead>
                    <TableHead>Credit Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trialBalance.map((item) => (
                    <TableRow key={item.accountCode}>
                      <TableCell className="font-medium">{item.accountCode}</TableCell>
                      <TableCell>{item.accountName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.accountType}</Badge>
                      </TableCell>
                      <TableCell>${item.debitBalance.toLocaleString()}</TableCell>
                      <TableCell>${item.creditBalance.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Reports</CardTitle>
              <CardDescription>Generate and view financial reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Button className="h-20 flex-col">
                  <FileText className="h-6 w-6 mb-2" />
                  Balance Sheet
                </Button>
                <Button className="h-20 flex-col" variant="outline">
                  <TrendingUp className="h-6 w-6 mb-2" />
                  Income Statement
                </Button>
                <Button className="h-20 flex-col" variant="outline">
                  <DollarSign className="h-6 w-6 mb-2" />
                  Cash Flow
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Type</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Generated At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>
                        <Badge variant="outline">{report.reportType}</Badge>
                      </TableCell>
                      <TableCell>{report.title}</TableCell>
                      <TableCell>{report.period}</TableCell>
                      <TableCell>{new Date(report.generatedAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payables" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Accounts Payable</CardTitle>
              <CardDescription>Manage vendor invoices and payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <DollarSign className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Accounts Payable Module</h3>
                <p className="text-muted-foreground">Vendor invoice management coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="receivables" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Accounts Receivable</CardTitle>
              <CardDescription>Manage customer invoices and collections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <DollarSign className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Accounts Receivable Module</h3>
                <p className="text-muted-foreground">Customer invoice management coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Budget Management</CardTitle>
              <CardDescription>Departmental budgets and variance analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Target className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Budget Management</h3>
                <p className="text-muted-foreground mb-4">Complete budget tracking and analysis</p>
                <Button onClick={() => window.location.href = '/financial-management/budget'}>
                  Open Budget Module
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Expense Tracking</CardTitle>
              <CardDescription>Manage expenses with approval workflows</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <DollarSign className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Expense Tracking</h3>
                <p className="text-muted-foreground mb-4">Complete expense management system</p>
                <Button onClick={() => window.location.href = '/financial-management/expenses'}>
                  Open Expense Module
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function JournalEntryForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    lines: [
      { accountId: '', debit: 0, credit: 0, description: '' },
      { accountId: '', debit: 0, credit: 0, description: '' }
    ]
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // API call to create journal entry would go here
    console.log('Creating journal entry:', formData)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Entry Lines</Label>
        {formData.lines.map((line, index) => (
          <div key={index} className="grid grid-cols-4 gap-2">
            <Input placeholder="Account" />
            <Input type="number" placeholder="Debit" />
            <Input type="number" placeholder="Credit" />
            <Input placeholder="Description" />
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Create Entry</Button>
      </div>
    </form>
  )
}

'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Edit, TrendingUp, TrendingDown, DollarSign, Target, AlertTriangle } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'
import { useAuth } from '@/components/providers/AuthProvider'
import { canEditFinancial } from '@/lib/auth/permissions'
import type { Budget } from '@/types/financial'

export default function BudgetManagementPage() {
  const { theme } = useTheme()
  const { currentRole } = useAuth()
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [loading, setLoading] = useState(false)
  const [showBudgetDialog, setShowBudgetDialog] = useState(false)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString())

  const fetchBudgets = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/financial-management/budgets?year=${selectedYear}`)
      if (response.ok) {
        const data = await response.json()
        setBudgets(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching budgets:', error)
    } finally {
      setLoading(false)
    }
  }, [selectedYear])

  useEffect(() => {
    fetchBudgets()
  }, [fetchBudgets])

  const totalBudgeted = budgets.reduce((sum, budget) => sum + budget.budgetedAmount, 0)
  const totalActual = budgets.reduce((sum, budget) => sum + budget.actualAmount, 0)
  const totalVariance = totalBudgeted - totalActual
  const variancePercentage = totalBudgeted > 0 ? (totalVariance / totalBudgeted) * 100 : 0

  const overBudgetCount = budgets.filter(b => b.actualAmount > b.budgetedAmount).length

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Budget Management</h1>
          <p className="text-muted-foreground">Departmental budgets and variance analysis</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>
          {canEditFinancial(currentRole) && (
            <Dialog open={showBudgetDialog} onOpenChange={setShowBudgetDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Budget
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Department Budget</DialogTitle>
                  <DialogDescription>
                    Set up a new budget for a department and category.
                  </DialogDescription>
                </DialogHeader>
                <BudgetForm onClose={() => setShowBudgetDialog(false)} />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budgeted</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBudgeted.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              For {selectedYear}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Actual</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalActual.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Year to date spending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Variance</CardTitle>
            {totalVariance >= 0 ? (
              <TrendingDown className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingUp className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalVariance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${Math.abs(totalVariance).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {variancePercentage.toFixed(1)}% variance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Over Budget</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overBudgetCount}</div>
            <p className="text-xs text-muted-foreground">
              Departments over budget
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Budgets Table */}
      <Card>
        <CardHeader>
          <CardTitle>Department Budgets</CardTitle>
          <CardDescription>Budget vs actual analysis for all departments</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Budgeted</TableHead>
                <TableHead>Actual</TableHead>
                <TableHead>Variance</TableHead>
                <TableHead>Variance %</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {budgets.map((budget) => {
                const variance = budget.budgetedAmount - budget.actualAmount
                const variancePercentage = budget.budgetedAmount > 0 ? (variance / budget.budgetedAmount) * 100 : 0
                
                return (
                  <TableRow key={budget.id}>
                    <TableCell className="font-medium">{budget.departmentName}</TableCell>
                    <TableCell>{budget.category}</TableCell>
                    <TableCell>${budget.budgetedAmount.toLocaleString()}</TableCell>
                    <TableCell>${budget.actualAmount.toLocaleString()}</TableCell>
                    <TableCell className={variance >= 0 ? 'text-green-600' : 'text-red-600'}>
                      ${Math.abs(variance).toLocaleString()}
                    </TableCell>
                    <TableCell className={variance >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {variancePercentage.toFixed(1)}%
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        budget.status === 'active' ? 'default' : 'secondary'
                      }>
                        {budget.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {canEditFinancial(currentRole) && (
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function BudgetForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    departmentId: '',
    departmentName: '',
    fiscalYear: new Date().getFullYear(),
    category: '',
    budgetedAmount: 0,
    period: 'annual'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // API call to create budget would go here
    console.log('Creating budget:', formData)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="departmentName">Department Name</Label>
          <Input
            id="departmentName"
            value={formData.departmentName}
            onChange={(e) => setFormData({ ...formData, departmentName: e.target.value })}
            placeholder="e.g., Marketing, Operations, IT"
            required
          />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="personnel">Personnel</SelectItem>
              <SelectItem value="operations">Operations</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="it">IT & Technology</SelectItem>
              <SelectItem value="facilities">Facilities</SelectItem>
              <SelectItem value="training">Training & Development</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fiscalYear">Fiscal Year</Label>
          <Input
            id="fiscalYear"
            type="number"
            value={formData.fiscalYear}
            onChange={(e) => setFormData({ ...formData, fiscalYear: parseInt(e.target.value) })}
            min="2020"
            max="2030"
            required
          />
        </div>
        <div>
          <Label htmlFor="budgetedAmount">Budgeted Amount</Label>
          <Input
            id="budgetedAmount"
            type="number"
            value={formData.budgetedAmount}
            onChange={(e) => setFormData({ ...formData, budgetedAmount: parseFloat(e.target.value) })}
            min="0"
            step="0.01"
            required
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Create Budget</Button>
      </div>
    </form>
  )
}

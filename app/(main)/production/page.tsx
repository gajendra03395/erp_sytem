'use client'

import { useState } from 'react'
import { useWorkOrders, useBOMs } from '@/lib/hooks/useProduction'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from '@/components/ui/table'
import { Search, Plus, Edit, Trash2, Calendar, AlertCircle, CheckCircle, Clock, XCircle, TrendingUp, TrendingDown, BarChart3, Activity, Target, Zap, Filter, Download } from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'
import { WorkOrder, CreateWorkOrderRequest, BOMItem, CreateBOMRequest } from '@/types/production'
import { BulkImportButton } from '@/components/ui/BulkImportButton'

// CreateWorkOrderForm component
function CreateWorkOrderForm({ onSubmit, onCancel, editingWO, selectedMonth }: any) {
  const [formData, setFormData] = useState({
    order_no: editingWO?.order_no || '',
    product_name: editingWO?.product_name || '',
    product_sku: editingWO?.product_sku || '',
    quantity: editingWO?.quantity || 0,
    status: editingWO?.status || 'pending',
    start_date: editingWO?.start_date || new Date().toISOString().split('T')[0],
    end_date: editingWO?.end_date || '',
    bom_id: editingWO?.bom_id || '',
    notes: editingWO?.notes || '',
    month: selectedMonth
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingWO) {
      onSubmit({ ...formData, id: editingWO.id })
    } else {
      onSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="order_no">Order Number</Label>
          <Input
            id="order_no"
            value={formData.order_no}
            onChange={(e) => setFormData({ ...formData, order_no: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="product_sku">Product SKU</Label>
          <Input
            id="product_sku"
            value={formData.product_sku}
            onChange={(e) => setFormData({ ...formData, product_sku: e.target.value })}
            required
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="product_name">Product Name</Label>
        <Input
          id="product_name"
          value={formData.product_name}
          onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
            required
          />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="start_date">Start Date</Label>
          <Input
            id="start_date"
            type="date"
            value={formData.start_date}
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="end_date">End Date</Label>
          <Input
            id="end_date"
            type="date"
            value={formData.end_date}
            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
        />
      </div>
      
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {editingWO ? 'Update' : 'Create'} Work Order
        </Button>
      </DialogFooter>
    </form>
  )
}

export default function ProductionPage() {
  const { user } = useAuth()
  const { workOrders, loading: woLoading, error: woError, createWorkOrder, updateWorkOrder, deleteWorkOrder } = useWorkOrders()
  const { boms, loading: bomLoading, createBOM } = useBOMs()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isCreateWOOpen, setIsCreateWOOpen] = useState(false)
  const [isCreateBOMOpen, setIsCreateBOMOpen] = useState(false)
  const [editingWO, setEditingWO] = useState<WorkOrder | null>(null)
  
  // Monthly tracking states
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)) // YYYY-MM format
  const [showCharts, setShowCharts] = useState(false)
  const [monthlyData, setMonthlyData] = useState<any[]>([])

  const canManage = user?.role && ['ADMIN', 'SUPERVISOR'].includes(user.role)

  // Get current month work orders
  const currentMonthWorkOrders = (workOrders || []).filter(wo => {
    const woDate = new Date(wo.created_at || new Date())
    const woMonth = woDate.toISOString().slice(0, 7)
    return woMonth === selectedMonth
  })

  const filteredWorkOrders = (currentMonthWorkOrders || []).filter(wo => {
    const matchesSearch = wo.order_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         wo.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         wo.product_sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || wo.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Calculate monthly stats
  const monthlyStats = {
    totalOrders: (currentMonthWorkOrders || []).length,
    completedOrders: (currentMonthWorkOrders || []).filter(wo => wo.status === 'completed').length,
    inProgressOrders: (currentMonthWorkOrders || []).filter(wo => wo.status === 'in_progress').length,
    pendingOrders: (currentMonthWorkOrders || []).filter(wo => wo.status === 'pending').length,
    totalQuantity: (currentMonthWorkOrders || []).reduce((sum, wo) => sum + wo.quantity, 0),
    completedQuantity: (currentMonthWorkOrders || []).filter(wo => wo.status === 'completed').reduce((sum, wo) => sum + wo.quantity, 0),
    efficiency: (currentMonthWorkOrders || []).length > 0 
      ? Math.round(((currentMonthWorkOrders || []).filter(wo => wo.status === 'completed').length / (currentMonthWorkOrders || []).length) * 100)
      : 0
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      pending: { label: 'Pending', variant: 'secondary' },
      in_progress: { label: 'In Progress', variant: 'default' },
      completed: { label: 'Completed', variant: 'outline' },
      cancelled: { label: 'Cancelled', variant: 'destructive' }
    }
    const config = variants[status] || { label: status, variant: 'default' }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const handleCreateWO = async (data: CreateWorkOrderRequest) => {
    try {
      if (editingWO) {
        await updateWorkOrder(editingWO.id, data)
        setEditingWO(null)
      } else {
        await createWorkOrder(data)
      }
      setIsCreateWOOpen(false)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create work order')
    }
  }

  const handleCreateBOM = async (data: CreateBOMRequest) => {
    await createBOM(data)
    setIsCreateBOMOpen(false)
  }

  if (woLoading || bomLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (woError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600">Error: {woError}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Premium Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Production Management
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Advanced Manufacturing & Monthly Analytics
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Month Selector */}
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/50 backdrop-blur-sm">
              <Calendar className="h-5 w-5 text-blue-500" />
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-transparent border-none outline-none text-gray-800 dark:text-white font-medium"
              />
            </div>
            
            {/* Charts Toggle Button */}
            <button
              onClick={() => setShowCharts(!showCharts)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                showCharts
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
              }`}
            >
              <BarChart3 className="h-5 w-5" />
              {showCharts ? 'Hide Charts' : 'Show Charts'}
            </button>

            {canManage && (
              <>
                <BulkImportButton
                  module="production"
                  onComplete={() => {}}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                  }`}
                />
                <Dialog open={isCreateWOOpen} onOpenChange={setIsCreateWOOpen}>
                  <DialogTrigger asChild>
                    <button className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                      <Plus className="h-5 w-5" />
                      New Order
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create Work Order</DialogTitle>
                      <DialogDescription>
                        Create a new production work order with monthly tracking.
                      </DialogDescription>
                    </DialogHeader>
                    <CreateWorkOrderForm 
                      onSubmit={handleCreateWO} 
                      onCancel={() => setIsCreateWOOpen(false)} 
                      editingWO={editingWO}
                      selectedMonth={selectedMonth}
                    />
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>
        </div>

        {/* Monthly Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="relative group bg-slate-900/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 dark:border-slate-800/50 rounded-2xl p-6 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 opacity-10 rounded-2xl group-hover:opacity-20 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 bg-opacity-20">
                  <Target className="h-6 w-6 text-blue-400" />
                </div>
                <div className="flex items-center space-x-1 text-green-400 text-sm">
                  <TrendingUp className="h-3 w-3" />
                  <span>+12%</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {monthlyStats.totalOrders}
              </div>
              <div className="text-sm text-gray-400">
                Total Orders
              </div>
            </div>
          </div>

          <div className="relative group bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 opacity-10 rounded-2xl group-hover:opacity-20 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 bg-opacity-20">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                </div>
                <div className="flex items-center space-x-1 text-green-400 text-sm">
                  <TrendingUp className="h-3 w-3" />
                  <span>+8%</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {monthlyStats.completedOrders}
              </div>
              <div className="text-sm text-gray-400">
                Completed
              </div>
            </div>
          </div>

          <div className="relative group bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500 opacity-10 rounded-2xl group-hover:opacity-20 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 bg-opacity-20">
                  <Clock className="h-6 w-6 text-orange-400" />
                </div>
                <div className="flex items-center space-x-1 text-yellow-400 text-sm">
                  <TrendingDown className="h-3 w-3" />
                  <span>-3%</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {monthlyStats.inProgressOrders}
              </div>
              <div className="text-sm text-gray-400">
                In Progress
              </div>
            </div>
          </div>

          <div className="relative group bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-10 rounded-2xl group-hover:opacity-20 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 bg-opacity-20">
                  <Activity className="h-6 w-6 text-purple-400" />
                </div>
                <div className="flex items-center space-x-1 text-green-400 text-sm">
                  <TrendingUp className="h-3 w-3" />
                  <span>+15%</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {monthlyStats.totalQuantity.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">
                Total Quantity
              </div>
            </div>
          </div>

          <div className="relative group bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-500 opacity-10 rounded-2xl group-hover:opacity-20 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 bg-opacity-20">
                  <Zap className="h-6 w-6 text-cyan-400" />
                </div>
                <div className="flex items-center space-x-1 text-green-400 text-sm">
                  <TrendingUp className="h-3 w-3" />
                  <span>+5%</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {monthlyStats.efficiency}%
              </div>
              <div className="text-sm text-gray-400">
                Efficiency
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search production orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/50 text-gray-800 dark:text-white placeholder-gray-500 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48 px-4 py-3 rounded-xl border border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Charts Section */}
        {showCharts && (
          <div className="mb-8 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/50 backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">
              Monthly Production Analytics - {new Date(selectedMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Production Volume Chart */}
              <div className="p-4 rounded-xl border border-slate-200/50 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/50">
                <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Production Volume</h4>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <BarChart3 className="h-12 w-12 mr-3" />
                  <span>Chart: {monthlyStats.totalQuantity} units produced</span>
                </div>
              </div>
              
              {/* Efficiency Rate Chart */}
              <div className="p-4 rounded-xl border border-slate-200/50 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/50">
                <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Efficiency Rate</h4>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <Activity className="h-12 w-12 mr-3" />
                  <span>Chart: {monthlyStats.efficiency}% efficiency</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Production Orders Table */}
        <div className="rounded-2xl border border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/50 backdrop-blur-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              Production Orders - {new Date(selectedMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {filteredWorkOrders.length} orders found
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200/50 dark:border-slate-700/50">
                  <TableHead className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Order No
                  </TableHead>
                  <TableHead className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Product
                  </TableHead>
                  <TableHead className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    SKU
                  </TableHead>
                  <TableHead className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Quantity
                  </TableHead>
                  <TableHead className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </TableHead>
                  <TableHead className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Start Date
                  </TableHead>
                  <TableHead className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Completion Date
                  </TableHead>
                  <TableHead className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWorkOrders.map((order) => (
                  <TableRow key={order.id} className="border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {order.order_no}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {order.product_name}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {order.product_sku}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {order.quantity.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(order.status)}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(order.start_date).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {order.completion_date ? new Date(order.completion_date).toLocaleDateString() : '-'}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        {canManage && (
                          <>
                            <button
                              onClick={() => {
                                setEditingWO(order)
                                setIsCreateWOOpen(true)
                              }}
                              className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('Are you sure you want to delete this work order?')) {
                                  deleteWorkOrder(order.id)
                                }
                              }}
                              className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}

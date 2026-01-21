'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Play, 
  Pause, 
  Settings, 
  Clock, 
  Mail, 
  Bell, 
  CheckCircle, 
  AlertTriangle,
  Zap,
  Calendar,
  FileText,
  Package,
  DollarSign,
  Users,
  BarChart3,
  Activity
} from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'

interface Workflow {
  id: string
  name: string
  description: string
  trigger: string
  actions: WorkflowAction[]
  isActive: boolean
  lastRun?: Date
  nextRun?: Date
  runCount: number
  successRate: number
  createdAt: Date
}

interface WorkflowAction {
  id: string
  type: string
  config: Record<string, any>
  order: number
}

export default function AutomationWorkflowsPage() {
  const { theme } = useTheme()
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: '1',
      name: 'Low Stock Alert',
      description: 'Send notifications when items run low on stock',
      trigger: 'stock_level_low',
      actions: [
        {
          id: '1',
          type: 'send_email',
          config: {
            recipients: ['manager@company.com'],
            subject: 'Low Stock Alert',
            template: 'low_stock_alert'
          },
          order: 1
        },
        {
          id: '2',
          type: 'create_task',
          config: {
            assignee: 'purchasing',
            priority: 'high',
            title: 'Reorder Required'
          },
          order: 2
        }
      ],
      isActive: true,
      lastRun: new Date('2024-01-15T10:30:00'),
      nextRun: new Date('2024-01-15T11:00:00'),
      runCount: 45,
      successRate: 100,
      createdAt: new Date('2024-01-01T00:00:00')
    },
    {
      id: '2',
      name: 'Daily Financial Report',
      description: 'Generate and email daily financial summary',
      trigger: 'schedule',
      actions: [
        {
          id: '1',
          type: 'generate_report',
          config: {
            reportType: 'financial_daily',
            format: 'pdf'
          },
          order: 1
        },
        {
          id: '2',
          type: 'send_email',
          config: {
            recipients: ['finance@company.com', 'ceo@company.com'],
            subject: 'Daily Financial Report',
            template: 'financial_report'
          },
          order: 2
        }
      ],
      isActive: true,
      lastRun: new Date('2024-01-15T09:00:00'),
      nextRun: new Date('2024-01-16T09:00:00'),
      runCount: 30,
      successRate: 96.7,
      createdAt: new Date('2024-01-01T00:00:00')
    },
    {
      id: '3',
      name: 'Quality Control Escalation',
      description: 'Escalate failed quality inspections',
      trigger: 'quality_check_failed',
      actions: [
        {
          id: '1',
          type: 'send_notification',
          config: {
            channels: ['email', 'sms'],
            recipients: ['quality_manager@company.com'],
            message: 'Quality check failed - immediate attention required'
          },
          order: 1
        },
        {
          id: '2',
          type: 'create_ticket',
          config: {
            priority: 'critical',
            category: 'quality',
            assignee: 'quality_team'
          },
          order: 2
        }
      ],
      isActive: true,
      lastRun: new Date('2024-01-14T14:20:00'),
      runCount: 8,
      successRate: 100,
      createdAt: new Date('2024-01-10T00:00:00')
    },
    {
      id: '4',
      name: 'Customer Onboarding',
      description: 'Welcome new customers and setup initial account',
      trigger: 'customer_created',
      actions: [
        {
          id: '1',
          type: 'send_email',
          config: {
            recipients: ['{{customer_email}}'],
            subject: 'Welcome to our platform!',
            template: 'welcome_email'
          },
          order: 1
        },
        {
          id: '2',
          type: 'create_task',
          config: {
            assignee: 'sales_team',
            priority: 'medium',
            title: 'Follow up with new customer'
          },
          order: 2
        }
      ],
      isActive: false,
      runCount: 0,
      successRate: 0,
      createdAt: new Date('2024-01-12T00:00:00')
    }
  ])

  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null)
  const [isCreatingNew, setIsCreatingNew] = useState(false)
  const [activeTab, setActiveTab] = useState('workflows')

  const triggerTypes = [
    { value: 'stock_level_low', label: 'Stock Level Low', icon: Package },
    { value: 'schedule', label: 'Schedule', icon: Calendar },
    { value: 'quality_check_failed', label: 'Quality Check Failed', icon: AlertTriangle },
    { value: 'customer_created', label: 'Customer Created', icon: Users },
    { value: 'invoice_overdue', label: 'Invoice Overdue', icon: DollarSign },
    { value: 'report_generated', label: 'Report Generated', icon: FileText }
  ]

  const actionTypes = [
    { value: 'send_email', label: 'Send Email', icon: Mail },
    { value: 'send_notification', label: 'Send Notification', icon: Bell },
    { value: 'create_task', label: 'Create Task', icon: CheckCircle },
    { value: 'create_ticket', label: 'Create Ticket', icon: FileText },
    { value: 'generate_report', label: 'Generate Report', icon: BarChart3 },
    { value: 'update_inventory', label: 'Update Inventory', icon: Package }
  ]

  const toggleWorkflow = (workflowId: string) => {
    setWorkflows(prev => prev.map(w => 
      w.id === workflowId ? { ...w, isActive: !w.isActive } : w
    ))
  }

  const runWorkflowManually = (workflowId: string) => {
    // Simulate manual run
    console.log(`Running workflow ${workflowId} manually`)
  }

  const formatDateTime = (date: Date) => {
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
            <Zap className="h-8 w-8 text-yellow-500" />
            Automation Workflows
          </h1>
          <p className="text-muted-foreground">Configure automated business processes</p>
        </div>
        <Button onClick={() => setIsCreatingNew(true)}>
          <Play className="h-4 w-4 mr-2" />
          Create Workflow
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workflows</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workflows.length}</div>
            <p className="text-xs text-muted-foreground">
              {workflows.filter(w => w.isActive).length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {(workflows.reduce((acc, w) => acc + w.successRate, 0) / workflows.length).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Average success rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Runs</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workflows.reduce((acc, w) => acc + w.runCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">All time executions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {workflows.filter(w => w.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="triggers">Triggers</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="workflows" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {workflows.map((workflow) => (
              <Card key={workflow.id} className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {workflow.name}
                        <Badge variant={workflow.isActive ? 'default' : 'secondary'}>
                          {workflow.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </CardTitle>
                      <CardDescription>{workflow.description}</CardDescription>
                    </div>
                    <Switch
                      checked={workflow.isActive}
                      onCheckedChange={() => toggleWorkflow(workflow.id)}
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Last run: {workflow.lastRun ? formatDateTime(workflow.lastRun) : 'Never'}</span>
                  </div>
                  
                  {workflow.nextRun && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Next run: {formatDateTime(workflow.nextRun)}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Runs:</span>
                      <span className="ml-2 font-medium">{workflow.runCount}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Success Rate:</span>
                      <span className={`ml-2 font-medium ${
                        workflow.successRate >= 95 ? 'text-green-600' : 
                        workflow.successRate >= 80 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {workflow.successRate}%
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">Actions ({workflow.actions.length}):</div>
                    <div className="flex flex-wrap gap-1">
                      {workflow.actions.map((action, index) => {
                        const actionType = actionTypes.find(a => a.value === action.type)
                        return (
                          <Badge key={action.id} variant="outline" className="text-xs">
                            {index + 1}. {actionType?.label || action.type}
                          </Badge>
                        )
                      })}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => runWorkflowManually(workflow.id)}
                      disabled={!workflow.isActive}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Run Now
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedWorkflow(workflow)}
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      Configure
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="triggers" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {triggerTypes.map((trigger) => {
              const Icon = trigger.icon
              return (
                <Card key={trigger.value}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon className="h-5 w-5" />
                      {trigger.label}
                    </CardTitle>
                    <CardDescription>
                      {trigger.value.replace(/_/g, ' ').charAt(0).toUpperCase() + 
                       trigger.value.replace(/_/g, ' ').slice(1)} trigger
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      Used in {workflows.filter(w => w.trigger === trigger.value).length} workflows
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="actions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {actionTypes.map((action) => {
              const Icon = action.icon
              return (
                <Card key={action.value}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon className="h-5 w-5" />
                      {action.label}
                    </CardTitle>
                    <CardDescription>
                      Automated action for workflow execution
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      Used in {workflows.reduce((acc, w) => 
                        acc + w.actions.filter(a => a.type === action.value).length, 0
                      )} actions
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

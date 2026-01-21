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
  Bell, 
  Mail, 
  MessageSquare, 
  Smartphone, 
  CheckCircle, 
  AlertTriangle, 
  Info,
  Settings,
  Send,
  Users,
  Package,
  DollarSign,
  Calendar,
  Clock,
  X,
  Eye,
  EyeOff
} from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  channel: 'email' | 'sms' | 'push' | 'in_app'
  recipients: string[]
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'scheduled'
  scheduledAt?: Date
  sentAt?: Date
  createdAt: Date
  metadata?: Record<string, any>
}

interface NotificationTemplate {
  id: string
  name: string
  description: string
  subject?: string
  body: string
  variables: string[]
  channels: string[]
  isActive: boolean
}

interface NotificationRule {
  id: string
  name: string
  trigger: string
  conditions: Record<string, any>
  template: string
  channels: string[]
  isActive: boolean
  lastTriggered?: Date
}

export default function NotificationSystemPage() {
  const { theme } = useTheme()
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Low Stock Alert',
      message: 'Item "Raw Material A" is running low on stock (15 units remaining)',
      type: 'warning',
      channel: 'email',
      recipients: ['manager@company.com', 'inventory@company.com'],
      status: 'delivered',
      sentAt: new Date('2024-01-15T10:30:00'),
      createdAt: new Date('2024-01-15T10:25:00'),
      metadata: {
        itemId: '123',
        currentStock: 15,
        reorderPoint: 50
      }
    },
    {
      id: '2',
      title: 'Quality Check Failed',
      message: 'Batch #BATCH-001 failed quality inspection. Immediate attention required.',
      type: 'error',
      channel: 'sms',
      recipients: ['+1234567890'],
      status: 'delivered',
      sentAt: new Date('2024-01-15T09:15:00'),
      createdAt: new Date('2024-01-15T09:10:00'),
      metadata: {
        batchId: 'BATCH-001',
        inspectorId: 'EMP-005',
        failureReason: 'Dimensional tolerance exceeded'
      }
    },
    {
      id: '3',
      title: 'Payment Received',
      message: 'Payment of $5,000 received from Customer ABC for invoice INV-001',
      type: 'success',
      channel: 'in_app',
      recipients: ['finance@company.com'],
      status: 'delivered',
      sentAt: new Date('2024-01-15T08:45:00'),
      createdAt: new Date('2024-01-15T08:45:00'),
      metadata: {
        customerId: 'CUST-001',
        invoiceId: 'INV-001',
        amount: 5000
      }
    },
    {
      id: '4',
      title: 'System Maintenance',
      message: 'Scheduled system maintenance will begin at 2:00 AM UTC',
      type: 'info',
      channel: 'email',
      recipients: ['all@company.com'],
      status: 'scheduled',
      scheduledAt: new Date('2024-01-16T02:00:00'),
      createdAt: new Date('2024-01-15T16:00:00')
    }
  ])

  const [templates] = useState<NotificationTemplate[]>([
    {
      id: '1',
      name: 'Low Stock Alert',
      description: 'Notifies when inventory items run low',
      subject: 'Low Stock Alert - {{itemName}}',
      body: 'Item "{{itemName}}" is running low on stock. Current stock: {{currentStock}} units. Reorder point: {{reorderPoint}} units.',
      variables: ['itemName', 'currentStock', 'reorderPoint'],
      channels: ['email', 'sms'],
      isActive: true
    },
    {
      id: '2',
      name: 'Quality Check Failed',
      description: 'Alerts for failed quality inspections',
      subject: 'Quality Check Failed - {{batchId}}',
      body: 'Batch {{batchId}} has failed quality inspection. Failure reason: {{failureReason}}. Immediate attention required.',
      variables: ['batchId', 'failureReason', 'inspectorId'],
      channels: ['email', 'sms', 'push'],
      isActive: true
    },
    {
      id: '3',
      name: 'Payment Received',
      description: 'Confirms payment receipt',
      subject: 'Payment Received - {{customerName}}',
      body: 'Payment of ${{amount}} received from {{customerName}} for invoice {{invoiceId}}.',
      variables: ['customerName', 'amount', 'invoiceId'],
      channels: ['email', 'in_app'],
      isActive: true
    }
  ])

  const [rules] = useState<NotificationRule[]>([
    {
      id: '1',
      name: 'Low Stock Notifications',
      trigger: 'stock_level_low',
      conditions: {
        stockLevel: '<= reorderPoint',
        itemCategory: 'raw_materials'
      },
      template: '1',
      channels: ['email', 'sms'],
      isActive: true,
      lastTriggered: new Date('2024-01-15T10:25:00')
    },
    {
      id: '2',
      name: 'Quality Failures',
      trigger: 'quality_check_failed',
      conditions: {
        result: 'fail',
        severity: 'critical'
      },
      template: '2',
      channels: ['email', 'sms', 'push'],
      isActive: true,
      lastTriggered: new Date('2024-01-15T09:10:00')
    },
    {
      id: '3',
      name: 'Payment Confirmations',
      trigger: 'payment_received',
      conditions: {
        amount: '> 0',
        status: 'completed'
      },
      template: '3',
      channels: ['email', 'in_app'],
      isActive: true,
      lastTriggered: new Date('2024-01-15T08:45:00')
    }
  ])

  const [activeTab, setActiveTab] = useState('notifications')
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [isComposing, setIsComposing] = useState(false)
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'info' as const,
    channel: 'email' as const,
    recipients: '',
    scheduledAt: ''
  })

  const channelIcons = {
    email: Mail,
    sms: Smartphone,
    push: Bell,
    in_app: MessageSquare
  }

  const typeColors = {
    info: 'text-blue-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600'
  }

  const statusColors = {
    pending: 'text-yellow-600',
    sent: 'text-blue-600',
    delivered: 'text-green-600',
    failed: 'text-red-600',
    scheduled: 'text-purple-600'
  }

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const sendNotification = () => {
    const notification: Notification = {
      id: Date.now().toString(),
      title: newNotification.title,
      message: newNotification.message,
      type: newNotification.type,
      channel: newNotification.channel,
      recipients: newNotification.recipients.split(',').map(r => r.trim()),
      status: 'pending',
      createdAt: new Date(),
      scheduledAt: newNotification.scheduledAt ? new Date(newNotification.scheduledAt) : undefined
    }

    setNotifications(prev => [notification, ...prev])
    setIsComposing(false)
    setNewNotification({
      title: '',
      message: '',
      type: 'info',
      channel: 'email',
      recipients: '',
      scheduledAt: ''
    })
  }

  const markAsRead = (notificationId: string) => {
    // In a real app, this would update the database
    console.log(`Marking notification ${notificationId} as read`)
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId))
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bell className="h-8 w-8 text-blue-500" />
            Notification System
          </h1>
          <p className="text-muted-foreground">Manage notifications and alerts</p>
        </div>
        <Button onClick={() => setIsComposing(true)}>
          <Send className="h-4 w-4 mr-2" />
          Compose Notification
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {notifications.filter(n => n.status === 'delivered').length}
            </div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {notifications.filter(n => n.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting delivery</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {notifications.filter(n => n.status === 'failed').length}
            </div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Templates</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {templates.filter(t => t.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground">Available templates</p>
          </CardContent>
        </Card>
      </div>

      {/* Compose Notification Dialog */}
      {isComposing && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Compose New Notification</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setIsComposing(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newNotification.title}
                  onChange={(e) => setNewNotification(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter notification title"
                />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Select value={newNotification.type} onValueChange={(value: any) => setNewNotification(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={newNotification.message}
                onChange={(e) => setNewNotification(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Enter notification message"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="channel">Channel</Label>
                <Select value={newNotification.channel} onValueChange={(value: any) => setNewNotification(prev => ({ ...prev, channel: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="push">Push</SelectItem>
                    <SelectItem value="in_app">In-App</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="recipients">Recipients (comma-separated)</Label>
                <Input
                  id="recipients"
                  value={newNotification.recipients}
                  onChange={(e) => setNewNotification(prev => ({ ...prev, recipients: e.target.value }))}
                  placeholder="user1@example.com, user2@example.com"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="scheduled">Schedule (optional)</Label>
              <Input
                id="scheduled"
                type="datetime-local"
                value={newNotification.scheduledAt}
                onChange={(e) => setNewNotification(prev => ({ ...prev, scheduledAt: e.target.value }))}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={sendNotification}>
                <Send className="h-4 w-4 mr-2" />
                Send Notification
              </Button>
              <Button variant="outline" onClick={() => setIsComposing(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="rules">Rules</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-4">
          <div className="space-y-4">
            {notifications.map((notification) => {
              const ChannelIcon = channelIcons[notification.channel]
              return (
                <Card key={notification.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <ChannelIcon className="h-5 w-5 text-muted-foreground" />
                          <h3 className="font-semibold">{notification.title}</h3>
                          <Badge variant="outline" className={typeColors[notification.type]}>
                            {notification.type}
                          </Badge>
                          <Badge variant="outline" className={statusColors[notification.status]}>
                            {notification.status}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-3">{notification.message}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Recipients: {notification.recipients.length}</span>
                          <span>Created: {formatDateTime(notification.createdAt)}</span>
                          {notification.sentAt && (
                            <span>Sent: {formatDateTime(notification.sentAt)}</span>
                          )}
                          {notification.scheduledAt && (
                            <span>Scheduled: {formatDateTime(notification.scheduledAt)}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteNotification(notification.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {templates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{template.name}</CardTitle>
                    <Switch checked={template.isActive} />
                  </div>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {template.subject && (
                    <div>
                      <Label>Subject</Label>
                      <p className="text-sm font-mono bg-muted p-2 rounded">{template.subject}</p>
                    </div>
                  )}
                  <div>
                    <Label>Body</Label>
                    <p className="text-sm font-mono bg-muted p-2 rounded">{template.body}</p>
                  </div>
                  <div>
                    <Label>Variables</Label>
                    <div className="flex flex-wrap gap-1">
                      {template.variables.map(variable => (
                        <Badge key={variable} variant="secondary" className="text-xs">
                          {variable}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Channels</Label>
                    <div className="flex flex-wrap gap-1">
                      {template.channels.map(channel => {
                        const ChannelIcon = channelIcons[channel as keyof typeof channelIcons]
                        return (
                          <Badge key={channel} variant="outline" className="text-xs">
                            <ChannelIcon className="h-3 w-3 mr-1" />
                            {channel}
                          </Badge>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <div className="space-y-4">
            {rules.map((rule) => (
              <Card key={rule.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{rule.name}</CardTitle>
                    <Switch checked={rule.isActive} />
                  </div>
                  <CardDescription>
                    Trigger: {rule.trigger.replace(/_/g, ' ').charAt(0).toUpperCase() + rule.trigger.replace(/_/g, ' ').slice(1)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Conditions</Label>
                    <div className="text-sm font-mono bg-muted p-2 rounded">
                      {JSON.stringify(rule.conditions, null, 2)}
                    </div>
                  </div>
                  <div>
                    <Label>Template</Label>
                    <p className="text-sm">{templates.find(t => t.id === rule.template)?.name}</p>
                  </div>
                  <div>
                    <Label>Channels</Label>
                    <div className="flex flex-wrap gap-1">
                      {rule.channels.map(channel => {
                        const ChannelIcon = channelIcons[channel as keyof typeof channelIcons]
                        return (
                          <Badge key={channel} variant="outline" className="text-xs">
                            <ChannelIcon className="h-3 w-3 mr-1" />
                            {channel}
                          </Badge>
                        )
                      })}
                    </div>
                  </div>
                  {rule.lastTriggered && (
                    <div className="text-sm text-muted-foreground">
                      Last triggered: {formatDateTime(rule.lastTriggered)}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Settings</CardTitle>
                <CardDescription>Configure email notification settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="smtp-host">SMTP Host</Label>
                  <Input id="smtp-host" placeholder="smtp.gmail.com" />
                </div>
                <div>
                  <Label htmlFor="smtp-port">SMTP Port</Label>
                  <Input id="smtp-port" placeholder="587" />
                </div>
                <div>
                  <Label htmlFor="smtp-user">SMTP User</Label>
                  <Input id="smtp-user" placeholder="noreply@company.com" />
                </div>
                <div>
                  <Label htmlFor="smtp-password">SMTP Password</Label>
                  <Input id="smtp-password" type="password" />
                </div>
                <Button>Save Email Settings</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SMS Settings</CardTitle>
                <CardDescription>Configure SMS notification settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="sms-provider">SMS Provider</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="twilio">Twilio</SelectItem>
                      <SelectItem value="aws-sns">AWS SNS</SelectItem>
                      <SelectItem value="messagebird">MessageBird</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="api-key">API Key</Label>
                  <Input id="api-key" type="password" />
                </div>
                <div>
                  <Label htmlFor="from-number">From Number</Label>
                  <Input id="from-number" placeholder="+1234567890" />
                </div>
                <Button>Save SMS Settings</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

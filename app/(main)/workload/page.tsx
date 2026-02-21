'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useEmployees } from '@/lib/hooks/useEmployees'
import { useWorkloadSessions, useWorkloadAnalytics, useWorkloadPredictions, calculateEfficiencyScore, calculateWorkingHours, getActivityBreakdown, getRiskLevelColor, getEfficiencyColor } from '@/lib/hooks/useWorkload'
import { useAuth } from '@/lib/hooks/useAuth'
import { Calendar, Clock, TrendingUp, TrendingDown, Users, Activity, BarChart3, Brain, AlertTriangle, CheckCircle, XCircle, Timer, Target } from 'lucide-react'

export default function WorkloadAnalysisPage() {
  const { user } = useAuth()
  const { employees, loading: employeesLoading, error: employeesError } = useEmployees()
  const [selectedEmployee, setSelectedEmployee] = useState<string>('')
  const [selectedPeriod, setSelectedPeriod] = useState<string>('daily')
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [isCreateSessionOpen, setIsCreateSessionOpen] = useState(false)
  const [pageError, setPageError] = useState<string | null>(null)

  // Call hooks unconditionally
  const { sessions, loading: sessionsLoading, createSession } = useWorkloadSessions(selectedEmployee || undefined, startDate, endDate)
  const { analytics, loading: analyticsLoading } = useWorkloadAnalytics(selectedEmployee || undefined, selectedPeriod)
  const { predictions, loading: predictionsLoading, generatePrediction } = useWorkloadPredictions(selectedEmployee || undefined)

  // Error boundary for hooks
  useEffect(() => {
    if (sessionsLoading || analyticsLoading || predictionsLoading) {
      setPageError(null)
    }
  }, [sessionsLoading, analyticsLoading, predictionsLoading])

  const canManage = user?.role && ['ADMIN', 'SUPERVISOR', 'MANAGER'].includes(user.role)

  // Calculate metrics with error handling
  let averageEfficiency = 0
  let totalWorkingHours = 0
  let activityBreakdown = { working: 0, idle: 0, break: 0, meeting: 0 }

  try {
    if (sessions && sessions.length > 0) {
      averageEfficiency = calculateEfficiencyScore(sessions)
      totalWorkingHours = calculateWorkingHours(sessions)
      activityBreakdown = getActivityBreakdown(sessions)
    }
  } catch (error) {
    console.error('Metrics calculation error:', error)
  }

  // Get employee name with error handling
  const selectedEmployeeData = employees ? employees.find(emp => emp.id === selectedEmployee) : null

  const handleCreateSession = async (formData: FormData) => {
    if (!selectedEmployee) return

    const sessionData = {
      employeeId: selectedEmployee,
      startTime: formData.get('startTime') as string,
      endTime: formData.get('endTime') as string,
      activityType: formData.get('activityType') as 'working' | 'idle' | 'break' | 'meeting',
      taskType: formData.get('taskType') as string,
      notes: formData.get('notes') as string
    }

    try {
      await createSession(sessionData)
      setIsCreateSessionOpen(false)
    } catch (error) {
      console.error('Failed to create session:', error)
    }
  }

  const handleGeneratePrediction = async () => {
    if (!selectedEmployee) return
    try {
      await generatePrediction(selectedEmployee)
    } catch (error) {
      console.error('Failed to generate prediction:', error)
      setPageError(error instanceof Error ? error.message : 'Failed to generate prediction')
    }
  }

  // Loading state
  if (employeesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Error state
  if (pageError || employeesError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600 text-center">
          <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
          <p>Error: {pageError || employeesError || 'Unknown error occurred'}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Reload Page
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              Workload Analysis
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Employee Performance & Productivity Tracking
            </p>
          </div>
          <div className="flex items-center gap-3">
            {canManage && (
              <Dialog open={isCreateSessionOpen} onOpenChange={setIsCreateSessionOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Clock className="h-4 w-4 mr-2" />
                    Log Session
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Log Work Session</DialogTitle>
                    <DialogDescription>
                      Record a work session for {selectedEmployeeData?.name || 'selected employee'}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={(e) => {
                    e.preventDefault()
                    handleCreateSession(new FormData(e.currentTarget))
                  }}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="startTime">Start Time</Label>
                          <Input id="startTime" name="startTime" type="datetime-local" required />
                        </div>
                        <div>
                          <Label htmlFor="endTime">End Time</Label>
                          <Input id="endTime" name="endTime" type="datetime-local" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="activityType">Activity Type</Label>
                        <Select name="activityType" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select activity type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="working">Working</SelectItem>
                            <SelectItem value="idle">Idle</SelectItem>
                            <SelectItem value="break">Break</SelectItem>
                            <SelectItem value="meeting">Meeting</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="taskType">Task Type</Label>
                        <Select name="taskType">
                          <SelectTrigger>
                            <SelectValue placeholder="Select task type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="production">Production</SelectItem>
                            <SelectItem value="maintenance">Maintenance</SelectItem>
                            <SelectItem value="quality">Quality Control</SelectItem>
                            <SelectItem value="admin">Administrative</SelectItem>
                            <SelectItem value="training">Training</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="notes">Notes</Label>
                        <Input id="notes" name="notes" placeholder="Optional notes..." />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Log Session</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <div>
            <Label className="text-sm font-medium">Employee</Label>
            <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                {employees.map(emp => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {emp.name} ({emp.department})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="text-sm font-medium">Period</Label>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium">Start Date</Label>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>

          <div>
            <Label className="text-sm font-medium">End Date</Label>
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>
      </div>

      {selectedEmployee && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Working Hours</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalWorkingHours.toFixed(1)}h</div>
                <p className="text-xs text-muted-foreground">
                  {sessions.length} sessions recorded
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Efficiency</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getEfficiencyColor(averageEfficiency)}`}>
                  {averageEfficiency}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Performance score
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Working vs Idle</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {((activityBreakdown.working / (activityBreakdown.working + activityBreakdown.idle)) * 100).toFixed(0)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Active time ratio
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Risk Level</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <Badge className={getRiskLevelColor(predictions[0]?.riskLevel || 'low')}>
                  {predictions[0]?.riskLevel.toUpperCase() || 'LOW'}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">
                  Predicted risk
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="sessions" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="sessions">Sessions</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="predictions">Predictions</TabsTrigger>
              <TabsTrigger value="charts">Charts</TabsTrigger>
            </TabsList>

            <TabsContent value="sessions">
              <Card>
                <CardHeader>
                  <CardTitle>Work Sessions</CardTitle>
                  <CardDescription>
                    Recent work sessions for {selectedEmployeeData?.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(sessions || []).map(session => (
                      <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <Badge variant={session.activityType === 'working' ? 'default' : 'secondary'}>
                            {session.activityType}
                          </Badge>
                          <div>
                            <p className="font-medium">{new Date(session.startTime).toLocaleDateString()}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(session.startTime).toLocaleTimeString()} - {session.endTime ? new Date(session.endTime).toLocaleTimeString() : 'Ongoing'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{session.duration ? `${session.duration} min` : 'Ongoing'}</p>
                          <p className={`text-sm ${getEfficiencyColor(session.efficiency || 0)}`}>
                            {session.efficiency || 0}% efficient
                          </p>
                        </div>
                      </div>
                    ))}
                    {(!sessions || sessions.length === 0) && (
                      <p className="text-center text-gray-500 py-8">No sessions recorded</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {(analytics || []).map(analytic => (
                  <Card key={analytic.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{analytic.period.charAt(0).toUpperCase() + analytic.period.slice(1)} Analytics</span>
                        <Badge className={getEfficiencyColor(analytic.efficiency)}>
                          {analytic.efficiency}%
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        {new Date(analytic.periodStart).toLocaleDateString()} - {new Date(analytic.periodEnd).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Total Hours:</span>
                          <span className="font-medium">{analytic.totalHours}h</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Working Hours:</span>
                          <span className="font-medium text-green-600">{analytic.workingHours}h</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Idle Hours:</span>
                          <span className="font-medium text-red-600">{analytic.idleHours}h</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Break Hours:</span>
                          <span className="font-medium text-yellow-600">{analytic.breakHours}h</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tasks Completed:</span>
                          <span className="font-medium">{analytic.tasksCompleted}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Productivity:</span>
                          <span className="font-medium">{analytic.productivity} tasks/h</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Overall Score:</span>
                          <span className="font-bold">{analytic.score}/100</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {(!analytics || analytics.length === 0) && (
                  <Card>
                    <CardContent className="text-center py-8">
                      <p className="text-gray-500">No analytics data available</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="predictions">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>ML Predictions</CardTitle>
                      <CardDescription>
                        AI-powered workload predictions for {selectedEmployeeData?.name}
                      </CardDescription>
                    </div>
                    {canManage && (
                      <Button onClick={handleGeneratePrediction} className="bg-purple-600 hover:bg-purple-700">
                        <Brain className="h-4 w-4 mr-2" />
                        Generate New Prediction
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(predictions || []).map(prediction => (
                      <div key={prediction.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium">Prediction for {new Date(prediction.predictionDate).toLocaleDateString()}</h4>
                            <p className="text-sm text-gray-500">
                              Confidence: {prediction.confidence}% | Risk: {prediction.riskLevel}
                            </p>
                          </div>
                          <Badge className={getRiskLevelColor(prediction.riskLevel)}>
                            {prediction.riskLevel.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Predicted Hours</p>
                            <p className="font-medium">{prediction.predictedHours}h</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Expected Efficiency</p>
                            <p className={`font-medium ${getEfficiencyColor(prediction.efficiency)}`}>
                              {prediction.efficiency}%
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Actual Hours</p>
                            <p className="font-medium">{prediction.actualHours || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Accuracy</p>
                            <p className="font-medium">
                              {prediction.actualHours ? Math.round((1 - Math.abs(prediction.predictedHours - prediction.actualHours) / prediction.predictedHours) * 100) : 'N/A'}%
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {(!predictions || predictions.length === 0) && (
                      <p className="text-center text-gray-500 py-8">No predictions available</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="charts">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Activity Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Working</span>
                          <span className="text-sm">{Math.round((activityBreakdown.working / (activityBreakdown.working + activityBreakdown.idle + activityBreakdown.break + activityBreakdown.meeting || 1)) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: `${Math.round((activityBreakdown.working / (activityBreakdown.working + activityBreakdown.idle + activityBreakdown.break + activityBreakdown.meeting || 1)) * 100)}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Idle</span>
                          <span className="text-sm">{Math.round((activityBreakdown.idle / (activityBreakdown.working + activityBreakdown.idle + activityBreakdown.break + activityBreakdown.meeting || 1)) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-red-600 h-2 rounded-full" style={{ width: `${Math.round((activityBreakdown.idle / (activityBreakdown.working + activityBreakdown.idle + activityBreakdown.break + activityBreakdown.meeting || 1)) * 100)}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Break</span>
                          <span className="text-sm">{Math.round((activityBreakdown.break / (activityBreakdown.working + activityBreakdown.idle + activityBreakdown.break + activityBreakdown.meeting || 1)) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-yellow-600 h-2 rounded-full" style={{ width: `${Math.round((activityBreakdown.break / (activityBreakdown.working + activityBreakdown.idle + activityBreakdown.break + activityBreakdown.meeting || 1)) * 100)}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Meeting</span>
                          <span className="text-sm">{Math.round((activityBreakdown.meeting / (activityBreakdown.working + activityBreakdown.idle + activityBreakdown.break + activityBreakdown.meeting || 1)) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.round((activityBreakdown.meeting / (activityBreakdown.working + activityBreakdown.idle + activityBreakdown.break + activityBreakdown.meeting || 1)) * 100)}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Efficiency Score</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div className={`h-2 rounded-full ${averageEfficiency >= 90 ? 'bg-green-600' : averageEfficiency >= 75 ? 'bg-yellow-600' : 'bg-red-600'}`} style={{ width: `${averageEfficiency}%` }}></div>
                          </div>
                          <span className="text-sm font-medium">{averageEfficiency}%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Working Time</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.min(100, (totalWorkingHours / 8) * 100)}%` }}></div>
                          </div>
                          <span className="text-sm font-medium">{totalWorkingHours}h</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}

      {!selectedEmployee && (
        <Card>
          <CardContent className="text-center py-16">
            <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Select an Employee</h3>
            <p className="text-gray-500">Choose an employee from the dropdown to view their workload analysis</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

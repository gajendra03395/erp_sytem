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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, AlertTriangle, Package, Warehouse as WarehouseIcon, Barcode as BarcodeIcon, TrendingUp, TrendingDown, Bell, BellOff, RefreshCw } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'
import { useAuth } from '@/components/providers/AuthProvider'
import { canEditInventory } from '@/lib/auth/permissions'

export default function EnhancedInventoryPage() {
  const { theme } = useTheme()
  const { currentRole } = useAuth()
  const [inventory, setInventory] = useState<any[]>([])
  const [stockAlerts, setStockAlerts] = useState<any[]>([])
  const [stockMovements, setStockMovements] = useState<any[]>([])
  const [warehouses, setWarehouses] = useState<any[]>([])
  const [barcodes, setBarcodes] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [editingStock, setEditingStock] = useState<string | null>(null)
  const [stockUpdateValue, setStockUpdateValue] = useState('')

  useEffect(() => {
    fetchInventoryData()
  }, [])

  const fetchInventoryData = async () => {
    setLoading(true)
    try {
      console.log('Fetching inventory data...')
      const [inventoryRes, alertsRes, movementsRes, warehousesRes, barcodesRes] = await Promise.all([
        fetch('/api/inventory'),
        fetch('/api/inventory/stock-alerts'),
        fetch('/api/inventory/stock-movements'),
        fetch('/api/inventory/warehouses'),
        fetch('/api/inventory/barcodes')
      ])

      const inventoryData = await inventoryRes.json()
      const alertsData = await alertsRes.json()
      const movementsData = await movementsRes.json()
      const warehousesData = await warehousesRes.json()
      const barcodesData = await barcodesRes.json()

      console.log('Inventory data received:', inventoryData)
      setInventory(inventoryData.data || [])
      setStockAlerts(alertsData.data || [])
      setStockMovements(movementsData.data || [])
      setWarehouses(warehousesData.data || [])
      setBarcodes(barcodesData.data || [])
    } catch (error) {
      console.error('Error fetching inventory data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStockUpdate = async (itemId: string, newStockLevel: number) => {
    try {
      console.log('Updating stock:', itemId, 'to:', newStockLevel)
      
      const response = await fetch(`/api/inventory`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: itemId,
          stock_level: newStockLevel
        })
      })

      const data = await response.json()
      console.log('Response:', data)
      
      if (data.success) {
        setInventory(prev => prev.map(item => 
          item.id === itemId ? { ...item, stock_level: newStockLevel } : item
        ))
        setEditingStock(null)
        setStockUpdateValue('')
        await fetchInventoryData()
      } else {
        console.error('Update failed:', data.error)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const totalItems = inventory.length
  const lowStockItems = inventory.filter(item => item.stock_level <= item.reorder_point).length
  const outOfStockItems = inventory.filter(item => item.stock_level === 0).length
  const criticalAlerts = stockAlerts.filter(alert => alert.severity === 'CRITICAL' && !alert.is_resolved).length
  const activeWarehouses = warehouses.filter(wh => wh.is_active).length

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Enhanced Inventory Management</h1>
          <p className="text-muted-foreground">Advanced inventory with alerts, tracking, and multi-warehouse support</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={fetchInventoryData} 
            variant="outline" 
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          {canEditInventory(currentRole) && (
            <Button onClick={() => setActiveTab('stock-alerts')} className="relative">
              <Bell className="h-4 w-4 mr-2" />
              Stock Alerts
              {criticalAlerts > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs">
                  {criticalAlerts}
                </Badge>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-muted-foreground">
              Active inventory items
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{lowStockItems}</div>
            <p className="text-xs text-muted-foreground">
              Items need reordering
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{outOfStockItems}</div>
            <p className="text-xs text-muted-foreground">
              Critical shortage
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Warehouses</CardTitle>
            <WarehouseIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeWarehouses}</div>
            <p className="text-xs text-muted-foreground">
              Operational locations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            <Bell className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalAlerts}</div>
            <p className="text-xs text-muted-foreground">
              Immediate attention needed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="stock-alerts">Stock Alerts</TabsTrigger>
          <TabsTrigger value="movements">Movements</TabsTrigger>
          <TabsTrigger value="warehouses">Warehouses</TabsTrigger>
          <TabsTrigger value="barcodes">Barcodes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Overview</CardTitle>
              <CardDescription>Complete inventory status and alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Reorder Point</TableHead>
                    <TableHead>Unit Cost</TableHead>
                    <TableHead>Warehouse</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.item_name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="cursor-pointer hover:bg-muted px-2 py-1 rounded" onClick={() => {
                            const newValue = prompt(`Update stock for ${item.item_name} (current: ${item.stock_level}):`)
                            if (newValue && !isNaN(parseInt(newValue))) {
                              handleStockUpdate(item.id, parseInt(newValue))
                            }
                          }}>
                            {item.stock_level}
                          </span>
                          <Button size="sm" variant="outline" onClick={() => {
                            const newValue = prompt(`Update stock for ${item.item_name} (current: ${item.stock_level}):`)
                            if (newValue && !isNaN(parseInt(newValue))) {
                              handleStockUpdate(item.id, parseInt(newValue))
                            }
                          }}>
                            Edit
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>{item.reorder_point}</TableCell>
                      <TableCell>${item.unit_cost || 0}</TableCell>
                      <TableCell>{item.location}</TableCell>
                      <TableCell>
                        <Badge variant={
                          item.stock_level === 0 ? 'destructive' :
                          item.stock_level <= item.reorder_point ? 'secondary' : 'default'
                        }>
                          {item.stock_level === 0 ? 'Out of Stock' :
                           item.stock_level <= item.reorder_point ? 'Low Stock' : 'In Stock'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <BarcodeIcon className="h-4 w-4" />
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

        <TabsContent value="stock-alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stock Alerts</CardTitle>
              <CardDescription>Low stock and out of stock notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Alert Type</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Threshold</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockAlerts.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell className="font-medium">{alert.item_name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{alert.alert_type}</Badge>
                      </TableCell>
                      <TableCell>{alert.current_stock}</TableCell>
                      <TableCell>{alert.threshold_value}</TableCell>
                      <TableCell>
                        <Badge variant={
                          alert.severity === 'CRITICAL' ? 'destructive' :
                          alert.severity === 'HIGH' ? 'secondary' : 'outline'
                        }>
                          {alert.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={alert.is_resolved ? 'default' : 'secondary'}>
                          {alert.is_resolved ? 'Resolved' : 'Active'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {!alert.is_resolved && canEditInventory(currentRole) && (
                            <Button variant="outline" size="sm">
                              <BellOff className="h-4 w-4" />
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
        </TabsContent>

        <TabsContent value="movements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stock Movements</CardTitle>
              <CardDescription>Complete tracking of all inventory changes</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit Cost</TableHead>
                    <TableHead>Total Cost</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockMovements.map((movement) => (
                    <TableRow key={movement.id}>
                      <TableCell className="font-medium">{movement.item_name}</TableCell>
                      <TableCell>
                        <Badge variant={
                          movement.movement_type === 'IN' ? 'default' :
                          movement.movement_type === 'OUT' ? 'destructive' : 'outline'
                        }>
                          {movement.movement_type}
                        </Badge>
                      </TableCell>
                      <TableCell>{movement.quantity}</TableCell>
                      <TableCell>${movement.unit_cost}</TableCell>
                      <TableCell>${movement.total_cost}</TableCell>
                      <TableCell>{movement.reference_type}</TableCell>
                      <TableCell>{new Date(movement.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="warehouses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Warehouses</CardTitle>
              <CardDescription>Multi-warehouse management</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Manager</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Utilization</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {warehouses.map((warehouse) => (
                    <TableRow key={warehouse.id}>
                      <TableCell className="font-medium">{warehouse.name}</TableCell>
                      <TableCell>{warehouse.code}</TableCell>
                      <TableCell>{warehouse.city}, {warehouse.state}</TableCell>
                      <TableCell>{warehouse.manager_name}</TableCell>
                      <TableCell>{warehouse.capacity}</TableCell>
                      <TableCell>{warehouse.current_utilization}%</TableCell>
                      <TableCell>
                        <Badge variant={warehouse.is_active ? 'default' : 'secondary'}>
                          {warehouse.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="barcodes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Barcode Management</CardTitle>
              <CardDescription>Barcode and QR code scanning support</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Barcode Value</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Item ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {barcodes.map((barcode) => (
                    <TableRow key={barcode.id}>
                      <TableCell className="font-medium">{barcode.barcode_value}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{barcode.barcode_type}</Badge>
                      </TableCell>
                      <TableCell>{barcode.inventory_item_id}</TableCell>
                      <TableCell>
                        <Badge variant={barcode.is_active ? 'default' : 'secondary'}>
                          {barcode.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(barcode.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

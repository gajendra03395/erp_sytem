'use client'

import { useState, useEffect } from 'react'
import { Package, Edit, Trash2, Plus, Loader2, AlertCircle, Search, Filter, BarChart3, TrendingUp, TrendingDown, Zap, Shield } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'
import { StockForm } from '@/components/inventory/StockForm'
import { LowStockAlert } from '@/components/inventory/LowStockAlert'
import { useInventory } from '@/lib/hooks/useInventory'
import { BulkImportButton } from '@/components/ui/BulkImportButton'
import type { StockTransaction, InventoryItem } from '@/types/inventory'

const mockInventory = [
  // Raw Materials
  {
    id: '1',
    item_name: 'Mild Steel Sheets (1mm)',
    category: 'raw_material',
    stock_level: 5000,
    unit: 'kg',
    reorder_point: 1000,
    supplier: 'ABC Steel Industries',
    last_stock_date: new Date('2024-03-15'),
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-03-15'),
  },
  {
    id: '2',
    item_name: 'Aluminum Rods (10mm)',
    category: 'raw_material',
    stock_level: 150,
    unit: 'kg',
    reorder_point: 500,
    supplier: 'XYZ Metals Ltd',
    last_stock_date: new Date('2024-03-16'),
    created_at: new Date('2024-01-02'),
    updated_at: new Date('2024-03-16'),
  },
  {
    id: '3',
    item_name: 'Plastic Pellets (HDPE)',
    category: 'raw_material',
    stock_level: 8000,
    unit: 'kg',
    reorder_point: 2000,
    supplier: 'Polymer Co.',
    last_stock_date: new Date('2024-03-12'),
    created_at: new Date('2024-01-04'),
    updated_at: new Date('2024-03-12'),
  },
  {
    id: '4',
    item_name: 'Copper Wire (2.5mm)',
    category: 'raw_material',
    stock_level: 320,
    unit: 'kg',
    reorder_point: 400,
    supplier: 'Prime Copper Supplies',
    last_stock_date: new Date('2024-03-14'),
    created_at: new Date('2024-01-05'),
    updated_at: new Date('2024-03-14'),
  },
  {
    id: '5',
    item_name: 'Stainless Steel Bolts M8',
    category: 'raw_material',
    stock_level: 12000,
    unit: 'pieces',
    reorder_point: 3000,
    supplier: 'FastenerWorld',
    last_stock_date: new Date('2024-03-17'),
    created_at: new Date('2024-01-06'),
    updated_at: new Date('2024-03-17'),
  },
  {
    id: '6',
    item_name: 'Industrial Paint (Gloss)',
    category: 'raw_material',
    stock_level: 500,
    unit: 'liters',
    reorder_point: 100,
    supplier: 'ColorTech Industries',
    last_stock_date: new Date('2024-03-18'),
    created_at: new Date('2024-01-07'),
    updated_at: new Date('2024-03-18'),
  },
  // Finished Goods
  {
    id: '7',
    item_name: 'Widget A - Premium',
    category: 'finished_good',
    stock_level: 450,
    unit: 'units',
    reorder_point: 300,
    supplier: 'Internal Production',
    last_stock_date: new Date('2024-03-18'),
    created_at: new Date('2024-01-03'),
    updated_at: new Date('2024-03-18'),
  },
  {
    id: '8',
    item_name: 'Widget B - Standard',
    category: 'finished_good',
    stock_level: 1200,
    unit: 'units',
    reorder_point: 500,
    supplier: 'Internal Production',
    last_stock_date: new Date('2024-03-17'),
    created_at: new Date('2024-01-08'),
    updated_at: new Date('2024-03-17'),
  },
  {
    id: '9',
    item_name: 'Component X Assembly',
    category: 'finished_good',
    stock_level: 80,
    unit: 'units',
    reorder_point: 200,
    supplier: 'Internal Production',
    last_stock_date: new Date('2024-03-16'),
    created_at: new Date('2024-01-09'),
    updated_at: new Date('2024-03-16'),
  },
  {
    id: '10',
    item_name: 'Aluminum Frame Set',
    category: 'finished_good',
    stock_level: 350,
    unit: 'sets',
    reorder_point: 150,
    supplier: 'Internal Production',
    last_stock_date: new Date('2024-03-15'),
    created_at: new Date('2024-01-10'),
    updated_at: new Date('2024-03-15'),
  },
]

export default function InventoryPage() {
  const { theme } = useTheme()
  const { items: hookInventory, loading, error, addStock, updateItem, deleteItem, refetch } = useInventory()
  const [inventory, setInventory] = useState<typeof hookInventory>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<typeof inventory[0]>>({})

  useEffect(() => {
    setInventory(hookInventory)
  }, [hookInventory])

  // Get unique item names for the form dropdown
  const existingItemNames = Array.from(new Set(inventory.map(item => item.item_name)))

  const handleAddStock = async (transaction: StockTransaction) => {
    try {
      await addStock(transaction)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to add stock')
    }
  }

  const handleEdit = (id: string) => {
    const item = inventory.find((i) => i.id === id)
    if (item) {
      setEditingId(id)
      setEditForm(item)
    }
  }

  const handleSaveEdit = async () => {
    if (editingId) {
      try {
        await updateItem(editingId, editForm)
        setEditingId(null)
        setEditForm({})
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to update item')
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteItem(id)
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to delete item')
      }
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditForm({})
  }

  if (loading) {
    return (
      <div className={`
        min-h-screen p-6 lg:p-8 flex items-center justify-center
        ${theme === 'dark' ? 'bg-industrial-dark-bg' : 'bg-industrial-light-bg'}
      `}>
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4" size={48} />
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Loading inventory...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`
        min-h-screen p-6 lg:p-8 flex items-center justify-center
        ${theme === 'dark' ? 'bg-industrial-dark-bg' : 'bg-industrial-light-bg'}
      `}>
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
          <p className={theme === 'dark' ? 'text-red-400' : 'text-red-600'}>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Premium Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className={`text-4xl font-bold mb-2 ${theme === 'dark' ? 'bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent' : 'bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent'}`}>
              Inventory Management
            </h1>
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Advanced Stock Tracking & Management System
            </p>
          </div>
          <div className="flex items-center gap-3">
            <BulkImportButton
              module="inventory"
              onComplete={refetch}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
              }`}
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className={`relative group ${theme === 'dark' ? 'bg-slate-900/50 backdrop-blur-sm border border-slate-800/50' : 'bg-white/80 backdrop-blur-sm border border-slate-200/50'} rounded-2xl p-6 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl`}>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 opacity-10 rounded-2xl group-hover:opacity-20 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 bg-opacity-20`}>
                  <Package className="h-6 w-6 text-blue-400" />
                </div>
                <div className="flex items-center space-x-1 text-green-400 text-sm">
                  <TrendingUp className="h-3 w-3" />
                  <span>+12%</span>
                </div>
              </div>
              <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'} mb-1`}>
                {inventory.length}
              </div>
              <div className="text-sm text-muted-foreground">
                Total Items
              </div>
            </div>
          </div>

          <div className={`relative group ${theme === 'dark' ? 'bg-slate-900/50 backdrop-blur-sm border border-slate-800/50' : 'bg-white/80 backdrop-blur-sm border border-slate-200/50'} rounded-2xl p-6 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl`}>
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 opacity-10 rounded-2xl group-hover:opacity-20 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 bg-opacity-20`}>
                  <Shield className="h-6 w-6 text-green-400" />
                </div>
                <div className="flex items-center space-x-1 text-green-400 text-sm">
                  <TrendingUp className="h-3 w-3" />
                  <span>+8%</span>
                </div>
              </div>
              <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'} mb-1`}>
                {inventory.filter(item => item.stock_level > item.reorder_point).length}
              </div>
              <div className="text-sm text-muted-foreground">
                In Stock
              </div>
            </div>
          </div>

          <div className={`relative group ${theme === 'dark' ? 'bg-slate-900/50 backdrop-blur-sm border border-slate-800/50' : 'bg-white/80 backdrop-blur-sm border border-slate-200/50'} rounded-2xl p-6 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl`}>
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500 opacity-10 rounded-2xl group-hover:opacity-20 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 bg-opacity-20`}>
                  <AlertCircle className="h-6 w-6 text-orange-400" />
                </div>
                <div className="flex items-center space-x-1 text-red-400 text-sm">
                  <TrendingDown className="h-3 w-3" />
                  <span>-3%</span>
                </div>
              </div>
              <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'} mb-1`}>
                {inventory.filter(item => item.stock_level <= item.reorder_point).length}
              </div>
              <div className="text-sm text-muted-foreground">
                Low Stock
              </div>
            </div>
          </div>

          <div className={`relative group ${theme === 'dark' ? 'bg-slate-900/50 backdrop-blur-sm border border-slate-800/50' : 'bg-white/80 backdrop-blur-sm border border-slate-200/50'} rounded-2xl p-6 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl`}>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-10 rounded-2xl group-hover:opacity-20 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 bg-opacity-20`}>
                  <Zap className="h-6 w-6 text-purple-400" />
                </div>
                <div className="flex items-center space-x-1 text-green-400 text-sm">
                  <TrendingUp className="h-3 w-3" />
                  <span>+15%</span>
                </div>
              </div>
              <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'} mb-1`}>
                {inventory.reduce((sum, item) => sum + item.stock_level, 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                Total Units
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Search inventory items..."
              className={`w-full pl-10 pr-4 py-3 rounded-xl border ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700/50 text-white placeholder-gray-500' : 'bg-white/80 border-slate-200/50 text-gray-800 placeholder-gray-400'} backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
            />
          </div>
          <button className={`flex items-center gap-2 px-4 py-3 rounded-xl border ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700/50 text-gray-300 hover:bg-slate-700/50' : 'bg-white/80 border-slate-200/50 text-gray-700 hover:bg-gray-100/80'} backdrop-blur-sm transition-all duration-200`}>
            <Filter className="h-5 w-5" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Low Stock Alert */}
      <LowStockAlert items={inventory} threshold={10} />

      {/* Add Stock Form */}
      <div className="mb-6">
        <StockForm
          onSubmit={handleAddStock}
          existingItems={existingItemNames}
        />
      </div>

      {/* Inventory Table */}
      <div
        className={`
          rounded-lg border overflow-hidden
          ${theme === 'dark'
            ? 'bg-industrial-dark-surface border-industrial-dark-border'
            : 'bg-industrial-light-surface border-industrial-light-border'
          }
        `}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr
                className={`
                  border-b
                  ${theme === 'dark'
                    ? 'border-industrial-dark-border bg-industrial-dark-bg'
                    : 'border-industrial-light-border bg-gray-50'
                  }
                `}
              >
                <th
                  className={`
                    px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider
                    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                  `}
                >
                  Item Name
                </th>
                <th
                  className={`
                    px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider
                    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                  `}
                >
                  Category
                </th>
                <th
                  className={`
                    px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider
                    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                  `}
                >
                  Stock Level
                </th>
                <th
                  className={`
                    px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider
                    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                  `}
                >
                  Unit
                </th>
                <th
                  className={`
                    px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider
                    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                  `}
                >
                  Reorder Point
                </th>
                <th
                  className={`
                    px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider
                    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                  `}
                >
                  Supplier
                </th>
                <th
                  className={`
                    px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider
                    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                  `}
                >
                  Last Stock Date
                </th>
                <th
                  className={`
                    px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider
                    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                  `}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {inventory.map((item) => (
                <tr
                  key={item.id}
                  className={`
                    hover:opacity-90 transition-opacity
                    ${theme === 'dark' ? 'hover:bg-industrial-dark-bg' : 'hover:bg-gray-50'}
                  `}
                >
                  {editingId === item.id ? (
                    <>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={editForm.item_name || ''}
                          onChange={(e) => setEditForm({ ...editForm, item_name: e.target.value })}
                          className={`
                            w-full px-2 py-1 rounded border text-sm
                            ${theme === 'dark'
                              ? 'bg-industrial-dark-bg border-industrial-dark-border text-industrial-dark-text'
                              : 'bg-white border-industrial-light-border text-industrial-light-text'
                            }
                          `}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={editForm.category || ''}
                          onChange={(e) => setEditForm({ ...editForm, category: e.target.value as any })}
                          className={`
                            w-full px-2 py-1 rounded border text-sm
                            ${theme === 'dark'
                              ? 'bg-industrial-dark-bg border-industrial-dark-border text-industrial-dark-text'
                              : 'bg-white border-industrial-light-border text-industrial-light-text'
                            }
                          `}
                        >
                          <option value="raw_material">Raw Material</option>
                          <option value="finished_good">Finished Good</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          value={editForm.stock_level || ''}
                          onChange={(e) => setEditForm({ ...editForm, stock_level: parseFloat(e.target.value) || 0 })}
                          className={`
                            w-full px-2 py-1 rounded border text-sm
                            ${theme === 'dark'
                              ? 'bg-industrial-dark-bg border-industrial-dark-border text-industrial-dark-text'
                              : 'bg-white border-industrial-light-border text-industrial-light-text'
                            }
                          `}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={editForm.unit || ''}
                          onChange={(e) => setEditForm({ ...editForm, unit: e.target.value })}
                          className={`
                            w-full px-2 py-1 rounded border text-sm
                            ${theme === 'dark'
                              ? 'bg-industrial-dark-bg border-industrial-dark-border text-industrial-dark-text'
                              : 'bg-white border-industrial-light-border text-industrial-light-text'
                            }
                          `}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          value={editForm.reorder_point || ''}
                          onChange={(e) => setEditForm({ ...editForm, reorder_point: parseFloat(e.target.value) || 0 })}
                          className={`
                            w-full px-2 py-1 rounded border text-sm
                            ${theme === 'dark'
                              ? 'bg-industrial-dark-bg border-industrial-dark-border text-industrial-dark-text'
                              : 'bg-white border-industrial-light-border text-industrial-light-text'
                            }
                          `}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={editForm.supplier || ''}
                          onChange={(e) => setEditForm({ ...editForm, supplier: e.target.value })}
                          className={`
                            w-full px-2 py-1 rounded border text-sm
                            ${theme === 'dark'
                              ? 'bg-industrial-dark-bg border-industrial-dark-border text-industrial-dark-text'
                              : 'bg-white border-industrial-light-border text-industrial-light-text'
                            }
                          `}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="date"
                          value={editForm.last_stock_date ? new Date(editForm.last_stock_date).toISOString().split('T')[0] : ''}
                          onChange={(e) => setEditForm({ ...editForm, last_stock_date: new Date(e.target.value) })}
                          className={`
                            w-full px-2 py-1 rounded border text-sm
                            ${theme === 'dark'
                              ? 'bg-industrial-dark-bg border-industrial-dark-border text-industrial-dark-text'
                              : 'bg-white border-industrial-light-border text-industrial-light-text'
                            }
                          `}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={handleSaveEdit}
                            className={`
                              p-1.5 rounded hover:opacity-70 transition-opacity
                              ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}
                            `}
                            title="Save"
                          >
                            ✓
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className={`
                              p-1.5 rounded hover:opacity-70 transition-opacity
                              ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
                            `}
                            title="Cancel"
                          >
                            ✕
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td
                        className={`
                          px-6 py-4 whitespace-nowrap text-sm font-medium
                          ${theme === 'dark' ? 'text-industrial-dark-text' : 'text-industrial-light-text'}
                        `}
                      >
                        {item.item_name}
                      </td>
                      <td
                        className={`
                          px-6 py-4 whitespace-nowrap text-sm
                          ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
                        `}
                      >
                        <span
                          className={`
                            px-2 py-1 rounded text-xs font-medium
                            ${item.category === 'raw_material'
                              ? theme === 'dark'
                                ? 'bg-blue-900/30 text-blue-300'
                                : 'bg-blue-100 text-blue-800'
                              : theme === 'dark'
                              ? 'bg-green-900/30 text-green-300'
                              : 'bg-green-100 text-green-800'
                            }
                          `}
                        >
                          {item.category === 'raw_material' ? 'Raw Material' : 'Finished Good'}
                        </span>
                      </td>
                      <td
                        className={`
                          px-6 py-4 whitespace-nowrap text-sm font-semibold
                          ${item.stock_level < 10
                            ? 'text-red-500'
                            : theme === 'dark'
                            ? 'text-industrial-dark-text'
                            : 'text-industrial-light-text'
                          }
                        `}
                      >
                        {item.stock_level.toLocaleString()} {item.unit}
                      </td>
                      <td
                        className={`
                          px-6 py-4 whitespace-nowrap text-sm
                          ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
                        `}
                      >
                        {item.unit}
                      </td>
                      <td
                        className={`
                          px-6 py-4 whitespace-nowrap text-sm
                          ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
                        `}
                      >
                        {item.reorder_point.toLocaleString()}
                      </td>
                      <td
                        className={`
                          px-6 py-4 whitespace-nowrap text-sm
                          ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
                        `}
                      >
                        {item.supplier || 'N/A'}
                      </td>
                      <td
                        className={`
                          px-6 py-4 whitespace-nowrap text-sm
                          ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
                        `}
                      >
                        {item.last_stock_date
                          ? new Date(item.last_stock_date).toLocaleDateString()
                          : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(item.id)}
                            className={`
                              p-2 rounded hover:opacity-70 transition-opacity
                              ${theme === 'dark'
                                ? 'text-blue-400 hover:bg-industrial-dark-bg'
                                : 'text-blue-600 hover:bg-gray-100'
                              }
                            `}
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className={`
                              p-2 rounded hover:opacity-70 transition-opacity
                              ${theme === 'dark'
                                ? 'text-red-400 hover:bg-industrial-dark-bg'
                                : 'text-red-600 hover:bg-gray-100'
                              }
                            `}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {inventory.length === 0 && (
          <div
            className={`
              text-center py-12
              ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
            `}
          >
            <Package size={48} className="mx-auto mb-4 opacity-50" />
            <p>No inventory items found. Add your first item using the form above.</p>
          </div>
        )}
      </div>
    </div>
  )
}

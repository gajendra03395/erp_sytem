'use client'

import Papa from 'papaparse'
import * as XLSX from 'xlsx'

export type ImportModule = 'employees' | 'inventory' | 'machines' | 'quality-control' | 'attendance' | 'production'

const normalizeKey = (key: string) => key.toLowerCase().replace(/[^a-z0-9]/g, '')

const getArrayFromJson = (json: any): any[] => {
  if (Array.isArray(json)) return json
  if (json?.data && Array.isArray(json.data)) return json.data
  if (json?.records && Array.isArray(json.records)) return json.records
  if (json?.items && Array.isArray(json.items)) return json.items
  return []
}

export const parseImportFile = async (file: File): Promise<any[]> => {
  const ext = file.name.split('.').pop()?.toLowerCase()

  if (ext === 'csv') {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results: { data: any[] }) => resolve(results.data as any[]),
        error: (error: unknown) => reject(error),
      })
    })
  }

  if (ext === 'xlsx' || ext === 'xls') {
    const data = await file.arrayBuffer()
    const workbook = XLSX.read(data, { type: 'array' })
    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]
    return XLSX.utils.sheet_to_json(sheet)
  }

  if (ext === 'json') {
    const text = await file.text()
    const json = JSON.parse(text)
    return getArrayFromJson(json)
  }

  throw new Error('Unsupported file format. Use CSV, XLSX, or JSON.')
}

const mapValue = (value: any) => {
  if (value === null || value === undefined) return undefined
  if (typeof value === 'string') return value.trim()
  return value
}

const parseDate = (value: any) => {
  if (!value) return undefined
  const date = value instanceof Date ? value : new Date(value)
  return isNaN(date.getTime()) ? undefined : date
}

const parseNumber = (value: any) => {
  if (value === null || value === undefined || value === '') return undefined
  const num = Number(value)
  return Number.isNaN(num) ? undefined : num
}

const normalizeCategory = (value: any) => {
  const val = String(value || '').toLowerCase()
  if (val.includes('raw')) return 'raw_material'
  if (val.includes('finish')) return 'finished_good'
  return value
}

const normalizeMachineStatus = (value: any) => {
  const val = String(value || '').toLowerCase()
  if (val.includes('maint')) return 'under_maintenance'
  if (val.includes('run')) return 'running'
  if (val.includes('idle')) return 'idle'
  return value
}

const normalizeQCResult = (value: any) => {
  const val = String(value || '').toLowerCase()
  if (val.includes('pass')) return 'pass'
  if (val.includes('fail')) return 'fail'
  if (val.includes('pend')) return 'pending'
  return value
}

const normalizeAttendanceStatus = (value: any) => {
  const val = String(value || '').toLowerCase()
  if (val.includes('present') || val === 'p') return 'present'
  if (val.includes('absent') || val === 'a') return 'absent'
  if (val.includes('late') || val === 'l') return 'late'
  return value
}

export const BULK_IMPORT_CONFIGS = {
  inventory: {
    requiredFields: ['item_name', 'stock_level', 'reorder_point'],
    fieldMapping: {
      item_name: ['item_name', 'name', 'product_name', 'item'],
      stock_level: ['stock_level', 'stock', 'quantity', 'qty'],
      reorder_point: ['reorder_point', 'reorder', 'min_stock'],
      unit: ['unit', 'uom', 'unit_of_measure'],
      category: ['category', 'type', 'item_type'],
      supplier: ['supplier', 'vendor', 'manufacturer'],
      location: ['location', 'warehouse', 'storage'],
      last_stock_date: ['last_stock_date', 'stock_date', 'date'],
    },
    normalizeData: (row: any) => ({
      item_name: String(row.item_name || ''),
      stock_level: Number(row.stock_level) || 0,
      reorder_point: Number(row.reorder_point) || 0,
      unit: String(row.unit || 'pcs'),
      category: String(row.category || 'raw_material'),
      supplier: String(row.supplier || ''),
      location: String(row.location || ''),
      last_stock_date: row.last_stock_date ? new Date(row.last_stock_date) : new Date(),
    }),
  },
  employees: {
    requiredFields: ['employee_id', 'name', 'email', 'role'],
    fieldMapping: {
      employee_id: ['employee_id', 'id', 'emp_id'],
      name: ['name', 'full_name', 'employee_name'],
      email: ['email', 'email_address'],
      role: ['role', 'job_role', 'position'],
      department: ['department', 'dept'],
      phone: ['phone', 'phone_number', 'contact'],
      shift: ['shift', 'work_shift', 'schedule'],
      join_date: ['join_date', 'hire_date', 'start_date'],
    },
    normalizeData: (row: any) => ({
      employee_id: String(row.employee_id || ''),
      name: String(row.name || ''),
      email: String(row.email || ''),
      role: String(row.role || 'OPERATOR'),
      department: String(row.department || ''),
      phone: String(row.phone || ''),
      shift: String(row.shift || 'Day'),
      join_date: row.join_date ? new Date(row.join_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    }),
  },
  machines: {
    requiredFields: ['machine_name', 'status'],
    fieldMapping: {
      machine_name: ['machine_name', 'name', 'machine'],
      status: ['status', 'machine_status'],
      location: ['location', 'area', 'department'],
      capacity: ['capacity', 'production_capacity'],
      maintenance_date: ['maintenance_date', 'last_maintenance', 'service_date'],
    },
    normalizeData: (row: any) => ({
      machine_name: String(row.machine_name || ''),
      status: String(row.status || 'active'),
      location: String(row.location || ''),
      capacity: Number(row.capacity) || 0,
      maintenance_date: row.maintenance_date ? new Date(row.maintenance_date).toISOString().split('T')[0] : '',
    }),
  },
  'quality-control': {
    requiredFields: ['product_name', 'batch_no', 'result'],
    fieldMapping: {
      product_name: ['product_name', 'name', 'product'],
      batch_no: ['batch_no', 'batch', 'batch_number'],
      result: ['result', 'quality_result', 'status'],
      inspector: ['inspector', 'inspected_by', 'qa_inspector'],
      notes: ['notes', 'comments', 'remarks'],
    },
    normalizeData: (row: any) => ({
      product_name: String(row.product_name || ''),
      batch_no: String(row.batch_no || ''),
      result: String(row.result || 'pass'),
      inspector: String(row.inspector || ''),
      notes: String(row.notes || ''),
    }),
  },
  attendance: {
    requiredFields: ['employee_id', 'date', 'status'],
    fieldMapping: {
      employee_id: ['employee_id', 'id', 'emp_id'],
      date: ['date', 'attendance_date'],
      status: ['status', 'attendance_status'],
      notes: ['notes', 'comments', 'remarks'],
    },
    normalizeData: (row: any) => ({
      employee_id: String(row.employee_id || ''),
      date: row.date ? new Date(row.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      status: String(row.status || 'present').toLowerCase(),
      notes: String(row.notes || ''),
    }),
  },
  production: {
    requiredFields: ['order_no', 'product_name', 'quantity'],
    fieldMapping: {
      order_no: ['order_no', 'order_number', 'wo_number'],
      product_name: ['product_name', 'name', 'product'],
      product_sku: ['product_sku', 'sku', 'item_code'],
      quantity: ['quantity', 'qty'],
      unit: ['unit', 'uom', 'unit_of_measure'],
      priority: ['priority', 'order_priority'],
      start_date: ['start_date', 'planned_start'],
      due_date: ['due_date', 'planned_end', 'deadline'],
      assigned_to: ['assigned_to', 'operator', 'technician'],
      bom_id: ['bom_id', 'bom'],
      notes: ['notes', 'comments', 'remarks'],
    },
    normalizeData: (row: any) => ({
      order_no: String(row.order_no || ''),
      product_name: String(row.product_name || ''),
      product_sku: String(row.product_sku || ''),
      quantity: Number(row.quantity) || 1,
      unit: String(row.unit || 'pcs'),
      priority: String(row.priority || 'medium'),
      start_date: row.start_date ? new Date(row.start_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      due_date: row.due_date ? new Date(row.due_date).toISOString().split('T')[0] : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      assigned_to: String(row.assigned_to || ''),
      bom_id: String(row.bom_id || ''),
      notes: String(row.notes || ''),
    }),
  },
} as const

const FIELD_MAP: Record<ImportModule, Record<string, string>> = Object.fromEntries(
  (Object.entries(BULK_IMPORT_CONFIGS) as Array<[ImportModule, any]>).map(([module, config]) => {
    const map: Record<string, string> = {}
    const fieldMapping = config.fieldMapping as Record<string, string[]>

    Object.entries(fieldMapping).forEach(([targetKey, aliases]) => {
      aliases.forEach((alias) => {
        map[normalizeKey(alias)] = targetKey
      })
    })

    return [module, map]
  })
) as Record<ImportModule, Record<string, string>>

const REQUIRED_FIELDS: Record<ImportModule, readonly string[]> = Object.fromEntries(
  (Object.entries(BULK_IMPORT_CONFIGS) as Array<[ImportModule, any]>).map(([module, config]) => [
    module,
    config.requiredFields as readonly string[],
  ])
) as Record<ImportModule, readonly string[]>

export const processBulkImport = async (
  module: ImportModule,
  records: any[],
  createFunction: (data: any) => Promise<any>
) => {
  const config = BULK_IMPORT_CONFIGS[module]
  if (!config) {
    throw new Error(`Unsupported module: ${module}`)
  }

  const results = {
    total: records.length,
    success: 0,
    failed: 0,
    errors: [] as string[],
  }

  for (let i = 0; i < records.length; i++) {
    try {
      const record = records[i]
      
      // Check required fields
      const missingFields = config.requiredFields.filter(field => !record[field])
      if (missingFields.length > 0) {
        results.failed++
        results.errors.push(`Row ${i + 1}: Missing required fields: ${missingFields.join(', ')}`)
        continue
      }

      // Normalize data using config
      const normalizedData = config.normalizeData(record)
      
      // Create record
      await createFunction(normalizedData)
      results.success++
    } catch (error) {
      results.failed++
      results.errors.push(`Row ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  return results
}

export const mapImportRecords = (module: ImportModule, records: any[]) => {
  const mapped = records.map((record) => {
    const entry: Record<string, any> = {}

    Object.entries(record || {}).forEach(([key, value]) => {
      const normalizedKey = normalizeKey(key)
      const targetKey = FIELD_MAP[module][normalizedKey]
      if (targetKey) {
        entry[targetKey] = mapValue(value)
      }
    })

    if (module === 'inventory') {
      entry.category = normalizeCategory(entry.category)
      entry.stock_level = parseNumber(entry.stock_level)
      entry.reorder_point = parseNumber(entry.reorder_point)
      entry.last_stock_date = parseDate(entry.last_stock_date)
    }

    if (module === 'machines') {
      entry.status = normalizeMachineStatus(entry.status)
      entry.last_service_date = parseDate(entry.last_service_date)
      entry.next_service_date = parseDate(entry.next_service_date)
    }

    if (module === 'quality-control') {
      entry.quantity_inspected = parseNumber(entry.quantity_inspected)
      entry.result = normalizeQCResult(entry.result)
      entry.inspection_date = parseDate(entry.inspection_date)
    }

    if (module === 'employees') {
      entry.phone = entry.phone ? String(entry.phone) : entry.phone
    }

    if (module === 'attendance') {
      entry.date = parseDate(entry.date)
      entry.status = normalizeAttendanceStatus(entry.status)
    }

    return entry
  })

  const valid: any[] = []
  const invalid: { record: any; errors: string[] }[] = []

  mapped.forEach((record, index) => {
    const missing = REQUIRED_FIELDS[module].filter((field) => !record[field])
    if (missing.length) {
      invalid.push({ record: records[index], errors: missing })
    } else {
      valid.push(record)
    }
  })

  return { valid, invalid }
}

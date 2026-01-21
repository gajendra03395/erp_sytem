// Role-Based Access Control (RBAC) System

import type { EmployeeRole } from '../../types/employee'

export type Permission = 
  | 'view_dashboard'
  | 'edit_dashboard'
  | 'view_analytics'
  | 'edit_analytics'
  | 'view_financial'
  | 'edit_financial'
  | 'view_inventory'
  | 'edit_inventory'
  | 'view_employees'
  | 'edit_employees'
  | 'view_machines'
  | 'edit_machines'
  | 'view_qc'
  | 'edit_qc'
  | 'delete_inventory'
  | 'delete_employees'
  | 'delete_machines'
  | 'delete_qc'
  | 'view_attendance'
  | 'mark_attendance'
  | 'view_production'
  | 'manage_production'
  | 'manage_system'
  | 'view_logs'
  | 'manage_users'
  | 'backup_data'
  | 'system_settings'

export const rolePermissions: Record<EmployeeRole, Permission[]> = {
  SUPERUSER: [
    'view_dashboard',
    'view_analytics',
    'edit_analytics',
    'view_financial',
    'edit_financial',
    'view_inventory',
    'edit_inventory',
    'delete_inventory',
    'view_employees',
    'edit_employees',
    'delete_employees',
    'view_machines',
    'edit_machines',
    'delete_machines',
    'view_qc',
    'edit_qc',
    'delete_qc',
    'view_attendance',
    'mark_attendance',
    'view_production',
    'manage_production',
    'manage_system',
    'view_logs',
    'manage_users',
    'backup_data',
    'system_settings',
  ],
  ADMIN: [
    'view_dashboard',
    'view_analytics',
    'edit_analytics',
    'view_financial',
    'edit_financial',
    'view_inventory',
    'edit_inventory',
    'delete_inventory',
    'view_employees',
    'edit_employees',
    'delete_employees',
    'view_machines',
    'edit_machines',
    'delete_machines',
    'view_qc',
    'edit_qc',
    'delete_qc',
    'view_attendance',
    'mark_attendance',
    'view_production',
    'manage_production',
  ],
  SUPERVISOR: [
    'view_dashboard',
    'view_analytics',
    'view_financial',
    'view_inventory',
    'edit_inventory',
    'view_employees',
    'view_machines',
    'view_qc',
    'view_attendance',
    'mark_attendance',
    'view_production',
    'manage_production',
  ],
  OPERATOR: [
    'view_dashboard',
    'view_machines',
    'view_attendance',
    'view_production',
  ],
}

export function hasPermission(role: EmployeeRole | null, permission: Permission): boolean {
  if (!role) return false
  return rolePermissions[role]?.includes(permission) ?? false
}

export function canEdit(role: EmployeeRole | null, resource: 'inventory' | 'employees' | 'machines' | 'qc' | 'financial'): boolean {
  if (!role) return false
  const permissionMap = {
    inventory: 'edit_inventory',
    employees: 'edit_employees',
    machines: 'edit_machines',
    qc: 'edit_qc',
    financial: 'edit_financial',
  } as const
  return hasPermission(role, permissionMap[resource])
}

export function canDelete(role: EmployeeRole | null, resource: 'inventory' | 'employees' | 'machines' | 'qc'): boolean {
  if (!role) return false
  const permissionMap = {
    inventory: 'delete_inventory',
    employees: 'delete_employees',
    machines: 'delete_machines',
    qc: 'delete_qc',
  } as const
  return hasPermission(role, permissionMap[resource])
}

export function canManageAttendance(role: EmployeeRole | null): boolean {
  if (!role) return false
  return hasPermission(role, 'mark_attendance')
}

export function canViewAttendance(role: EmployeeRole | null): boolean {
  if (!role) return false
  return hasPermission(role, 'view_attendance')
}

export function canViewAnalytics(role: EmployeeRole | null): boolean {
  if (!role) return false
  return hasPermission(role, 'view_analytics')
}

export function canEditAnalytics(role: EmployeeRole | null): boolean {
  if (!role) return false
  return hasPermission(role, 'edit_analytics')
}

export function canViewFinancial(role: EmployeeRole | null): boolean {
  if (!role) return false
  return hasPermission(role, 'view_financial')
}

export function canEditFinancial(role: EmployeeRole | null): boolean {
  if (!role) return false
  return hasPermission(role, 'edit_financial')
}

export function canViewInventory(role: EmployeeRole | null): boolean {
  if (!role) return false
  return hasPermission(role, 'view_inventory')
}

export function canEditInventory(role: EmployeeRole | null): boolean {
  if (!role) return false
  return hasPermission(role, 'edit_inventory')
}

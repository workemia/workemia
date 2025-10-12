export type UserRole = 'admin' | 'employee' | 'provider' | 'client' | 'visitor'

export interface UserPermissions {
  canCreateServices: boolean
  canManageUsers: boolean
  canViewAnalytics: boolean
  canModerateContent: boolean
  canAccessAdmin: boolean
  canViewAllServices: boolean
  canManagePayments: boolean
  canViewReports: boolean
}

export interface AuthUser {
  id: string
  name: string
  email: string
  avatar?: string
  role: UserRole
  permissions: UserPermissions
  service?: string
  isAdmin: boolean
  isEmployee: boolean
  department?: string
  level?: number
  phone?: string
  type?: string
}

export const ROLE_HIERARCHY = {
  admin: 5,
  employee: 4, 
  provider: 3,
  client: 2,
  visitor: 1
}

export const DEFAULT_PERMISSIONS: Record<UserRole, UserPermissions> = {
  admin: {
    canCreateServices: true,
    canManageUsers: true,
    canViewAnalytics: true,
    canModerateContent: true,
    canAccessAdmin: true,
    canViewAllServices: true,
    canManagePayments: true,
    canViewReports: true
  },
  employee: {
    canCreateServices: false,
    canManageUsers: false,
    canViewAnalytics: true,
    canModerateContent: true,
    canAccessAdmin: false,
    canViewAllServices: true,
    canManagePayments: false,
    canViewReports: true
  },
  provider: {
    canCreateServices: true,
    canManageUsers: false,
    canViewAnalytics: false,
    canModerateContent: false,
    canAccessAdmin: false,
    canViewAllServices: false,
    canManagePayments: false,
    canViewReports: false
  },
  client: {
    canCreateServices: true,
    canManageUsers: false,
    canViewAnalytics: false,
    canModerateContent: false,
    canAccessAdmin: false,
    canViewAllServices: false,
    canManagePayments: false,
    canViewReports: false
  },
  visitor: {
    canCreateServices: false,
    canManageUsers: false,
    canViewAnalytics: false,
    canModerateContent: false,
    canAccessAdmin: false,
    canViewAllServices: false,
    canManagePayments: false,
    canViewReports: false
  }
}
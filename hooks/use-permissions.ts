import { useAuth } from './use-auth'
import { UserRole, UserPermissions, DEFAULT_PERMISSIONS, ROLE_HIERARCHY } from '@/types/auth'

export function usePermissions() {
  const { user } = useAuth()

  const hasRole = (requiredRole: UserRole): boolean => {
    if (!user) return false
    
    const userLevel = ROLE_HIERARCHY[user.role]
    const requiredLevel = ROLE_HIERARCHY[requiredRole]
    
    return userLevel >= requiredLevel
  }

  const hasPermission = (permission: keyof UserPermissions): boolean => {
    if (!user) return false
    
    return user.permissions?.[permission] || DEFAULT_PERMISSIONS[user.role][permission] || false
  }

  const canAccess = (requiredRole: UserRole, permission?: keyof UserPermissions): boolean => {
    if (!user) return false
    if (!user.role) {
      console.warn('⚠️ User sem role:', user)
      return false
    }

    // Para admin e employee, role precisa ser exata (não hierarquia)
    if (requiredRole === 'admin' || requiredRole === 'employee') {
      return user.role === requiredRole
    } else {
      // Para outros roles, pode usar hierarquia
      if (!hasRole(requiredRole)) return false
    }

    if (permission && !hasPermission(permission)) return false
    return true
  }

  const isAdmin = (): boolean => hasRole('admin')
  const isEmployee = (): boolean => hasRole('employee')
  const isProvider = (): boolean => user?.role === 'provider'
  const isClient = (): boolean => user?.role === 'client'
  const isVisitor = (): boolean => user?.role === 'visitor'

  const getAccessibleRoutes = (): string[] => {
    if (!user) return ['/']

    const routes: string[] = ['/']

    switch (user.role) {
      case 'admin':
        return [
          '/',
          '/dashboard/admin',
          '/dashboard/admin/users',
          '/dashboard/admin/services', 
          '/dashboard/admin/analytics',
          '/dashboard/admin/payments',
          '/dashboard/admin/reports',
          '/dashboard/admin/settings',
          '/solicitar-servico',
          '/servicos',
          '/perfil'
        ]
      
      case 'employee':
        return [
          '/',
          '/dashboard/employee',
          '/dashboard/employee/analytics',
          '/dashboard/employee/moderation',
          '/dashboard/employee/reports',
          '/servicos',
          '/perfil'
        ]
      
      case 'provider':
        return [
          '/',
          '/dashboard/prestador',
          '/solicitar-servico',
          '/servicos', 
          '/perfil'
        ]
      
      case 'client':
        return [
          '/',
          '/dashboard/cliente',
          '/solicitar-servico',
          '/servicos',
          '/perfil'
        ]
      
      case 'visitor':
        return [
          '/',
          '/servicos',
          '/como-funciona',
          '/seja-prestador'
        ]
    }

    return routes
  }

  return {
    user,
    hasRole,
    hasPermission,
    canAccess,
    isAdmin,
    isEmployee,
    isProvider,
    isClient,
    isVisitor,
    getAccessibleRoutes,
    permissions: user?.permissions || DEFAULT_PERMISSIONS[user?.role || 'visitor']
  }
}
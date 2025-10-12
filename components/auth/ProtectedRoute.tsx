'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePermissions } from '@/hooks/use-permissions'
import { UserRole, UserPermissions } from '@/types/auth'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: UserRole
  requiredPermission?: keyof UserPermissions
  fallbackRoute?: string
  loadingComponent?: React.ReactNode
}

export function ProtectedRoute({
  children,
  requiredRole,
  requiredPermission,
  fallbackRoute = '/login',
  loadingComponent
}: ProtectedRouteProps) {
  const router = useRouter()
  const { user, hasRole, hasPermission, canAccess } = usePermissions()
  const { loading } = require('@/hooks/use-auth').useAuth()

  useEffect(() => {
    // IMPORTANTE: Só redireciona se não estiver carregando
    if (loading) {
      console.log('🔄 ProtectedRoute: Aguardando loading...')
      return
    }

    // Se não há usuário, redirecionar para login apropriado
    if (!user) {
      console.log('❌ ProtectedRoute: Sem usuário, redirecionando...')
      // Admin/Employee vão para /admin/login
      const loginRoute = (requiredRole === 'admin' || requiredRole === 'employee')
        ? '/admin/login'
        : '/login'
      router.push(loginRoute)
      return
    }

    console.log('✅ ProtectedRoute: User encontrado', { email: user.email, role: user.role, requiredRole })

    // Verificar acesso baseado em role e permissão
    if (requiredRole && !canAccess(requiredRole, requiredPermission)) {
      console.log('❌ ProtectedRoute: canAccess falhou, redirecionando...')
      // Redirecionar baseado no role do usuário
      const redirectMap: Record<string, string> = {
        admin: '/dashboard/admin',
        employee: '/dashboard/employee',
        provider: '/dashboard/prestador',
        client: '/dashboard/cliente',
        visitor: '/'
      }

      const redirectTo = user.role ? redirectMap[user.role] : '/'
      router.push(redirectTo)
      return
    }

    console.log('✅ ProtectedRoute: Acesso permitido!')
  }, [user, loading, requiredRole, requiredPermission, router, canAccess])

  // Se está carregando ou não há usuário ainda, mostrar loading
  if (loading || !user) {
    return loadingComponent || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Verificando acesso...</p>
        </div>
      </div>
    )
  }

  // Se não tem acesso, não mostrar nada (redirecionamento já foi feito)
  if (requiredRole && !canAccess(requiredRole, requiredPermission)) {
    return null
  }

  return <>{children}</>
}

// HOC para facilitar uso
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  requiredRole?: UserRole,
  requiredPermission?: keyof UserPermissions
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <ProtectedRoute 
        requiredRole={requiredRole}
        requiredPermission={requiredPermission}
      >
        <Component {...props} />
      </ProtectedRoute>
    )
  }
}
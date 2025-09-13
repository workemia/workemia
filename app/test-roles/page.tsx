'use client'

import { usePermissions } from '@/hooks/use-permissions'
import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export default function TestRolesPage() {
  const { user, loading } = useAuth()
  const { 
    hasRole, 
    hasPermission, 
    canAccess, 
    isAdmin, 
    isEmployee, 
    isProvider, 
    isClient, 
    isVisitor,
    getAccessibleRoutes,
    permissions 
  } = usePermissions()

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">🧪 Teste de Hierarquia de Usuários</h1>
          <p className="text-gray-600">Página para testar a estrutura de roles e permissões</p>
        </div>

        {/* Informações do Usuário */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>👤 Informações do Usuário Atual</CardTitle>
          </CardHeader>
          <CardContent>
            {user ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <strong>Nome:</strong> {user.name}
                  </div>
                  <div>
                    <strong>Email:</strong> {user.email}
                  </div>
                  <div>
                    <strong>Role:</strong> 
                    <Badge className="ml-2" variant={
                      user.role === 'admin' ? 'destructive' :
                      user.role === 'employee' ? 'secondary' :
                      user.role === 'provider' ? 'default' :
                      user.role === 'client' ? 'outline' : 'secondary'
                    }>
                      {user.role}
                    </Badge>
                  </div>
                  <div>
                    <strong>ID:</strong> {user.id}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">Usuário não logado</p>
            )}
          </CardContent>
        </Card>

        {/* Verificações de Role */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>🏷️ Verificações de Role</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className={`p-3 rounded-lg text-center ${isAdmin() ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600'}`}>
                <div className="font-semibold">Admin</div>
                <div className="text-sm">{isAdmin() ? '✅' : '❌'}</div>
              </div>
              <div className={`p-3 rounded-lg text-center ${isEmployee() ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-600'}`}>
                <div className="font-semibold">Employee</div>
                <div className="text-sm">{isEmployee() ? '✅' : '❌'}</div>
              </div>
              <div className={`p-3 rounded-lg text-center ${isProvider() ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
                <div className="font-semibold">Provider</div>
                <div className="text-sm">{isProvider() ? '✅' : '❌'}</div>
              </div>
              <div className={`p-3 rounded-lg text-center ${isClient() ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                <div className="font-semibold">Client</div>
                <div className="text-sm">{isClient() ? '✅' : '❌'}</div>
              </div>
              <div className={`p-3 rounded-lg text-center ${isVisitor() ? 'bg-gray-200 text-gray-800' : 'bg-gray-100 text-gray-600'}`}>
                <div className="font-semibold">Visitor</div>
                <div className="text-sm">{isVisitor() ? '✅' : '❌'}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Permissões */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>🔐 Permissões do Usuário</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(permissions).map(([permission, hasAccess]) => (
                <div 
                  key={permission}
                  className={`p-3 rounded-lg ${hasAccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{permission}</span>
                    <span className="text-lg">{hasAccess ? '✅' : '❌'}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Rotas Acessíveis */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>🗺️ Rotas Acessíveis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {getAccessibleRoutes().map((route) => (
                <Link key={route} href={route}>
                  <div className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg text-sm font-medium transition-colors cursor-pointer">
                    {route}
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Testes de Acesso */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>🔍 Testes de Acesso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Acesso a Dashboards:</h4>
                  <div className="space-y-2 text-sm">
                    <div>Admin Dashboard: {canAccess('admin') ? '✅' : '❌'}</div>
                    <div>Employee Dashboard: {canAccess('employee') ? '✅' : '❌'}</div>
                    <div>Provider Dashboard: {canAccess('provider') ? '✅' : '❌'}</div>
                    <div>Client Dashboard: {canAccess('client') ? '✅' : '❌'}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Permissões Específicas:</h4>
                  <div className="space-y-2 text-sm">
                    <div>Gerenciar Usuários: {hasPermission('canManageUsers') ? '✅' : '❌'}</div>
                    <div>Ver Analytics: {hasPermission('canViewAnalytics') ? '✅' : '❌'}</div>
                    <div>Moderar Conteúdo: {hasPermission('canModerateContent') ? '✅' : '❌'}</div>
                    <div>Acesso Admin: {hasPermission('canAccessAdmin') ? '✅' : '❌'}</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Links para Dashboards */}
        <Card>
          <CardHeader>
            <CardTitle>🚀 Testar Navegação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Link href="/dashboard/admin">
                <Button variant="destructive" className="w-full">
                  Admin
                </Button>
              </Link>
              <Link href="/dashboard/employee">
                <Button variant="secondary" className="w-full">
                  Employee
                </Button>
              </Link>
              <Link href="/dashboard/prestador">
                <Button variant="default" className="w-full">
                  Provider
                </Button>
              </Link>
              <Link href="/dashboard/cliente">
                <Button variant="outline" className="w-full">
                  Client
                </Button>
              </Link>
              <Link href="/dashboard/visitor">
                <Button variant="ghost" className="w-full">
                  Visitor
                </Button>
              </Link>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              ⚠️ Clique nos botões para testar o redirecionamento automático baseado em roles
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
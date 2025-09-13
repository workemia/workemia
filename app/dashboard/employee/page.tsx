'use client'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { usePermissions } from '@/hooks/use-permissions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart3, Shield, FileText, Eye, AlertTriangle, CheckCircle } from 'lucide-react'

function EmployeeDashboardContent() {
  const { user, permissions } = usePermissions()

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard do Funcionário</h1>
          <p className="text-gray-600">Monitoramento e análise da plataforma</p>
          <p className="text-sm text-blue-600">Logado como: {user?.name} ({user?.role})</p>
        </div>

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Denúncias Pendentes</p>
                  <p className="text-2xl font-bold text-red-600">12</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Moderações Hoje</p>
                  <p className="text-2xl font-bold text-blue-600">28</p>
                </div>
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Serviços Analisados</p>
                  <p className="text-2xl font-bold text-green-600">156</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Relatórios Gerados</p>
                  <p className="text-2xl font-bold text-purple-600">8</p>
                </div>
                <FileText className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ações específicas para funcionários */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {permissions.canViewAnalytics && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Analytics & Métricas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Visualize estatísticas e tendências da plataforma
                </p>
                <Button className="w-full">
                  Ver Analytics
                </Button>
              </CardContent>
            </Card>
          )}

          {permissions.canModerateContent && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Centro de Moderação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Modere conteúdo, analise denúncias e tome ações
                </p>
                <Button className="w-full">
                  Moderar Conteúdo
                </Button>
              </CardContent>
            </Card>
          )}

          {permissions.canViewAllServices && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Monitoramento de Serviços
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Monitore todos os serviços da plataforma
                </p>
                <Button className="w-full">
                  Ver Serviços
                </Button>
              </CardContent>
            </Card>
          )}

          {permissions.canViewReports && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Relatórios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Gere relatórios de qualidade e performance
                </p>
                <Button className="w-full">
                  Gerar Relatórios
                </Button>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Denúncias & Alertas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Gerencie denúncias e alertas de qualidade
              </p>
              <Button className="w-full">
                Ver Denúncias
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Qualidade dos Serviços
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Analise e aprove prestadores e serviços
              </p>
              <Button className="w-full">
                Analisar Qualidade
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Debug info */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold mb-2">Permissões do funcionário:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            {Object.entries(permissions).map(([key, value]) => (
              <div key={key} className={`p-2 rounded ${value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {key}: {value ? '✓' : '✗'}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function EmployeeDashboard() {
  return (
    <ProtectedRoute requiredRole="employee">
      <EmployeeDashboardContent />
    </ProtectedRoute>
  )
}
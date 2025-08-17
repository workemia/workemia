"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    router.push("/login")
    return null
  }

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Bem-vindo ao ServiceHub</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Usuário</CardTitle>
              <CardDescription>Dados sincronizados entre Firebase e Supabase</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Nome</label>
                <p className="text-lg">{user.display_name || "Não informado"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-lg">{user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">ID do Usuário</label>
                <p className="text-sm text-gray-600 font-mono">{user.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Firebase UID</label>
                <p className="text-sm text-gray-600 font-mono">{user.firebase_uid}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Criado em</label>
                <p className="text-sm text-gray-600">{new Date(user.created_at).toLocaleDateString("pt-BR")}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ações</CardTitle>
              <CardDescription>Gerencie sua conta e navegue pelo sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={() => router.push("/servicos")} className="w-full">
                <i className="fas fa-search mr-2"></i>
                Buscar Serviços
              </Button>
              <Button onClick={() => router.push("/")} variant="outline" className="w-full">
                <i className="fas fa-home mr-2"></i>
                Voltar ao Início
              </Button>
              <Button onClick={handleSignOut} variant="destructive" className="w-full">
                <i className="fas fa-sign-out-alt mr-2"></i>
                Sair
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

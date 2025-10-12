"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import { UserPlus, Trash2, Edit, Shield, Users } from "lucide-react"

interface User {
  id: string
  email: string
  role: string
  created_at: string
  last_sign_in_at: string | null
}

export default function UsersManagementPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    role: "client",
    full_name: ""
  })

  useEffect(() => {
    checkAdminAndLoadUsers()
  }, [])

  async function checkAdminAndLoadUsers() {
    const supabase = createClient()

    // Verificar se é admin
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      toast({
        title: "Acesso negado",
        description: "Apenas administradores podem acessar esta página",
        variant: "destructive"
      })
      router.push('/dashboard/cliente')
      return
    }

    loadUsers()
  }

  async function loadUsers() {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/users')
      const data = await response.json()

      if (response.ok) {
        setUsers(data.users || [])
      } else {
        toast({
          title: "Erro",
          description: data.error || "Erro ao carregar usuários",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
      toast({
        title: "Erro",
        description: "Erro ao carregar usuários",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault()
    setIsProcessing(true)

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Usuário criado!",
          description: `Usuário ${newUser.email} criado com sucesso`
        })
        setShowCreateModal(false)
        setNewUser({ email: "", password: "", role: "client", full_name: "" })
        loadUsers()
      } else {
        toast({
          title: "Erro",
          description: data.error || "Erro ao criar usuário",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar usuário",
        variant: "destructive"
      })
    } finally {
      setIsProcessing(false)
    }
  }

  async function handleUpdateRole(userId: string, newRole: string) {
    setIsProcessing(true)

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Role atualizada!",
          description: "Role do usuário atualizada com sucesso"
        })
        setShowEditModal(false)
        loadUsers()
      } else {
        toast({
          title: "Erro",
          description: data.error || "Erro ao atualizar role",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar role",
        variant: "destructive"
      })
    } finally {
      setIsProcessing(false)
    }
  }

  async function handleDeleteUser(userId: string, userEmail: string) {
    if (!confirm(`Tem certeza que deseja deletar o usuário ${userEmail}?`)) {
      return
    }

    setIsProcessing(true)

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Usuário deletado!",
          description: "Usuário removido com sucesso"
        })
        loadUsers()
      } else {
        toast({
          title: "Erro",
          description: data.error || "Erro ao deletar usuário",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao deletar usuário",
        variant: "destructive"
      })
    } finally {
      setIsProcessing(false)
    }
  }

  function getRoleBadgeColor(role: string) {
    const colors: Record<string, string> = {
      admin: "bg-red-100 text-red-800",
      employee: "bg-purple-100 text-purple-800",
      provider: "bg-blue-100 text-blue-800",
      client: "bg-green-100 text-green-800",
      visitor: "bg-gray-100 text-gray-800"
    }
    return colors[role] || "bg-gray-100 text-gray-800"
  }

  function getRoleLabel(role: string) {
    const labels: Record<string, string> = {
      admin: "Administrador",
      employee: "Funcionário",
      provider: "Prestador",
      client: "Cliente",
      visitor: "Visitante"
    }
    return labels[role] || role
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando usuários...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Shield className="h-8 w-8 text-red-600" />
              Gerenciamento de Usuários
            </h1>
            <p className="text-gray-600 mt-1">
              Administre todos os usuários da plataforma
            </p>
          </div>

          <Button onClick={() => setShowCreateModal(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Novo Usuário
          </Button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold">{users.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm text-gray-600">Admins</p>
                  <p className="text-2xl font-bold">
                    {users.filter(u => u.role === 'admin').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Prestadores</p>
                  <p className="text-2xl font-bold">
                    {users.filter(u => u.role === 'provider').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Clientes</p>
                  <p className="text-2xl font-bold">
                    {users.filter(u => u.role === 'client').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Usuários */}
        <Card>
          <CardHeader>
            <CardTitle>Todos os Usuários ({users.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-gray-900">{user.email}</h3>
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {getRoleLabel(user.role)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Criado em: {new Date(user.created_at).toLocaleDateString('pt-BR')}
                      {user.last_sign_in_at && (
                        <span className="ml-4">
                          Último acesso: {new Date(user.last_sign_in_at).toLocaleDateString('pt-BR')}
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedUser(user)
                        setShowEditModal(true)
                      }}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar Role
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteUser(user.id, user.email)}
                      disabled={isProcessing}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Deletar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Modal de Criar Usuário */}
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Usuário</DialogTitle>
              <DialogDescription>
                Preencha os dados do novo usuário
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Senha *</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  required
                  minLength={6}
                />
              </div>

              <div>
                <Label htmlFor="full_name">Nome Completo</Label>
                <Input
                  id="full_name"
                  value={newUser.full_name}
                  onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="role">Role *</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value) => setNewUser({ ...newUser, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="employee">Funcionário</SelectItem>
                    <SelectItem value="provider">Prestador</SelectItem>
                    <SelectItem value="client">Cliente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isProcessing}>
                  {isProcessing ? "Criando..." : "Criar Usuário"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Modal de Editar Role */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Role do Usuário</DialogTitle>
              <DialogDescription>
                Usuário: {selectedUser?.email}
              </DialogDescription>
            </DialogHeader>

            {selectedUser && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit_role">Nova Role</Label>
                  <Select
                    defaultValue={selectedUser.role}
                    onValueChange={(value) => handleUpdateRole(selectedUser.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="employee">Funcionário</SelectItem>
                      <SelectItem value="provider">Prestador</SelectItem>
                      <SelectItem value="client">Cliente</SelectItem>
                      <SelectItem value="visitor">Visitante</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

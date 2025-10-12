"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Bell,
  MessageCircle,
  Settings,
  LogOut,
  User,
  Home,
  Menu,
  X,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { NotificationCenter } from "@/components/notifications/notification-center"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/hooks/use-auth"

interface AuthenticatedLayoutProps {
  children: React.ReactNode
}

/**
 * Layout para páginas autenticadas (dashboards)
 *
 * Inclui:
 * - Header compacto com logo, notificações e perfil
 * - Sem footer (ou footer minimalista opcional)
 * - Sidebar opcional (pode ser adicionada no futuro)
 *
 * Usado em:
 * - Dashboard Admin (/dashboard/admin)
 * - Dashboard Cliente (/dashboard/cliente)
 * - Dashboard Prestador (/dashboard/prestador)
 * - Dashboard Employee (/dashboard/employee)
 * - Páginas de perfil, configurações, etc
 */
export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const router = useRouter()
  const { user, loading, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      })
      router.push("/")
    } catch (error) {
      toast({
        title: "Erro no logout",
        description: "Não foi possível fazer logout. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const getDashboardLink = () => {
    if (!user) return "/login"
    switch (user.role) {
      case 'admin':
        return '/dashboard/admin'
      case 'employee':
        return '/dashboard/employee'
      case 'provider':
        return '/dashboard/prestador'
      case 'client':
        return '/dashboard/cliente'
      default:
        return '/dashboard/visitor'
    }
  }

  // Verificar se usuário está autenticado
  // IMPORTANTE: Só redireciona se não estiver carregando E não houver usuário
  // Isso evita redirecionamento prematuro durante carregamento do perfil
  useEffect(() => {
    if (!loading && !user) {
      // Verificar se realmente não tem sessão no Supabase
      const checkSession = async () => {
        const supabase = await import("@/lib/supabase/client").then(m => m.createClient())
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
          // Redirecionar baseado no pathname atual
          const isAdminArea = window.location.pathname.startsWith('/admin') ||
                              window.location.pathname.startsWith('/dashboard/admin') ||
                              window.location.pathname.startsWith('/dashboard/employee')

          router.push(isAdminArea ? "/admin/login" : "/login")
        }
      }

      checkSession()
    }
  }, [user, loading, router])

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
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Compacto */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <Link href={getDashboardLink()} className="text-2xl font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                Workemia
              </Link>
              {user.role && (
                <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                  {user.role === 'admin' ? 'Administrador' :
                   user.role === 'employee' ? 'Funcionário' :
                   user.role === 'provider' ? 'Prestador' :
                   user.role === 'client' ? 'Cliente' : 'Visitante'}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <ThemeToggle variant="button" className="hidden sm:flex" />

              {/* Notifications */}
              <NotificationCenter />

              {/* Messages */}
              <Button variant="ghost" size="sm" asChild>
                <Link href="/chat">
                  <MessageCircle className="h-5 w-5" />
                </Link>
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-blue-500 dark:bg-blue-600 text-white font-semibold">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <Link href={getDashboardLink()} className="cursor-pointer">
                      <Home className="mr-3 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/perfil" className="cursor-pointer">
                      <User className="mr-3 h-4 w-4" />
                      <span>Meu Perfil</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/perfil?tab=settings" className="cursor-pointer">
                      <Settings className="mr-3 h-4 w-4" />
                      <span>Configurações</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <ThemeToggle variant="menu-item" />

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                    <LogOut className="mr-3 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="sm"
                className="sm:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="px-4 py-3 space-y-1">
              <Link
                href={getDashboardLink()}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/perfil"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Meu Perfil
              </Link>
              <Link
                href="/chat"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Mensagens
              </Link>
              <div className="px-3 py-2">
                <ThemeToggle variant="dropdown" className="w-full justify-start" />
              </div>
              <button
                onClick={() => {
                  handleLogout()
                  setIsMobileMenuOpen(false)
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
              >
                Sair
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer Minimalista (opcional) */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>© {new Date().getFullYear()} Workemia. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

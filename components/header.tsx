"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  Search,
  Menu,
  X,
  Settings,
  LogOut,
  MessageCircle,
  Heart,
  Calendar,
  Briefcase,
  User,
  Home,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { NotificationCenter } from "@/components/notifications/notification-center"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/hooks/use-auth"
import { usePermissions } from "@/hooks/use-permissions"

// Funções auxiliares para navegação baseada em role
function getDashboardLink(role?: string): string {
  switch (role) {
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

function getServicesLink(role?: string): string {
  switch (role) {
    case 'admin':
    case 'employee':
      return '/dashboard/admin?tab=services'
    case 'provider':
      return '/dashboard/prestador?tab=services'
    case 'client':
      return '/dashboard/cliente?tab=services'
    default:
      return '/servicos'
  }
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, loading, logout } = useAuth()
  const { isAdmin, isEmployee, isProvider, isClient, getAccessibleRoutes } = usePermissions()
  const router = useRouter()

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const getDashboardLink = () => {
    if (!user) return "/login"
    return (user.type === "cliente" || user.type === "client") ? "/dashboard/cliente" : "/dashboard/prestador"
  }

  const getServicesLink = () => {
    if (!user) return "/servicos"
    return (user.type === "cliente" || user.type === "client") ? "/servicos" : "/dashboard/prestador?tab=requests"
  }

  // Loading state
  if (loading) {
    return (
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
                Service Workee
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="animate-pulse bg-gray-300 dark:bg-gray-700 rounded-full h-8 w-8"></div>
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
              Service Workee
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link 
              href="/" 
              className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-all duration-200"
            >
              🏠 Início
            </Link>
            <Link 
              href="/servicos" 
              className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-all duration-200"
            >
              🔧 Serviços
            </Link>
            <Link 
              href="/categorias" 
              className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-all duration-200"
            >
              📂 Categorias
            </Link>
            <Link 
              href="/como-funciona" 
              className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-all duration-200"
            >
              ❓ Como Funciona
            </Link>
            <Link 
              href="/seja-prestador" 
              className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-all duration-200"
            >
              💼 Seja Prestador
            </Link>
            {(isAdmin || isEmployee) && (
              <Link 
                href="/docs" 
                className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-all duration-200 flex items-center gap-1"
              >
                📚 Docs
                <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-semibold">
                  {isAdmin ? 'Admin' : 'Staff'}
                </span>
              </Link>
            )}
          </nav>

          {/* Search Bar */}
          {/* <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
              <Input type="text" placeholder="Buscar serviços..." className="pl-10 pr-4 w-full dark:bg-gray-800 dark:border-gray-700" />
            </div>
          </div> */}

          {/* User Actions */}
          <div className="flex items-center space-x-2">
            {user ? (
              <>
                {/* Theme Toggle */}
                <ThemeToggle variant="button" className="hidden sm:flex" />

                {/* Notifications */}
                <NotificationCenter />

                {/* Messages */}
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/chat" className="relative">
                    <MessageCircle className="h-5 w-5" />
                    <span className="sr-only">Mensagens</span>
                  </Link>
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
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
                        {user.service && (
                          <p className="text-xs leading-none text-blue-600 font-medium">{user.service}</p>
                        )}
                        <div className="flex items-center mt-2">
                          <div
                            className={`w-2 h-2 rounded-full mr-2 ${
                              user.role === 'admin' ? 'bg-red-500' :
                              user.role === 'employee' ? 'bg-purple-500' :
                              user.role === 'provider' ? 'bg-blue-500' :
                              user.role === 'client' ? 'bg-green-500' : 'bg-gray-500'
                            }`}
                          ></div>
                          <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                            {user.role === 'admin' ? 'Administrador' :
                             user.role === 'employee' ? 'Funcionário' :
                             user.role === 'provider' ? 'Prestador' :
                             user.role === 'client' ? 'Cliente' : 'Visitante'}
                          </span>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {/* Dashboard */}
                    <DropdownMenuItem asChild>
                      <Link href={getDashboardLink(user.role)} className="cursor-pointer">
                        <Home className="mr-3 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>

                    {/* Agenda */}
                    <DropdownMenuItem asChild>
                      <Link
                        href={
                          (user.type === "cliente" || user.type === "client")
                            ? "/dashboard/cliente?tab=active"
                            : "/dashboard/prestador?tab=schedule"
                        }
                        className="cursor-pointer"
                      >
                        <Calendar className="mr-3 h-4 w-4" />
                        <span>Agenda</span>
                      </Link>
                    </DropdownMenuItem>

                    {/* Meus Serviços */}
                    <DropdownMenuItem asChild>
                      <Link href={getServicesLink(user.role)} className="cursor-pointer">
                        <Briefcase className="mr-3 h-4 w-4" />
                        <span>
                          {user.role === 'client' ? 'Meus Serviços' : 
                           user.role === 'provider' ? 'Solicitações' :
                           'Gerenciar Serviços'}
                        </span>
                      </Link>
                    </DropdownMenuItem>

                    {/* Perfil */}
                    <DropdownMenuItem asChild>
                      <Link href="/perfil" className="cursor-pointer">
                        <User className="mr-3 h-4 w-4" />
                        <span>Meu Perfil</span>
                      </Link>
                    </DropdownMenuItem>

                    {/* Configurações */}
                    <DropdownMenuItem asChild>
                      <Link href="/perfil?tab=settings" className="cursor-pointer">
                        <Settings className="mr-3 h-4 w-4" />
                        <span>Configurações</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {/* Notificações */}
                    <DropdownMenuItem asChild>
                      <Link href="/notificacoes" className="cursor-pointer">
                        <Bell className="mr-3 h-4 w-4" />
                        <span>Notificações</span>
                      </Link>
                    </DropdownMenuItem>

                    {/* Favoritos (apenas para clientes) */}
                    {(user.type === "cliente" || user.type === "client") && (
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/cliente?tab=favorites" className="cursor-pointer">
                          <Heart className="mr-3 h-4 w-4" />
                          <span>Favoritos</span>
                        </Link>
                      </DropdownMenuItem>
                    )}

                    {/* Chat */}
                    <DropdownMenuItem asChild>
                      <Link href="/chat" className="cursor-pointer">
                        <MessageCircle className="mr-3 h-4 w-4" />
                        <span>Mensagens</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {/* Theme Toggle */}
                    <ThemeToggle variant="menu-item" />

                    <DropdownMenuSeparator />

                    {/* Logout */}
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                      <LogOut className="mr-3 h-4 w-4" />
                      <span>Sair</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                {/* Theme Toggle for non-authenticated users */}
                <ThemeToggle variant="button" />
                
                {/* Login/Register for non-authenticated users */}
                <Button variant="outline" size="sm" asChild className="hidden sm:inline-flex">
                  <Link href="/login">Entrar</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/cadastro">
                    <span className="hidden sm:inline">Cadastrar</span>
                    <span className="sm:hidden">Entrar</span>
                  </Link>
                </Button>
              </>
            )}

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={toggleMenu}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-lg">
            <div className="px-4 pt-4 pb-6 space-y-2">
              {/* Mobile Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
                <Input 
                  type="text" 
                  placeholder="Buscar serviços..." 
                  className="pl-10 pr-4 w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-primary dark:focus:border-primary" 
                />
              </div>

              <Link
                href="/"
                className="flex items-center gap-2 px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                🏠 <span>Início</span>
              </Link>
              <Link
                href="/servicos"
                className="flex items-center gap-2 px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                🔧 <span>Serviços</span>
              </Link>
              <Link
                href="/categorias"
                className="flex items-center gap-2 px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                📂 <span>Categorias</span>
              </Link>
              <Link
                href="/como-funciona"
                className="flex items-center gap-2 px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                ❓ <span>Como Funciona</span>
              </Link>
              <Link
                href="/seja-prestador"
                className="flex items-center gap-2 px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                💼 <span>Seja Prestador</span>
              </Link>
              {isAdmin && (
                <Link
                  href="/docs"
                  className="flex items-center justify-between px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="flex items-center gap-2">
                    📚 <span>Docs</span>
                    <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-semibold">Admin</span>
                  </span>
                </Link>
              )}

              {/* Mobile User Menu */}
              {user ? (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-1">
                  <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                    Logado como: <span className="font-medium text-gray-900 dark:text-gray-100">{user.name}</span>
                  </div>

                  <Link
                    href={getDashboardLink()}
                    className="flex items-center px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Home className="mr-3 h-5 w-5" />
                    Dashboard
                  </Link>

                  <Link
                    href={
                      (user.type === "cliente" || user.type === "client") 
                        ? "/dashboard/cliente?tab=active" 
                        : "/dashboard/prestador?tab=schedule"
                    }
                    className="flex items-center px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Calendar className="mr-3 h-5 w-5" />
                    Agenda
                  </Link>

                  <Link
                    href={getServicesLink()}
                    className="flex items-center px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Briefcase className="mr-3 h-5 w-5" />
                    {(user.type === "cliente" || user.type === "client") ? "Meus Serviços" : "Solicitações"}
                  </Link>

                  <Link
                    href="/chat"
                    className="flex items-center px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <MessageCircle className="mr-3 h-5 w-5" />
                    Mensagens
                  </Link>

                  <Link
                    href="/perfil"
                    className="flex items-center px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="mr-3 h-5 w-5" />
                    Meu Perfil
                  </Link>

                  <div className="px-3 py-2">
                    <ThemeToggle variant="dropdown" className="w-full justify-start" />
                  </div>

                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="flex items-center w-full px-3 py-2 text-base font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950 rounded-md transition-colors"
                  >
                    <LogOut className="mr-3 h-5 w-5" />
                    Sair
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                  <div className="px-3">
                    <ThemeToggle variant="dropdown" className="w-full justify-start" />
                  </div>
                  <Link
                    href="/login"
                    className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Entrar
                  </Link>
                  <Link
                    href="/cadastro"
                    className="block px-3 py-2 text-base font-medium text-white bg-primary hover:bg-primary/90 rounded-md mt-2 text-center transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Cadastrar
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import { isAdminEmail } from "@/lib/admin-config"
import { UserRole } from "@/types/auth"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // With Fluid compute, don't put this client in a global environment
  // variable. Always create a new one on each request.
  // Next.js mapeia ENV_NEXT_PUBLIC_* para NEXT_PUBLIC_* via next.config.mjs
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: If you remove getUser() and you use server-side rendering
  // with the Supabase client, your users may be randomly logged out.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Definir rotas públicas que não precisam de autenticação
  const publicRoutes = [
    "/",
    "/login",
    "/cadastro",
    "/auth",
    "/como-funciona",
    "/servicos",
    "/seja-prestador",
    "/dashboard/visitor",
    "/admin/login" // Login administrativo é público
  ]

  const isPublicRoute = publicRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  )

  // Se não há usuário e a rota não é pública, redirecionar para login apropriado
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone()
    // Rotas /admin/* redirecionam para /admin/login
    // Outras rotas redirecionam para /login público
    url.pathname = request.nextUrl.pathname.startsWith('/admin') ? '/admin/login' : '/login'
    return NextResponse.redirect(url)
  }

  // Se há usuário, verificar permissões baseadas em role
  if (user) {
    // IMPORTANTE: Buscar role do banco de dados (fonte da verdade)
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    // Determinar role: prioridade para banco, fallback para função getUserRole
    const userRole = profile?.role ? (profile.role as UserRole) : getUserRole(user)
    const pathname = request.nextUrl.pathname

    // PROTEÇÃO ESPECIAL: Rotas /admin/* só para admin e employee
    if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
      if (userRole !== 'admin' && userRole !== 'employee') {
        const url = request.nextUrl.clone()
        // Redirecionar usuários não-admin para seus dashboards
        url.pathname = getDashboardRoute(userRole)
        return NextResponse.redirect(url)
      }
    }

    // Verificar acesso baseado em role para dashboards
    const accessDenied = checkRoleAccess(pathname, userRole)

    if (accessDenied) {
      const url = request.nextUrl.clone()
      url.pathname = getDashboardRoute(userRole)
      return NextResponse.redirect(url)
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  return supabaseResponse
}

// Função para determinar o role do usuário
function getUserRole(user: any): UserRole {
  const isAdmin = isAdminEmail(user.email)
  
  if (isAdmin) {
    return 'admin'
  } else if (user.user_metadata?.user_type) {
    const userType = user.user_metadata.user_type
    if (userType === 'provider' || userType === 'prestador') {
      return 'provider'
    } else if (userType === 'client' || userType === 'cliente') {
      return 'client'
    } else if (userType === 'employee') {
      return 'employee'
    }
  }
  
  return 'client' // default
}

// Função para verificar acesso baseado em role
function checkRoleAccess(pathname: string, userRole: UserRole): boolean {
  // Rotas protegidas por role - cada usuário só pode acessar SEU dashboard
  const roleRoutes = {
    admin: ['/dashboard/admin'],
    employee: ['/dashboard/employee'],
    provider: ['/dashboard/prestador'],
    client: ['/dashboard/cliente'],
    visitor: ['/dashboard/visitor']
  }

  // Verificar se a rota requer um role específico
  for (const [requiredRole, routes] of Object.entries(roleRoutes)) {
    if (routes.some(route => pathname.startsWith(route))) {
      // IMPORTANTE: Cada role só pode acessar o SEU próprio dashboard
      // Admin não pode acessar dashboards de cliente/prestador
      if (userRole !== requiredRole) {
        return true // acesso negado - usuário tentando acessar dashboard de outro role
      }
    }
  }

  return false // acesso permitido
}

// Função para obter a rota do dashboard baseada no role
function getDashboardRoute(userRole: UserRole): string {
  const dashboardRoutes = {
    admin: '/dashboard/admin',
    employee: '/dashboard/employee',
    provider: '/dashboard/prestador',
    client: '/dashboard/cliente',
    visitor: '/dashboard/visitor'
  }

  return dashboardRoutes[userRole] || '/dashboard/cliente'
}

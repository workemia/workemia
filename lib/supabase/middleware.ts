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
    "/dashboard/visitor"
  ]

  const isPublicRoute = publicRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  // Se não há usuário e a rota não é pública, redirecionar para login
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  // Se há usuário, verificar permissões baseadas em role
  if (user) {
    const userRole = getUserRole(user)
    const pathname = request.nextUrl.pathname

    // Verificar acesso baseado em role
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
  // Rotas protegidas por role
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
      // Se a rota requer um role específico, verificar se o usuário tem acesso
      if (requiredRole === 'admin' && userRole !== 'admin') {
        return true // acesso negado
      }
      if (requiredRole === 'employee' && !['admin', 'employee'].includes(userRole)) {
        return true // acesso negado
      }
      if (requiredRole === 'provider' && !['admin', 'employee', 'provider'].includes(userRole)) {
        return true // acesso negado
      }
      if (requiredRole === 'client' && !['admin', 'employee', 'provider', 'client'].includes(userRole)) {
        return true // acesso negado
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

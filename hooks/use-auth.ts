"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { isAdminEmail } from "@/lib/admin-config"
import { AuthUser, UserRole, DEFAULT_PERMISSIONS } from "@/types/auth"
import type { User } from "@supabase/supabase-js"

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Buscar usuário atual
    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error || !user) {
          setUser(null)
          setLoading(false)
          return
        }

        // IMPORTANTE: Buscar role do banco de dados (tabela profiles)
        // O role do banco sempre tem prioridade sobre metadados
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, full_name, phone')
          .eq('id', user.id)
          .single()

        // Determinar role: prioridade para o banco, fallback para admin config
        let role: UserRole = 'client'

        if (profile?.role) {
          // Use role do banco de dados (fonte verdadeira)
          role = profile.role as UserRole
        } else {
          // Fallback: verificar se é admin usando configuração centralizada
          const isAdmin = isAdminEmail(user.email)
          if (isAdmin) {
            role = 'admin'
          } else if (user.user_metadata?.user_type) {
            // Converter tipos antigos para novos
            const userType = user.user_metadata.user_type
            if (userType === 'provider' || userType === 'prestador') {
              role = 'provider'
            } else if (userType === 'client' || userType === 'cliente') {
              role = 'client'
            } else if (userType === 'employee') {
              role = 'employee'
            } else if (userType === 'visitor' || userType === 'visitante') {
              role = 'visitor'
            }
          }
        }

        // Converter dados do Supabase para formato do header
        const authUser: AuthUser = {
          id: user.id,
          name: profile?.full_name || user.user_metadata?.full_name || user.user_metadata?.display_name || user.email?.split('@')[0] || 'Usuário',
          email: user.email || '',
          role,
          permissions: DEFAULT_PERMISSIONS[role],
          avatar: user.user_metadata?.avatar_url,
          service: user.user_metadata?.service,
          isAdmin: role === 'admin',
          isEmployee: role === 'employee',
          department: user.user_metadata?.department,
          level: user.user_metadata?.level
        }

        setUser(authUser)
      } catch (error) {
        console.error('Erro ao buscar usuário:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    // Listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // IMPORTANTE: Buscar role do banco de dados (tabela profiles)
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, full_name, phone')
          .eq('id', session.user.id)
          .single()

        // Determinar role: prioridade para o banco, fallback para admin config
        let role: UserRole = 'client'

        if (profile?.role) {
          // Use role do banco de dados (fonte verdadeira)
          role = profile.role as UserRole
        } else {
          // Fallback: verificar se é admin
          const isAdmin = isAdminEmail(session.user.email)
          if (isAdmin) {
            role = 'admin'
          } else if (session.user.user_metadata?.user_type) {
            const userType = session.user.user_metadata.user_type
            if (userType === 'provider' || userType === 'prestador') {
              role = 'provider'
            } else if (userType === 'client' || userType === 'cliente') {
              role = 'client'
            } else if (userType === 'employee') {
              role = 'employee'
            } else if (userType === 'visitor' || userType === 'visitante') {
              role = 'visitor'
            }
          }
        }

        const authUser: AuthUser = {
          id: session.user.id,
          name: profile?.full_name || session.user.user_metadata?.full_name || session.user.user_metadata?.display_name || session.user.email?.split('@')[0] || 'Usuário',
          email: session.user.email || '',
          role,
          permissions: DEFAULT_PERMISSIONS[role],
          avatar: session.user.user_metadata?.avatar_url,
          service: session.user.user_metadata?.service,
          isAdmin: role === 'admin',
          isEmployee: role === 'employee',
          department: session.user.user_metadata?.department,
          level: session.user.user_metadata?.level
        }
        setUser(authUser)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        throw error
      }
      setUser(null)
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
      throw error
    }
  }

  return {
    user,
    loading,
    logout,
    isAuthenticated: !!user,
    isClient: user?.role === 'client',
    isProvider: user?.role === 'provider', 
    isEmployee: user?.role === 'employee',
    isAdmin: user?.role === 'admin',
    isVisitor: user?.role === 'visitor',
    role: user?.role,
    permissions: user?.permissions
  }
}
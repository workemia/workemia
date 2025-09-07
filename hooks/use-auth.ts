"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { isAdminEmail } from "@/lib/admin-config"
import type { User } from "@supabase/supabase-js"

export interface AuthUser {
  id: string
  name: string
  email: string
  type: "client" | "provider" | "cliente" | "prestador" | "admin" // Suporte aos formatos e admin
  avatar?: string
  phone?: string
  service?: string
  isAdmin?: boolean
}

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

        // Verificar se é admin usando configuração centralizada
        const isAdmin = isAdminEmail(user.email)

        // Converter dados do Supabase para formato do header
        const authUser: AuthUser = {
          id: user.id,
          name: user.user_metadata?.full_name || user.user_metadata?.display_name || user.email?.split('@')[0] || 'Usuário',
          email: user.email || '',
          type: isAdmin ? 'admin' : (user.user_metadata?.user_type || 'client'),
          avatar: user.user_metadata?.avatar_url,
          phone: user.user_metadata?.phone,
          service: user.user_metadata?.service,
          isAdmin,
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
        const isAdmin = isAdminEmail(session.user.email)

        const authUser: AuthUser = {
          id: session.user.id,
          name: session.user.user_metadata?.full_name || session.user.user_metadata?.display_name || session.user.email?.split('@')[0] || 'Usuário',
          email: session.user.email || '',
          type: isAdmin ? 'admin' : (session.user.user_metadata?.user_type || 'client'),
          avatar: session.user.user_metadata?.avatar_url,
          phone: session.user.user_metadata?.phone,
          service: session.user.user_metadata?.service,
          isAdmin,
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
    isClient: user?.type === 'client' || user?.type === 'cliente',
    isProvider: user?.type === 'provider' || user?.type === 'prestador',
    isAdmin: user?.isAdmin || user?.type === 'admin',
  }
}
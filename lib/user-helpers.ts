import { createClient } from "@/lib/supabase/client"

export interface UserProfile {
  id: string
  email: string
  full_name: string
  display_name: string
  phone: string
  user_type: 'client' | 'provider'
  avatar_url?: string
}

// Função para obter dados do usuário atual via metadados do Supabase Auth
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  try {
    const supabase = createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return null
    }

    return {
      id: user.id,
      email: user.email || '',
      full_name: user.user_metadata?.full_name || user.user_metadata?.display_name || '',
      display_name: user.user_metadata?.display_name || user.user_metadata?.full_name || '',
      phone: user.user_metadata?.phone || '',
      user_type: user.user_metadata?.user_type || 'client',
      avatar_url: user.user_metadata?.avatar_url,
    }
  } catch (error) {
    console.error('Erro ao obter perfil do usuário:', error)
    return null
  }
}

// Função para atualizar dados do usuário
export async function updateUserProfile(updates: Partial<UserProfile>) {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.auth.updateUser({
      data: {
        full_name: updates.full_name,
        display_name: updates.display_name,
        phone: updates.phone,
        user_type: updates.user_type,
        avatar_url: updates.avatar_url,
      }
    })
    
    if (error) {
      throw error
    }
    
    return data
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error)
    throw error
  }
}

// Função para verificar se usuário é prestador
export function isProvider(user: UserProfile | null): boolean {
  return user?.user_type === 'provider'
}

// Função para verificar se usuário é cliente  
export function isClient(user: UserProfile | null): boolean {
  return user?.user_type === 'client'
}
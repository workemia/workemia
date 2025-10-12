import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * API para garantir que o profile existe após login/signup
 * Usado como fallback caso o trigger não tenha funcionado
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Verificar se profile existe
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single()

    if (existingProfile) {
      return NextResponse.json({
        success: true,
        message: 'Profile já existe'
      })
    }

    // Profile não existe - criar agora
    const userMetadata = user.user_metadata || {}
    const userType = userMetadata.user_type || 'client'

    // Determinar role
    let role: 'admin' | 'employee' | 'provider' | 'client' | 'visitor' = 'client'
    if (userType === 'provider' || userType === 'prestador') {
      role = 'provider'
    } else if (userType === 'client' || userType === 'cliente') {
      role = 'client'
    } else if (userType === 'visitor' || userType === 'visitante') {
      role = 'visitor'
    }

    // Criar profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        full_name: userMetadata.full_name || userMetadata.display_name || '',
        phone: userMetadata.phone || null,
        role: role,
        updated_at: new Date().toISOString()
      })

    if (profileError) {
      console.error('Erro ao criar profile:', profileError)
      return NextResponse.json(
        { error: 'Erro ao criar profile' },
        { status: 500 }
      )
    }

    // Se for provider, criar entrada na tabela providers
    if (role === 'provider') {
      await supabase
        .from('providers')
        .insert({
          user_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()
    }

    return NextResponse.json({
      success: true,
      message: 'Profile criado com sucesso',
      role: role
    })
  } catch (error) {
    console.error('Erro ao garantir profile:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Validar variáveis de ambiente
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({
        success: false,
        error: 'Database configuration missing'
      }, { status: 503 })
    }

    // Criar cliente apenas quando necessário
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Testar conexão básica
    console.log('Testando conexão com Supabase...')
    
    // Verificar se conseguimos listar as tabelas services
    const { data: services, error: servicesError } = await supabase
      .from('services')
      .select('*')
      .limit(1)
    
    if (servicesError) {
      console.error('Erro ao acessar tabela services:', servicesError)
      return NextResponse.json({
        success: false,
        error: 'Tabela services não encontrada',
        details: servicesError
      })
    }

    // Verificar tabela users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(1)
    
    // Verificar tabela categories
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .limit(1)

    return NextResponse.json({
      success: true,
      message: 'Conexão com Supabase OK',
      tables: {
        services: { exists: !servicesError, count: services?.length || 0 },
        users: { exists: !usersError, count: users?.length || 0 },
        categories: { exists: !categoriesError, count: categories?.length || 0 }
      }
    })

  } catch (error) {
    console.error('Erro geral:', error)
    return NextResponse.json({
      success: false,
      error: 'Erro de conexão',
      details: error
    })
  }
}
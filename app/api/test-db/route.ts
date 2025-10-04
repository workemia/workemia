import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
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
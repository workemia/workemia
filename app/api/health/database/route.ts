import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    // Validar variáveis de ambiente
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Database configuration missing',
          timestamp: new Date().toISOString(),
        },
        { status: 503 }
      )
    }

    // Criar cliente apenas quando necessário
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)

    if (error) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Database connection failed',
          error: error.message,
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      status: 'ok',
      message: 'Database connection successful',
      timestamp: new Date().toISOString(),
    }, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Database health check failed',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}

// Marcar como rota dinâmica para evitar execução durante build
export const dynamic = 'force-dynamic'
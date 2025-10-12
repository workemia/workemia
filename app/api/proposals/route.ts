import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST - Criar proposta
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

    const body = await request.json()
    const { service_id, proposed_price, description, estimated_time, start_date, materials } = body

    // Validações
    if (!service_id || !proposed_price || !description) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: service_id, proposed_price, description' },
        { status: 400 }
      )
    }

    // Buscar provider_id do usuário atual
    const { data: provider, error: providerError } = await supabase
      .from('providers')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (providerError || !provider) {
      return NextResponse.json(
        { error: 'Apenas prestadores podem enviar propostas' },
        { status: 403 }
      )
    }

    // Buscar client_id do serviço
    const { data: service, error: serviceError } = await supabase
      .from('services')
      .select('client_id')
      .eq('id', service_id)
      .single()

    if (serviceError || !service) {
      return NextResponse.json(
        { error: 'Serviço não encontrado' },
        { status: 404 }
      )
    }

    // Inserir proposta
    const { data: proposal, error: insertError } = await supabase
      .from('service_requests')
      .insert({
        service_id,
        provider_id: provider.id,
        client_id: service.client_id,
        proposed_price: parseFloat(proposed_price),
        description,
        estimated_time,
        start_date,
        materials,
        status: 'new'
      })
      .select()
      .single()

    if (insertError) {
      console.error('Erro ao criar proposta:', insertError)
      return NextResponse.json(
        { error: 'Erro ao criar proposta', details: insertError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, proposal }, { status: 201 })
  } catch (error) {
    console.error('Erro no POST /api/proposals:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// GET - Listar propostas
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const service_id = searchParams.get('service_id')

    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    let query = supabase
      .from('service_requests')
      .select(`
        *,
        services (
          id,
          title,
          description,
          budget_min,
          budget_max
        ),
        providers (
          id,
          bio,
          profession,
          rating,
          total_reviews,
          completed_jobs,
          response_time,
          user_id,
          users:user_id (
            email
          )
        )
      `)

    // Filtrar por service_id se fornecido
    if (service_id) {
      query = query.eq('service_id', service_id)
    } else {
      // Se não filtrar por serviço, mostrar apenas as do usuário
      query = query.eq('client_id', user.id)
    }

    const { data: proposals, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar propostas:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar propostas' },
        { status: 500 }
      )
    }

    return NextResponse.json({ proposals }, { status: 200 })
  } catch (error) {
    console.error('Erro no GET /api/proposals:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

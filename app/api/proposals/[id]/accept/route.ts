import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()

    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const proposalId = params.id

    // Buscar a proposta
    const { data: proposal, error: proposalError } = await supabase
      .from('service_requests')
      .select(`
        *,
        services (
          id,
          client_id,
          provider_id
        )
      `)
      .eq('id', proposalId)
      .single()

    if (proposalError || !proposal) {
      return NextResponse.json(
        { error: 'Proposta não encontrada' },
        { status: 404 }
      )
    }

    // Verificar se o usuário é o cliente dono do serviço
    if (proposal.services.client_id !== user.id) {
      return NextResponse.json(
        { error: 'Apenas o cliente pode aceitar propostas' },
        { status: 403 }
      )
    }

    // Verificar se o serviço já tem prestador atribuído
    if (proposal.services.provider_id) {
      return NextResponse.json(
        { error: 'Este serviço já tem um prestador atribuído' },
        { status: 400 }
      )
    }

    // Atualizar a proposta para "accepted"
    const { error: updateProposalError } = await supabase
      .from('service_requests')
      .update({ status: 'accepted' })
      .eq('id', proposalId)

    if (updateProposalError) {
      throw updateProposalError
    }

    // Atualizar o serviço com o provider_id e mudar status para "accepted"
    const { error: updateServiceError } = await supabase
      .from('services')
      .update({
        provider_id: proposal.provider_id,
        status: 'accepted',
        final_price: proposal.proposed_price
      })
      .eq('id', proposal.service_id)

    if (updateServiceError) {
      throw updateServiceError
    }

    // Rejeitar outras propostas do mesmo serviço
    const { error: rejectOthersError } = await supabase
      .from('service_requests')
      .update({ status: 'rejected' })
      .eq('service_id', proposal.service_id)
      .neq('id', proposalId)
      .eq('status', 'new')

    if (rejectOthersError) {
      console.error('Erro ao rejeitar outras propostas:', rejectOthersError)
      // Não bloqueia o fluxo
    }

    return NextResponse.json({
      success: true,
      message: 'Proposta aceita com sucesso'
    })
  } catch (error) {
    console.error('Erro ao aceitar proposta:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

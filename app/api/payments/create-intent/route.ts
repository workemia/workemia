import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe, STRIPE_CONFIG } from '@/lib/stripe/config'

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

    const { serviceId } = await request.json()

    // Buscar serviço com final_price
    const { data: service, error: serviceError } = await supabase
      .from('services')
      .select(`
        id,
        title,
        final_price,
        status,
        client_id,
        provider_id
      `)
      .eq('id', serviceId)
      .single()

    if (serviceError || !service) {
      return NextResponse.json(
        { error: 'Serviço não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se usuário é o cliente
    if (service.client_id !== user.id) {
      return NextResponse.json(
        { error: 'Apenas o cliente pode pagar pelo serviço' },
        { status: 403 }
      )
    }

    // Verificar se serviço foi aceito
    if (service.status !== 'accepted') {
      return NextResponse.json(
        { error: 'Serviço precisa estar aceito para pagamento' },
        { status: 400 }
      )
    }

    if (!service.final_price) {
      return NextResponse.json(
        { error: 'Serviço sem preço definido' },
        { status: 400 }
      )
    }

    // Criar Payment Intent no Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(service.final_price * 100), // centavos
      currency: STRIPE_CONFIG.currency,
      payment_method_types: ['card'],
      metadata: {
        serviceId: service.id,
        userId: user.id,
        serviceTitle: service.title,
      },
    })

    // Registrar pagamento no banco
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        service_id: service.id,
        user_id: user.id,
        amount: service.final_price,
        status: 'pending',
        payment_intent_id: paymentIntent.id,
        payment_method: 'card',
      })
      .select()
      .single()

    if (paymentError) {
      console.error('Erro ao registrar pagamento:', paymentError)
      // Não bloqueia, mas loga o erro
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentId: payment?.id,
    })
  } catch (error) {
    console.error('Erro ao criar payment intent:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

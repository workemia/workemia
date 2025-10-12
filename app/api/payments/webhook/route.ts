import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe/config'
import { createClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Assinatura ausente' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    const stripe = getStripe()
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error('Erro ao verificar webhook:', error)
    return NextResponse.json(
      { error: 'Webhook inválido' },
      { status: 400 }
    )
  }

  const supabase = await createClient()

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const serviceId = paymentIntent.metadata.serviceId

        // Atualizar pagamento
        await supabase
          .from('payments')
          .update({ status: 'completed' })
          .eq('payment_intent_id', paymentIntent.id)

        // Atualizar status do serviço para in_progress
        await supabase
          .from('services')
          .update({ status: 'in_progress' })
          .eq('id', serviceId)

        // Criar notificação para o prestador
        const { data: service } = await supabase
          .from('services')
          .select('provider_id, title')
          .eq('id', serviceId)
          .single()

        if (service?.provider_id) {
          await supabase
            .from('notifications')
            .insert({
              user_id: service.provider_id,
              title: 'Pagamento confirmado',
              message: `O pagamento do serviço "${service.title}" foi confirmado. Você pode começar o trabalho!`,
              type: 'payment',
              link: `/dashboard/prestador`,
            })
        }

        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent

        await supabase
          .from('payments')
          .update({ status: 'failed' })
          .eq('payment_intent_id', paymentIntent.id)

        break
      }

      case 'payment_intent.canceled': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent

        await supabase
          .from('payments')
          .update({ status: 'canceled' })
          .eq('payment_intent_id', paymentIntent.id)

        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Erro ao processar webhook:', error)
    return NextResponse.json(
      { error: 'Erro ao processar webhook' },
      { status: 500 }
    )
  }
}

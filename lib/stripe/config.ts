import Stripe from 'stripe'

let stripeInstance: Stripe | null = null

export function getStripe(): Stripe {
  if (!stripeInstance) {
    const secretKey = process.env.STRIPE_SECRET_KEY
    
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY não configurada')
    }
    
    stripeInstance = new Stripe(secretKey, {
      apiVersion: '2025-09-30.clover',
      typescript: true,
    })
  }
  
  return stripeInstance
}

// Exportar stripe para compatibilidade com código existente
// mas será criado sob demanda
export const getStripeConfig = () => ({
  stripe: getStripe(),
  STRIPE_CONFIG: {
    currency: 'brl',
    paymentMethods: ['card', 'boleto', 'pix'] as const,
  }
})

export const STRIPE_CONFIG = {
  currency: 'brl',
  paymentMethods: ['card', 'boleto', 'pix'] as const,
}

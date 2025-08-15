import AbacatePay from "@abacatepay/sdk"

// Configuração do Abacate Pay
const abacate = new AbacatePay({
  apiKey: process.env.ABACATE_PAY_API_KEY!,
  environment: "sandbox", // ou 'production'
})

export interface PaymentData {
  amount: number
  description: string
  customer: {
    name: string
    email: string
    phone?: string
  }
  metadata?: Record<string, any>
}

export interface PaymentResponse {
  id: string
  status: string
  amount: number
  paymentUrl: string
  pixCode?: string
  pixQrCode?: string
  boletoUrl?: string
  expiresAt: string
}

export class AbacatePayService {
  // Criar pagamento
  static async createPayment(data: PaymentData): Promise<PaymentResponse> {
    try {
      const payment = await abacate.payments.create({
        amount: Math.round(data.amount * 100), // Converter para centavos
        description: data.description,
        customer: data.customer,
        metadata: data.metadata,
        returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/pagamento/sucesso`,
        cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/pagamento/cancelado`,
      })

      return {
        id: payment.id,
        status: payment.status,
        amount: payment.amount / 100, // Converter de volta para reais
        paymentUrl: payment.paymentUrl,
        pixCode: payment.pix?.code,
        pixQrCode: payment.pix?.qrCode,
        boletoUrl: payment.boleto?.url,
        expiresAt: payment.expiresAt,
      }
    } catch (error) {
      console.error("Erro ao criar pagamento:", error)
      throw new Error("Falha ao criar pagamento")
    }
  }

  // Consultar status do pagamento
  static async getPaymentStatus(paymentId: string): Promise<PaymentResponse> {
    try {
      const payment = await abacate.payments.get(paymentId)

      return {
        id: payment.id,
        status: payment.status,
        amount: payment.amount / 100,
        paymentUrl: payment.paymentUrl,
        pixCode: payment.pix?.code,
        pixQrCode: payment.pix?.qrCode,
        boletoUrl: payment.boleto?.url,
        expiresAt: payment.expiresAt,
      }
    } catch (error) {
      console.error("Erro ao consultar pagamento:", error)
      throw new Error("Falha ao consultar pagamento")
    }
  }

  // Cancelar pagamento
  static async cancelPayment(paymentId: string): Promise<boolean> {
    try {
      await abacate.payments.cancel(paymentId)
      return true
    } catch (error) {
      console.error("Erro ao cancelar pagamento:", error)
      return false
    }
  }

  // Verificar webhook
  static verifyWebhook(payload: string, signature: string): boolean {
    try {
      return abacate.webhooks.verify(payload, signature)
    } catch (error) {
      console.error("Erro ao verificar webhook:", error)
      return false
    }
  }
}

export default AbacatePayService

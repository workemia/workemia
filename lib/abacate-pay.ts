import AbacatePay from "@abacatepay/sdk"

// Configuração do Abacate Pay
const abacate = new AbacatePay({
  apiKey: process.env.ABACATE_PAY_API_KEY!,
  environment: "sandbox", // ou 'production'
})

export interface PaymentData {
  amount: number
  description: string
  clientName: string
  clientEmail: string
  clientPhone?: string
  serviceId: string
  providerId: string
  returnUrl?: string
  webhookUrl?: string
}

export interface PaymentResponse {
  id: string
  status: "pending" | "paid" | "cancelled" | "expired"
  amount: number
  paymentUrl: string
  pixCode?: string
  pixQrCode?: string
  expiresAt: string
}

export class AbacatePayService {
  static async createPayment(data: PaymentData): Promise<PaymentResponse> {
    try {
      const payment = await abacate.billing.create({
        frequency: "one_time",
        methods: ["pix", "credit_card", "debit_card", "bank_slip"],
        products: [
          {
            externalId: data.serviceId,
            name: data.description,
            description: data.description,
            quantity: 1,
            price: Math.round(data.amount * 100), // Converter para centavos
          },
        ],
        returnUrl: data.returnUrl || `${process.env.NEXT_PUBLIC_APP_URL}/pagamento/sucesso`,
        completionUrl: data.webhookUrl || `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/abacate-pay`,
        customer: {
          name: data.clientName,
          email: data.clientEmail,
          cellphone: data.clientPhone || "",
          taxId: "", // CPF/CNPJ se necessário
        },
      })

      return {
        id: payment.id,
        status: "pending",
        amount: data.amount,
        paymentUrl: payment.url,
        pixCode: payment.pix?.code,
        pixQrCode: payment.pix?.qrCode,
        expiresAt: payment.expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      }
    } catch (error) {
      console.error("Erro ao criar pagamento:", error)
      throw new Error("Falha ao criar pagamento")
    }
  }

  static async getPaymentStatus(paymentId: string): Promise<PaymentResponse> {
    try {
      const payment = await abacate.billing.find(paymentId)

      return {
        id: payment.id,
        status: payment.status as PaymentResponse["status"],
        amount: payment.amount / 100, // Converter de centavos
        paymentUrl: payment.url,
        pixCode: payment.pix?.code,
        pixQrCode: payment.pix?.qrCode,
        expiresAt: payment.expiresAt || new Date().toISOString(),
      }
    } catch (error) {
      console.error("Erro ao consultar pagamento:", error)
      throw new Error("Falha ao consultar pagamento")
    }
  }

  static async cancelPayment(paymentId: string): Promise<boolean> {
    try {
      await abacate.billing.cancel(paymentId)
      return true
    } catch (error) {
      console.error("Erro ao cancelar pagamento:", error)
      return false
    }
  }

  static verifyWebhook(signature: string, payload: string): boolean {
    try {
      // Implementar verificação de assinatura do webhook
      // Isso depende da implementação específica do Abacate Pay
      return true
    } catch (error) {
      console.error("Erro ao verificar webhook:", error)
      return false
    }
  }
}

export default AbacatePayService

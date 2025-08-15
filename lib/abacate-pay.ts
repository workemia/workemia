import AbacatePay from "@abacatepay/sdk"

// Configuração do Abacate Pay
const abacate = new AbacatePay({
  apiKey: process.env.ABACATE_PAY_API_KEY || "abc_dev_h63dG0mBkBCeZwYm4khRjysZ",
  environment: process.env.NODE_ENV === "production" ? "production" : "sandbox",
})

export interface PaymentData {
  amount: number
  description: string
  customer: {
    name: string
    email: string
    phone?: string
    taxId?: string
  }
  metadata?: {
    serviceId: string
    providerId: string
    clientId: string
    [key: string]: any
  }
  returnUrl?: string
  cancelUrl?: string
  webhookUrl?: string
}

export interface PaymentResponse {
  id: string
  status: "pending" | "paid" | "cancelled" | "expired" | "failed"
  amount: number
  paymentUrl: string
  pixCode?: string
  pixQrCode?: string
  boletoUrl?: string
  boletoBarcode?: string
  createdAt: string
  expiresAt: string
}

export class AbacatePayService {
  /**
   * Criar um novo pagamento
   */
  static async createPayment(data: PaymentData): Promise<PaymentResponse> {
    try {
      const payment = await abacate.billing.create({
        frequency: "one_time",
        methods: ["pix", "credit_card", "debit_card", "bank_slip"],
        products: [
          {
            externalId: data.metadata?.serviceId || "service-1",
            name: data.description,
            description: data.description,
            quantity: 1,
            price: Math.round(data.amount * 100), // Converter para centavos
          },
        ],
        returnUrl: data.returnUrl || `${process.env.NEXT_PUBLIC_APP_URL}/pagamento/sucesso`,
        completionUrl: data.webhookUrl || `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/abacate-pay`,
        customer: {
          name: data.customer.name,
          email: data.customer.email,
          cellphone: data.customer.phone || "",
          taxId: data.customer.taxId || "",
        },
        metadata: data.metadata,
      })

      return {
        id: payment.id,
        status: "pending",
        amount: data.amount,
        paymentUrl: payment.url,
        pixCode: payment.pix?.code,
        pixQrCode: payment.pix?.qrCode,
        boletoUrl: payment.bankSlip?.url,
        boletoBarcode: payment.bankSlip?.barcode,
        createdAt: payment.createdAt || new Date().toISOString(),
        expiresAt: payment.expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      }
    } catch (error) {
      console.error("Erro ao criar pagamento:", error)
      throw new Error("Falha ao criar pagamento no Abacate Pay")
    }
  }

  /**
   * Consultar status de um pagamento
   */
  static async getPaymentStatus(paymentId: string): Promise<PaymentResponse> {
    try {
      const payment = await abacate.billing.find(paymentId)

      return {
        id: payment.id,
        status: payment.status as PaymentResponse["status"],
        amount: payment.amount / 100, // Converter de centavos para reais
        paymentUrl: payment.url,
        pixCode: payment.pix?.code,
        pixQrCode: payment.pix?.qrCode,
        boletoUrl: payment.bankSlip?.url,
        boletoBarcode: payment.bankSlip?.barcode,
        createdAt: payment.createdAt || new Date().toISOString(),
        expiresAt: payment.expiresAt || new Date().toISOString(),
      }
    } catch (error) {
      console.error("Erro ao consultar pagamento:", error)
      throw new Error("Falha ao consultar status do pagamento")
    }
  }

  /**
   * Cancelar um pagamento
   */
  static async cancelPayment(paymentId: string): Promise<boolean> {
    try {
      await abacate.billing.cancel(paymentId)
      return true
    } catch (error) {
      console.error("Erro ao cancelar pagamento:", error)
      return false
    }
  }

  /**
   * Verificar assinatura do webhook
   */
  static verifyWebhook(payload: string, signature: string): boolean {
    try {
      // Implementar verificação de assinatura conforme documentação do Abacate Pay
      // Por enquanto, retornamos true para desenvolvimento
      return true
    } catch (error) {
      console.error("Erro ao verificar webhook:", error)
      return false
    }
  }

  /**
   * Processar evento do webhook
   */
  static async processWebhookEvent(event: string, data: any): Promise<void> {
    try {
      switch (event) {
        case "billing.paid":
          console.log("Pagamento aprovado:", data.id)
          // Aqui você pode atualizar o status no banco de dados
          // await updateServicePaymentStatus(data.metadata.serviceId, 'paid');
          break

        case "billing.cancelled":
          console.log("Pagamento cancelado:", data.id)
          // await updateServicePaymentStatus(data.metadata.serviceId, 'cancelled');
          break

        case "billing.expired":
          console.log("Pagamento expirado:", data.id)
          // await updateServicePaymentStatus(data.metadata.serviceId, 'expired');
          break

        case "billing.failed":
          console.log("Pagamento falhou:", data.id)
          // await updateServicePaymentStatus(data.metadata.serviceId, 'failed');
          break

        default:
          console.log("Evento não tratado:", event)
      }
    } catch (error) {
      console.error("Erro ao processar evento do webhook:", error)
      throw error
    }
  }
}

export default AbacatePayService

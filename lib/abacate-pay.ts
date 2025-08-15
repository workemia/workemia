import AbacatePay from "@abacatepay/sdk"

// Configuração do Abacate Pay
const abacate = new AbacatePay({
  apiKey: process.env.ABACATE_PAY_API_KEY || "abc_dev_h63dG0mBkBCeZwYm4khRjysZ",
  environment: process.env.NODE_ENV === "production" ? "production" : "sandbox",
})

export interface PaymentData {
  amount: number
  description: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  serviceId: string
  providerId: string
  clientId: string
}

export interface PaymentResponse {
  id: string
  status: string
  paymentUrl: string
  amount: number
  description: string
  createdAt: string
}

export class AbacatePayService {
  /**
   * Criar um novo pagamento
   */
  static async createPayment(data: PaymentData): Promise<PaymentResponse> {
    try {
      const payment = await abacate.payments.create({
        amount: Math.round(data.amount * 100), // Converter para centavos
        description: data.description,
        customer: {
          name: data.customerName,
          email: data.customerEmail,
          phone: data.customerPhone,
        },
        metadata: {
          serviceId: data.serviceId,
          providerId: data.providerId,
          clientId: data.clientId,
        },
        // URL de retorno após o pagamento
        returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/pagamento/sucesso`,
        // URL de cancelamento
        cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/pagamento/cancelado`,
        // Webhook para notificações
        webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/abacate-pay`,
      })

      return {
        id: payment.id,
        status: payment.status,
        paymentUrl: payment.paymentUrl,
        amount: payment.amount / 100, // Converter de volta para reais
        description: payment.description,
        createdAt: payment.createdAt,
      }
    } catch (error) {
      console.error("Erro ao criar pagamento:", error)
      throw new Error("Falha ao processar pagamento")
    }
  }

  /**
   * Consultar status de um pagamento
   */
  static async getPaymentStatus(paymentId: string): Promise<string> {
    try {
      const payment = await abacate.payments.get(paymentId)
      return payment.status
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
      await abacate.payments.cancel(paymentId)
      return true
    } catch (error) {
      console.error("Erro ao cancelar pagamento:", error)
      return false
    }
  }

  /**
   * Processar webhook do Abacate Pay
   */
  static async processWebhook(payload: any, signature: string): Promise<void> {
    try {
      // Verificar assinatura do webhook
      const isValid = abacate.webhooks.verify(payload, signature)

      if (!isValid) {
        throw new Error("Assinatura do webhook inválida")
      }

      const { event, data } = payload

      switch (event) {
        case "payment.approved":
          await this.handlePaymentApproved(data)
          break
        case "payment.cancelled":
          await this.handlePaymentCancelled(data)
          break
        case "payment.failed":
          await this.handlePaymentFailed(data)
          break
        default:
          console.log("Evento não tratado:", event)
      }
    } catch (error) {
      console.error("Erro ao processar webhook:", error)
      throw error
    }
  }

  /**
   * Tratar pagamento aprovado
   */
  private static async handlePaymentApproved(paymentData: any): Promise<void> {
    try {
      const { id, metadata } = paymentData
      const { serviceId, providerId, clientId } = metadata

      // Atualizar status do serviço no banco de dados
      // Aqui você pode integrar com o Supabase para atualizar o status
      console.log("Pagamento aprovado:", {
        paymentId: id,
        serviceId,
        providerId,
        clientId,
      })

      // Exemplo de integração com Supabase (descomente quando necessário)
      /*
      const { supabase } = await import('./supabase')
      
      await supabase
        .from('services')
        .update({ 
          payment_status: 'paid',
          payment_id: id,
          updated_at: new Date().toISOString()
        })
        .eq('id', serviceId)
      */
    } catch (error) {
      console.error("Erro ao processar pagamento aprovado:", error)
    }
  }

  /**
   * Tratar pagamento cancelado
   */
  private static async handlePaymentCancelled(paymentData: any): Promise<void> {
    try {
      const { id, metadata } = paymentData
      const { serviceId } = metadata

      console.log("Pagamento cancelado:", {
        paymentId: id,
        serviceId,
      })

      // Atualizar status no banco de dados
      // Implementar lógica conforme necessário
    } catch (error) {
      console.error("Erro ao processar pagamento cancelado:", error)
    }
  }

  /**
   * Tratar pagamento falhado
   */
  private static async handlePaymentFailed(paymentData: any): Promise<void> {
    try {
      const { id, metadata } = paymentData
      const { serviceId } = metadata

      console.log("Pagamento falhado:", {
        paymentId: id,
        serviceId,
      })

      // Atualizar status no banco de dados
      // Implementar lógica conforme necessário
    } catch (error) {
      console.error("Erro ao processar pagamento falhado:", error)
    }
  }
}

export default abacate

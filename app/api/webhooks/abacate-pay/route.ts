import { type NextRequest, NextResponse } from "next/server"
import { AbacatePayService } from "@/lib/abacate-pay"

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get("x-abacate-signature") || ""
    const payload = await request.text()

    // Verificar assinatura do webhook
    if (!AbacatePayService.verifyWebhook(signature, payload)) {
      return NextResponse.json({ error: "Assinatura inválida" }, { status: 401 })
    }

    const webhookData = JSON.parse(payload)

    // Processar evento do webhook
    console.log("Webhook recebido:", webhookData)

    // Aqui você pode:
    // 1. Atualizar status do pagamento no banco de dados
    // 2. Enviar notificações para o cliente/prestador
    // 3. Liberar o serviço se o pagamento foi aprovado

    switch (webhookData.event) {
      case "billing.paid":
        console.log("Pagamento aprovado:", webhookData.data.id)
        // Atualizar status no banco de dados
        break

      case "billing.cancelled":
        console.log("Pagamento cancelado:", webhookData.data.id)
        // Atualizar status no banco de dados
        break

      case "billing.expired":
        console.log("Pagamento expirado:", webhookData.data.id)
        // Atualizar status no banco de dados
        break

      default:
        console.log("Evento não tratado:", webhookData.event)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Erro ao processar webhook:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

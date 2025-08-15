import { type NextRequest, NextResponse } from "next/server"
import AbacatePayService from "@/lib/abacate-pay"

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("x-abacate-signature") || ""

    // Verificar assinatura do webhook
    const isValid = AbacatePayService.verifyWebhook(body, signature)

    if (!isValid) {
      return NextResponse.json({ error: "Assinatura inválida" }, { status: 401 })
    }

    const webhookData = JSON.parse(body)
    const { event, data } = webhookData

    console.log("Webhook recebido:", event, data)

    // Processar diferentes tipos de eventos
    switch (event) {
      case "payment.paid":
        // Pagamento aprovado
        console.log("Pagamento aprovado:", data.id)
        // Aqui você pode atualizar o status no banco de dados
        // await updatePaymentStatus(data.id, 'paid');
        break

      case "payment.cancelled":
        // Pagamento cancelado
        console.log("Pagamento cancelado:", data.id)
        // await updatePaymentStatus(data.id, 'cancelled');
        break

      case "payment.expired":
        // Pagamento expirado
        console.log("Pagamento expirado:", data.id)
        // await updatePaymentStatus(data.id, 'expired');
        break

      default:
        console.log("Evento não tratado:", event)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro no webhook:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

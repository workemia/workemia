import { type NextRequest, NextResponse } from "next/server"
import { AbacatePayService } from "@/lib/abacate-pay"

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("x-abacate-signature") || ""

    // Verificar assinatura do webhook
    const isValid = AbacatePayService.verifyWebhook(body, signature)

    if (!isValid) {
      console.error("Webhook com assinatura inválida")
      return NextResponse.json(
        {
          success: false,
          error: "Assinatura do webhook inválida",
        },
        { status: 401 },
      )
    }

    const webhookData = JSON.parse(body)
    const { event, data } = webhookData

    console.log("Webhook recebido:", {
      event,
      paymentId: data?.id,
      timestamp: new Date().toISOString(),
    })

    // Processar evento do webhook
    await AbacatePayService.processWebhookEvent(event, data)

    // Log para debug
    console.log("Webhook processado com sucesso:", {
      event,
      paymentId: data?.id,
      status: data?.status,
      metadata: data?.metadata,
    })

    return NextResponse.json({
      success: true,
      message: "Webhook processado com sucesso",
      received: true,
    })
  } catch (error) {
    console.error("Erro ao processar webhook:", error)

    const errorMessage = error instanceof Error ? error.message : "Erro interno do servidor"

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { AbacatePayService } from "@/lib/abacate-pay"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { serviceId, providerId, clientId, amount, description, customer } = body

    // Validar dados obrigatórios
    if (!amount || !description || !customer?.name || !customer?.email) {
      return NextResponse.json({ error: "Dados obrigatórios não fornecidos" }, { status: 400 })
    }

    // Criar pagamento no Abacate Pay
    const payment = await AbacatePayService.createPayment({
      amount,
      description,
      customer,
      metadata: {
        serviceId,
        providerId,
        clientId,
        platform: "ServiceHub",
      },
    })

    return NextResponse.json({
      success: true,
      payment,
    })
  } catch (error) {
    console.error("Erro na API de pagamento:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

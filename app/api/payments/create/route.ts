import { type NextRequest, NextResponse } from "next/server"
import AbacatePayService from "@/lib/abacate-pay"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { serviceId, providerId, clientId, amount, description, customer } = body

    if (!amount || !description || !customer) {
      return NextResponse.json({ error: "Dados obrigatórios não fornecidos" }, { status: 400 })
    }

    const paymentData = {
      amount,
      description,
      customer,
      metadata: {
        serviceId,
        providerId,
        clientId,
        timestamp: new Date().toISOString(),
      },
    }

    const payment = await AbacatePayService.createPayment(paymentData)

    return NextResponse.json({
      success: true,
      payment,
    })
  } catch (error) {
    console.error("Erro na API de pagamento:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

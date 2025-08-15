import { type NextRequest, NextResponse } from "next/server"
import { AbacatePayService } from "@/lib/abacate-pay"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { amount, description, customerName, customerEmail, customerPhone, serviceId, providerId, clientId } = body

    // Validar dados obrigatórios
    if (!amount || !description || !customerName || !customerEmail || !serviceId) {
      return NextResponse.json({ error: "Dados obrigatórios não fornecidos" }, { status: 400 })
    }

    // Criar pagamento
    const payment = await AbacatePayService.createPayment({
      amount,
      description,
      customerName,
      customerEmail,
      customerPhone,
      serviceId,
      providerId,
      clientId,
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

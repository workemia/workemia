import { type NextRequest, NextResponse } from "next/server"
import { AbacatePayService } from "@/lib/abacate-pay"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { serviceId, providerId, amount, description, clientName, clientEmail, clientPhone } = body

    // Validação básica
    if (!serviceId || !providerId || !amount || !description || !clientName || !clientEmail) {
      return NextResponse.json({ error: "Dados obrigatórios não fornecidos" }, { status: 400 })
    }

    // Criar pagamento no Abacate Pay
    const payment = await AbacatePayService.createPayment({
      amount,
      description,
      clientName,
      clientEmail,
      clientPhone,
      serviceId,
      providerId,
      returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/pagamento/sucesso`,
      webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/abacate-pay`,
    })

    return NextResponse.json(payment)
  } catch (error) {
    console.error("Erro ao criar pagamento:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

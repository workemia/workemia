import { type NextRequest, NextResponse } from "next/server"
import { AbacatePayService } from "@/lib/abacate-pay"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { serviceId, providerId, clientId, amount, description, customer } = body

    // Validação de dados obrigatórios
    if (!serviceId || !providerId || !clientId || !amount || !description || !customer) {
      return NextResponse.json(
        {
          success: false,
          error: "Dados obrigatórios não fornecidos",
          required: ["serviceId", "providerId", "clientId", "amount", "description", "customer"],
        },
        { status: 400 },
      )
    }

    if (!customer.name || !customer.email) {
      return NextResponse.json(
        {
          success: false,
          error: "Nome e email do cliente são obrigatórios",
        },
        { status: 400 },
      )
    }

    // Validar valor mínimo
    if (amount < 1) {
      return NextResponse.json(
        {
          success: false,
          error: "Valor mínimo para pagamento é R$ 1,00",
        },
        { status: 400 },
      )
    }

    // Criar pagamento no Abacate Pay
    const payment = await AbacatePayService.createPayment({
      amount,
      description,
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        taxId: customer.taxId,
      },
      metadata: {
        serviceId,
        providerId,
        clientId,
        platform: "ServiceHub",
        timestamp: new Date().toISOString(),
      },
      returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/pagamento/sucesso?payment_id=${serviceId}&amount=${amount}&service=${encodeURIComponent(description)}`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/pagamento/cancelado?payment_id=${serviceId}&reason=${encodeURIComponent("Cancelado pelo usuário")}`,
      webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/abacate-pay`,
    })

    return NextResponse.json({
      success: true,
      payment,
      message: "Pagamento criado com sucesso",
    })
  } catch (error) {
    console.error("Erro na API de criação de pagamento:", error)

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

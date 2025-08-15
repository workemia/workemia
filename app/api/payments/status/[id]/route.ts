import { type NextRequest, NextResponse } from "next/server"
import { AbacatePayService } from "@/lib/abacate-pay"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const paymentId = params.id

    if (!paymentId) {
      return NextResponse.json({ error: "ID do pagamento não fornecido" }, { status: 400 })
    }

    const payment = await AbacatePayService.getPaymentStatus(paymentId)

    return NextResponse.json(payment)
  } catch (error) {
    console.error("Erro ao consultar pagamento:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

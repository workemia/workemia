import { type NextRequest, NextResponse } from "next/server"
import { AbacatePayService } from "@/lib/abacate-pay"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const paymentId = params.id

    if (!paymentId) {
      return NextResponse.json(
        {
          success: false,
          error: "ID do pagamento não fornecido",
        },
        { status: 400 },
      )
    }

    // Cancelar pagamento no Abacate Pay
    const cancelled = await AbacatePayService.cancelPayment(paymentId)

    if (cancelled) {
      return NextResponse.json({
        success: true,
        message: "Pagamento cancelado com sucesso",
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Não foi possível cancelar o pagamento",
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("Erro ao cancelar pagamento:", error)

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

import { type NextRequest, NextResponse } from "next/server"
import { abacatePayService } from "@/lib/abacate-pay"

export async function GET(request: NextRequest, { params }: { params: { billingId: string } }) {
  try {
    const { billingId } = params

    if (!billingId) {
      return NextResponse.json({ error: "Billing ID is required" }, { status: 400 })
    }

    const result = await abacatePayService.getBilling(billingId)

    if (result.error) {
      return NextResponse.json({ error: "Failed to get payment status", details: result.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      billing: result.data,
    })
  } catch (error) {
    console.error("Payment status check error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

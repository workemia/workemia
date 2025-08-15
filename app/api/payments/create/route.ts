import { type NextRequest, NextResponse } from "next/server"
import { abacatePayService } from "@/lib/abacate-pay"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { serviceId, amount, description, customerEmail, customerName } = body

    if (!serviceId || !amount || !description) {
      return NextResponse.json({ error: "Missing required fields: serviceId, amount, description" }, { status: 400 })
    }

    const billingRequest = {
      amount: Math.round(amount * 100), // Convert to cents
      description,
      customer: {
        email: customerEmail,
        name: customerName,
      },
      methods: ["PIX"], // Default to PIX
      frequency: "ONE_TIME" as const,
      metadata: {
        serviceId,
        source: "service_platform",
      },
    }

    const result = await abacatePayService.createBilling(billingRequest)

    if (result.error) {
      console.error("Abacate Pay error:", result.error)
      return NextResponse.json({ error: "Failed to create payment", details: result.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      billing: result.data,
      paymentUrl: result.data?.url,
    })
  } catch (error) {
    console.error("Payment creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

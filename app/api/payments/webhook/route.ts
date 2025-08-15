import { type NextRequest, NextResponse } from "next/server"
import { abacatePayService } from "@/lib/abacate-pay"

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("x-abacatepay-signature") || ""

    // Verify webhook signature (implement based on Abacate Pay docs)
    const isValid = abacatePayService.verifyWebhookSignature(
      body,
      signature,
      process.env.ABACATE_PAY_WEBHOOK_SECRET || "",
    )

    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const webhookData = JSON.parse(body)
    const { event, data } = webhookData

    console.log("[v0] Webhook received:", { event, billingId: data?.id })

    switch (event) {
      case "billing.paid":
        await handlePaymentPaid(data)
        break
      case "billing.cancelled":
        await handlePaymentCancelled(data)
        break
      case "billing.expired":
        await handlePaymentExpired(data)
        break
      default:
        console.log("[v0] Unhandled webhook event:", event)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook processing error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

async function handlePaymentPaid(billingData: any) {
  console.log("[v0] Processing paid payment:", billingData.id)

  // Here you would update your database
  // Example: Update service status, create payment record, send notifications
  const serviceId = billingData.metadata?.serviceId

  if (serviceId) {
    // Update payment status in database
    // Send notification to provider and client
    // Update service status if needed
    console.log("[v0] Payment confirmed for service:", serviceId)
  }
}

async function handlePaymentCancelled(billingData: any) {
  console.log("[v0] Processing cancelled payment:", billingData.id)
  // Handle payment cancellation
}

async function handlePaymentExpired(billingData: any) {
  console.log("[v0] Processing expired payment:", billingData.id)
  // Handle payment expiration
}

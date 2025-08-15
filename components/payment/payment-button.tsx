"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { Loader2, CreditCard, ExternalLink } from "lucide-react"

interface PaymentButtonProps {
  serviceId: string
  amount: number
  description: string
  customerEmail?: string
  customerName?: string
  onPaymentCreated?: (paymentUrl: string, billingId: string) => void
  disabled?: boolean
  className?: string
}

export function PaymentButton({
  serviceId,
  amount,
  description,
  customerEmail,
  customerName,
  onPaymentCreated,
  disabled = false,
  className = "",
}: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handlePayment = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/payments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceId,
          amount,
          description,
          customerEmail,
          customerName,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Falha ao criar pagamento")
      }

      if (data.success && data.paymentUrl) {
        toast({
          title: "Pagamento criado com sucesso!",
          description: "Você será redirecionado para completar o pagamento.",
        })

        // Call callback if provided
        if (onPaymentCreated) {
          onPaymentCreated(data.paymentUrl, data.billing.id)
        }

        // Open payment URL in new tab
        window.open(data.paymentUrl, "_blank")
      } else {
        throw new Error("Resposta inválida do servidor")
      }
    } catch (error) {
      console.error("Payment error:", error)
      toast({
        title: "Erro ao processar pagamento",
        description: error instanceof Error ? error.message : "Tente novamente mais tarde.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handlePayment} disabled={disabled || isLoading} className={`${className}`}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processando...
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-4 w-4" />
          Pagar R$ {amount.toFixed(2)}
          <ExternalLink className="ml-2 h-4 w-4" />
        </>
      )}
    </Button>
  )
}

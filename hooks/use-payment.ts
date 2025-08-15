"use client"

import { useState } from "react"
import { toast } from "@/hooks/use-toast"

interface PaymentData {
  amount: number
  description: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  serviceId: string
  providerId: string
  clientId: string
}

interface PaymentResponse {
  id: string
  status: string
  paymentUrl: string
  amount: number
  description: string
  createdAt: string
}

export function usePayment() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createPayment = async (data: PaymentData): Promise<PaymentResponse | null> => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/payments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Erro ao criar pagamento")
      }

      if (result.success) {
        toast({
          title: "Pagamento criado!",
          description: "Redirecionando para a página de pagamento...",
        })
        return result.payment
      }

      return null
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido"
      setError(errorMessage)
      toast({
        title: "Erro no pagamento",
        description: errorMessage,
        variant: "destructive",
      })
      return null
    } finally {
      setLoading(false)
    }
  }

  const getPaymentStatus = async (paymentId: string): Promise<string | null> => {
    try {
      const response = await fetch(`/api/payments/status/${paymentId}`)
      const result = await response.json()

      if (result.success) {
        return result.status
      }

      return null
    } catch (err) {
      console.error("Erro ao consultar status do pagamento:", err)
      return null
    }
  }

  return {
    createPayment,
    getPaymentStatus,
    loading,
    error,
  }
}

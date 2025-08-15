"use client"

import { useState } from "react"
import { toast } from "sonner"

interface PaymentData {
  serviceId: string
  providerId: string
  amount: number
  description: string
  clientName: string
  clientEmail: string
  clientPhone?: string
}

interface PaymentResponse {
  id: string
  status: "pending" | "paid" | "cancelled" | "expired"
  amount: number
  paymentUrl: string
  pixCode?: string
  pixQrCode?: string
  expiresAt: string
}

export function usePayment() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentData, setPaymentData] = useState<PaymentResponse | null>(null)

  const createPayment = async (data: PaymentData): Promise<PaymentResponse | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/payments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erro ao criar pagamento")
      }

      const payment: PaymentResponse = await response.json()
      setPaymentData(payment)

      toast.success("Pagamento criado com sucesso!")
      return payment
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido"
      setError(errorMessage)
      toast.error(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const checkPaymentStatus = async (paymentId: string): Promise<PaymentResponse | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/payments/status/${paymentId}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erro ao consultar pagamento")
      }

      const payment: PaymentResponse = await response.json()
      setPaymentData(payment)

      return payment
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido"
      setError(errorMessage)
      toast.error(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const resetPayment = () => {
    setPaymentData(null)
    setError(null)
    setIsLoading(false)
  }

  return {
    createPayment,
    checkPaymentStatus,
    resetPayment,
    isLoading,
    error,
    paymentData,
  }
}

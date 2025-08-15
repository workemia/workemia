"use client"

import { useState } from "react"
import { toast } from "sonner"

interface PaymentData {
  serviceId: string
  providerId: string
  clientId: string
  amount: number
  description: string
  customer: {
    name: string
    email: string
    phone?: string
  }
}

interface Payment {
  id: string
  status: string
  amount: number
  paymentUrl: string
  pixCode?: string
  pixQrCode?: string
  boletoUrl?: string
  expiresAt: string
}

export function usePayment() {
  const [payment, setPayment] = useState<Payment | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createPayment = async (data: PaymentData) => {
    setLoading(true)
    setError(null)

    try {
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

      setPayment(result.payment)
      toast.success("Pagamento criado com sucesso!")

      return result.payment
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido"
      setError(errorMessage)
      toast.error(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const checkPaymentStatus = async (paymentId: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/payments/status/${paymentId}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Erro ao consultar pagamento")
      }

      setPayment(result.payment)
      return result.payment
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido"
      setError(errorMessage)
      toast.error(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const resetPayment = () => {
    setPayment(null)
    setError(null)
  }

  return {
    payment,
    loading,
    error,
    createPayment,
    checkPaymentStatus,
    resetPayment,
  }
}

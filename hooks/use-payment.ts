"use client"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

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
    taxId?: string
  }
}

interface PaymentResponse {
  id: string
  status: "pending" | "paid" | "cancelled" | "expired" | "failed"
  amount: number
  paymentUrl: string
  pixCode?: string
  pixQrCode?: string
  boletoUrl?: string
  boletoBarcode?: string
  createdAt: string
  expiresAt: string
}

export function usePayment() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentData, setPaymentData] = useState<PaymentResponse | null>(null)
  const { toast } = useToast()

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

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Erro ao criar pagamento")
      }

      if (result.success) {
        setPaymentData(result.payment)
        toast({
          title: "Pagamento criado!",
          description: "Escolha como deseja pagar.",
        })
        return result.payment
      } else {
        throw new Error(result.error || "Erro desconhecido")
      }
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
      setIsLoading(false)
    }
  }

  const checkPaymentStatus = async (paymentId: string): Promise<PaymentResponse | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/payments/status/${paymentId}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Erro ao consultar pagamento")
      }

      if (result.success) {
        setPaymentData(result.payment)
        return result.payment
      } else {
        throw new Error(result.error || "Erro desconhecido")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido"
      setError(errorMessage)
      toast({
        title: "Erro ao consultar pagamento",
        description: errorMessage,
        variant: "destructive",
      })
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const cancelPayment = async (paymentId: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/payments/cancel/${paymentId}`, {
        method: "POST",
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Erro ao cancelar pagamento")
      }

      if (result.success) {
        toast({
          title: "Pagamento cancelado",
          description: "O pagamento foi cancelado com sucesso.",
        })
        return true
      } else {
        throw new Error(result.error || "Erro desconhecido")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido"
      setError(errorMessage)
      toast({
        title: "Erro ao cancelar pagamento",
        description: errorMessage,
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const resetPayment = () => {
    setPaymentData(null)
    setError(null)
    setIsLoading(false)
  }

  const copyPixCode = (pixCode: string) => {
    navigator.clipboard.writeText(pixCode)
    toast({
      title: "Copiado!",
      description: "Código PIX copiado para a área de transferência.",
    })
  }

  const openPaymentUrl = (paymentUrl: string) => {
    window.open(paymentUrl, "_blank")
    toast({
      title: "Redirecionando...",
      description: "Abrindo página de pagamento em nova aba.",
    })
  }

  return {
    // Estados
    isLoading,
    error,
    paymentData,

    // Ações
    createPayment,
    checkPaymentStatus,
    cancelPayment,
    resetPayment,
    copyPixCode,
    openPaymentUrl,
  }
}

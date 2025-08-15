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
  }
}

interface PaymentResponse {
  id: string
  status: string
  amount: number
  paymentUrl: string
  pixCode?: string
  pixQrCode?: string
  boletoUrl?: string
}

export function usePayment() {
  const [isLoading, setIsLoading] = useState(false)
  const [paymentData, setPaymentData] = useState<PaymentResponse | null>(null)
  const { toast } = useToast()

  const createPayment = async (data: PaymentData): Promise<PaymentResponse | null> => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/payments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        setPaymentData(result.payment)
        toast({
          title: "Pagamento criado!",
          description: "Escolha a forma de pagamento desejada.",
        })
        return result.payment
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível criar o pagamento. Tente novamente.",
        variant: "destructive",
      })
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const checkPaymentStatus = async (paymentId: string): Promise<PaymentResponse | null> => {
    try {
      const response = await fetch(`/api/payments/status/${paymentId}`)
      const result = await response.json()

      if (result.success) {
        return result.payment
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível verificar o status do pagamento.",
        variant: "destructive",
      })
      return null
    }
  }

  const openPaymentUrl = (paymentUrl: string) => {
    window.open(paymentUrl, "_blank")
    toast({
      title: "Redirecionando...",
      description: "Você será direcionado para completar o pagamento.",
    })
  }

  const copyPixCode = (pixCode: string) => {
    navigator.clipboard.writeText(pixCode)
    toast({
      title: "Copiado!",
      description: "Código PIX copiado para a área de transferência.",
    })
  }

  return {
    isLoading,
    paymentData,
    createPayment,
    checkPaymentStatus,
    openPaymentUrl,
    copyPixCode,
    setPaymentData,
  }
}

"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowLeft, Home } from "lucide-react"
import Link from "next/link"

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [paymentData, setPaymentData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const paymentId = searchParams.get("payment_id")
  const amount = searchParams.get("amount")
  const serviceTitle = searchParams.get("service")

  useEffect(() => {
    if (paymentId) {
      // Verificar status do pagamento
      fetch(`/api/payments/status/${paymentId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setPaymentData(data.payment)
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [paymentId])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-600">Pagamento Aprovado!</CardTitle>
          <CardDescription>Seu pagamento foi processado com sucesso</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {paymentData && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">ID do Pagamento:</span>
                <span className="text-sm font-mono">{paymentData.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Valor:</span>
                <span className="text-sm font-semibold">{formatPrice(paymentData.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <span className="text-sm font-semibold text-green-600">Pago</span>
              </div>
            </div>
          )}

          {serviceTitle && (
            <div className="text-center">
              <p className="text-sm text-gray-600">Serviço contratado:</p>
              <p className="font-medium">{serviceTitle}</p>
            </div>
          )}

          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/dashboard/cliente">
                <Home className="mr-2 h-4 w-4" />
                Ir para Dashboard
              </Link>
            </Button>

            <Button variant="outline" asChild className="w-full bg-transparent">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao Início
              </Link>
            </Button>
          </div>

          <div className="text-center text-xs text-gray-500 mt-6">
            <p>Você receberá um email de confirmação em breve.</p>
            <p>Em caso de dúvidas, entre em contato conosco.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  )
}

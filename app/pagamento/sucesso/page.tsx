"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Home, MessageSquare } from "lucide-react"
import Link from "next/link"

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const paymentId = searchParams.get("payment_id")
  const amount = searchParams.get("amount")
  const service = searchParams.get("service")

  const formatPrice = (price: string) => {
    const numPrice = Number.parseFloat(price)
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numPrice)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-600">Pagamento Confirmado!</CardTitle>
          <CardDescription>Seu pagamento foi processado com sucesso</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {paymentId && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">ID do Pagamento:</p>
              <p className="font-mono text-sm">{paymentId}</p>
            </div>
          )}

          {amount && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Valor Pago:</p>
              <p className="text-xl font-bold text-green-600">{formatPrice(amount)}</p>
            </div>
          )}

          {service && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Serviço:</p>
              <p className="font-medium">{decodeURIComponent(service)}</p>
            </div>
          )}

          <div className="pt-4 space-y-3">
            <p className="text-sm text-center text-gray-600">
              O prestador foi notificado e entrará em contato em breve.
            </p>

            <div className="flex flex-col space-y-2">
              <Button asChild className="w-full">
                <Link href="/chat">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Ir para o Chat
                </Link>
              </Button>

              <Button variant="outline" asChild className="w-full bg-transparent">
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Voltar ao Início
                </Link>
              </Button>
            </div>
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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  )
}

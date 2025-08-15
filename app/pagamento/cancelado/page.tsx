"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { XCircle, ArrowLeft, Home, RefreshCw } from "lucide-react"
import Link from "next/link"

function PaymentCancelledContent() {
  const searchParams = useSearchParams()
  const [paymentId, setPaymentId] = useState<string>("")
  const [reason, setReason] = useState<string>("")

  useEffect(() => {
    const id = searchParams.get("payment_id") || ""
    const cancelReason = searchParams.get("reason") || "Cancelado pelo usuário"
    setPaymentId(id)
    setReason(cancelReason)
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-600">Pagamento Cancelado</CardTitle>
          <CardDescription>O pagamento não foi processado</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {paymentId && (
            <div className="rounded-lg bg-red-50 p-4">
              <div className="text-sm">
                <p className="font-medium text-red-800">ID do Pagamento</p>
                <p className="text-red-600 font-mono">{paymentId}</p>
              </div>
              <div className="mt-2 text-sm">
                <p className="font-medium text-red-800">Motivo</p>
                <p className="text-red-600">{reason}</p>
              </div>
            </div>
          )}

          <div className="rounded-lg bg-yellow-50 p-4">
            <h3 className="font-medium text-yellow-800 mb-2">O que aconteceu?</h3>
            <ul className="text-sm text-yellow-600 space-y-1">
              <li>• O pagamento foi cancelado ou expirou</li>
              <li>• Nenhuma cobrança foi realizada</li>
              <li>• O serviço não foi confirmado</li>
            </ul>
          </div>

          <div className="rounded-lg bg-blue-50 p-4">
            <h3 className="font-medium text-blue-800 mb-2">Próximos Passos</h3>
            <ul className="text-sm text-blue-600 space-y-1">
              <li>• Você pode tentar novamente</li>
              <li>• Verifique seus dados de pagamento</li>
              <li>• Entre em contato se precisar de ajuda</li>
            </ul>
          </div>

          <div className="flex gap-2 pt-4">
            <Button asChild variant="outline" className="flex-1 bg-transparent">
              <Link href="/dashboard/cliente">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            <Button asChild className="flex-1">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Início
              </Link>
            </Button>
          </div>

          <Button asChild variant="secondary" className="w-full">
            <Link href="/servicos">
              <RefreshCw className="mr-2 h-4 w-4" />
              Tentar Novamente
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default function PaymentCancelledPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>
      }
    >
      <PaymentCancelledContent />
    </Suspense>
  )
}

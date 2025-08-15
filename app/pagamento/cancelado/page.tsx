"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { XCircle, Home, RotateCcw } from "lucide-react"
import Link from "next/link"

function PaymentCancelledContent() {
  const searchParams = useSearchParams()
  const paymentId = searchParams.get("payment_id")
  const reason = searchParams.get("reason")

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-600">Pagamento Cancelado</CardTitle>
          <CardDescription>O pagamento não foi processado</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {paymentId && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">ID do Pagamento:</p>
              <p className="font-mono text-sm">{paymentId}</p>
            </div>
          )}

          {reason && (
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <p className="text-sm text-red-600">Motivo:</p>
              <p className="text-sm">{decodeURIComponent(reason)}</p>
            </div>
          )}

          <div className="pt-4 space-y-3">
            <p className="text-sm text-center text-gray-600">
              Você pode tentar novamente ou escolher outro método de pagamento.
            </p>

            <div className="flex flex-col space-y-2">
              <Button asChild className="w-full">
                <Link href="/servicos">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Tentar Novamente
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

export default function PaymentCancelledPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      }
    >
      <PaymentCancelledContent />
    </Suspense>
  )
}

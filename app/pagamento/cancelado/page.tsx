"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { XCircle, Home, RotateCcw, ArrowLeft, AlertTriangle } from "lucide-react"
import Link from "next/link"

function PaymentCancelledContent() {
  const searchParams = useSearchParams()
  const [mounted, setMounted] = useState(false)

  const paymentId = searchParams.get("payment_id")
  const reason = searchParams.get("reason")

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-md">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-600">Pagamento Cancelado</CardTitle>
          <CardDescription className="text-gray-600">O pagamento não foi processado</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Informações do Cancelamento */}
          <div className="space-y-4">
            {paymentId && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">ID do Pagamento:</span>
                  <Badge variant="outline" className="font-mono text-xs">
                    {paymentId}
                  </Badge>
                </div>
              </div>
            )}

            {reason && (
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="space-y-1">
                  <span className="text-sm text-red-600 font-medium">Motivo do Cancelamento:</span>
                  <p className="text-sm text-red-700">{decodeURIComponent(reason)}</p>
                </div>
              </div>
            )}

            <Badge className="w-full justify-center py-2 bg-red-100 text-red-800" variant="secondary">
              Status: Cancelado
            </Badge>
          </div>

          {/* O que aconteceu */}
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-800 mb-2">O que aconteceu?</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• O pagamento foi cancelado ou expirou</li>
                  <li>• Nenhuma cobrança foi realizada</li>
                  <li>• O serviço não foi confirmado</li>
                  <li>• Seus dados estão seguros</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Próximos Passos */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-medium text-blue-800 mb-2">Próximos Passos:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Você pode tentar novamente a qualquer momento</li>
              <li>• Verifique seus dados de pagamento</li>
              <li>• Escolha outro método de pagamento</li>
              <li>• Entre em contato se precisar de ajuda</li>
            </ul>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col space-y-3">
            <Button asChild className="w-full" size="lg">
              <Link href="/servicos">
                <RotateCcw className="mr-2 h-4 w-4" />
                Tentar Novamente
              </Link>
            </Button>

            <div className="flex space-x-2">
              <Button asChild variant="outline" className="flex-1 bg-transparent">
                <Link href="/dashboard/cliente">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </Button>

              <Button asChild variant="outline" className="flex-1 bg-transparent">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Início
                </Link>
              </Button>
            </div>
          </div>

          {/* Informações de Suporte */}
          <div className="text-center text-xs text-gray-500 space-y-1">
            <p>Precisa de ajuda? Entre em contato conosco</p>
            <p>Suporte: suporte@servicehub.com</p>
            <p>WhatsApp: (11) 99999-9999</p>
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
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>
      }
    >
      <PaymentCancelledContent />
    </Suspense>
  )
}

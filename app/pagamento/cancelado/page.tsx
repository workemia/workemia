"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { XCircle, ArrowLeft, Home, RefreshCw } from "lucide-react"
import Link from "next/link"

function PaymentCancelledContent() {
  const searchParams = useSearchParams()
  const reason = searchParams.get("reason") || "Pagamento cancelado pelo usuário"

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-600">Pagamento Cancelado</CardTitle>
          <CardDescription>Seu pagamento não foi processado</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-red-800">
              <strong>Motivo:</strong> {reason}
            </p>
          </div>

          <div className="text-center text-sm text-gray-600">
            <p>Não se preocupe, nenhum valor foi cobrado.</p>
            <p>Você pode tentar novamente quando quiser.</p>
          </div>

          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/servicos">
                <RefreshCw className="mr-2 h-4 w-4" />
                Tentar Novamente
              </Link>
            </Button>

            <Button variant="outline" asChild className="w-full bg-transparent">
              <Link href="/dashboard/cliente">
                <Home className="mr-2 h-4 w-4" />
                Ir para Dashboard
              </Link>
            </Button>

            <Button variant="ghost" asChild className="w-full">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao Início
              </Link>
            </Button>
          </div>

          <div className="text-center text-xs text-gray-500 mt-6">
            <p>Precisa de ajuda? Entre em contato conosco.</p>
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
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>
      }
    >
      <PaymentCancelledContent />
    </Suspense>
  )
}

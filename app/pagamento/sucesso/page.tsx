"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowLeft, Home } from "lucide-react"
import Link from "next/link"

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const [paymentId, setPaymentId] = useState<string>("")
  const [amount, setAmount] = useState<string>("")

  useEffect(() => {
    const id = searchParams.get("payment_id") || ""
    const value = searchParams.get("amount") || ""
    setPaymentId(id)
    setAmount(value)
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-600">Pagamento Aprovado!</CardTitle>
          <CardDescription>Seu pagamento foi processado com sucesso</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {paymentId && (
            <div className="rounded-lg bg-green-50 p-4">
              <div className="text-sm">
                <p className="font-medium text-green-800">ID do Pagamento</p>
                <p className="text-green-600 font-mono">{paymentId}</p>
              </div>
              {amount && (
                <div className="mt-2 text-sm">
                  <p className="font-medium text-green-800">Valor Pago</p>
                  <p className="text-green-600">R$ {amount}</p>
                </div>
              )}
            </div>
          )}

          <div className="rounded-lg bg-blue-50 p-4">
            <h3 className="font-medium text-blue-800 mb-2">Próximos Passos</h3>
            <ul className="text-sm text-blue-600 space-y-1">
              <li>• O prestador foi notificado sobre o pagamento</li>
              <li>• Você receberá atualizações por email</li>
              <li>• O serviço será executado conforme agendado</li>
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
        </CardContent>
      </Card>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  )
}

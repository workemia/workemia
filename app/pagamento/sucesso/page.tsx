"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowLeft, MessageCircle } from "lucide-react"
import Link from "next/link"

export default function PagamentoSucesso() {
  const searchParams = useSearchParams()
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null)
  const paymentId = searchParams.get("payment_id")

  useEffect(() => {
    if (paymentId) {
      // Consultar status do pagamento
      fetch(`/api/payments/status/${paymentId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setPaymentStatus(data.status)
          }
        })
        .catch(console.error)
    }
  }, [paymentId])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-800">Pagamento Realizado!</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 text-center">
          <div className="space-y-2">
            <p className="text-gray-600">Seu pagamento foi processado com sucesso.</p>
            {paymentId && (
              <p className="text-sm text-gray-500">
                ID do Pagamento: <code className="bg-gray-100 px-2 py-1 rounded">{paymentId}</code>
              </p>
            )}
            {paymentStatus && (
              <p className="text-sm text-gray-500">
                Status: <span className="font-medium capitalize">{paymentStatus}</span>
              </p>
            )}
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Próximos Passos:</h4>
            <ul className="text-sm text-blue-700 space-y-1 text-left">
              <li>• O prestador foi notificado sobre o pagamento</li>
              <li>• Você receberá um e-mail de confirmação</li>
              <li>• O serviço será iniciado conforme acordado</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button asChild variant="outline" className="flex-1 bg-transparent">
              <Link href="/dashboard/cliente">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Dashboard
              </Link>
            </Button>
            <Button asChild className="flex-1">
              <Link href="/chat">
                <MessageCircle className="w-4 h-4 mr-2" />
                Conversar
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

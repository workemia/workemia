"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Home, MessageSquare, ArrowLeft, Clock } from "lucide-react"
import Link from "next/link"

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const [paymentStatus, setPaymentStatus] = useState<string>("pending")
  const [loading, setLoading] = useState(true)

  const paymentId = searchParams.get("payment_id")
  const amount = searchParams.get("amount")
  const service = searchParams.get("service")

  useEffect(() => {
    if (paymentId) {
      // Consultar status do pagamento
      fetch(`/api/payments/status/${paymentId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setPaymentStatus(data.payment.status)
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [paymentId])

  const formatPrice = (price: string) => {
    const numPrice = Number.parseFloat(price)
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numPrice)
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "paid":
        return {
          color: "bg-green-100 text-green-800",
          icon: CheckCircle,
          title: "Pagamento Confirmado!",
          description: "Seu pagamento foi processado com sucesso",
          bgColor: "from-green-50 to-emerald-100",
        }
      case "pending":
        return {
          color: "bg-yellow-100 text-yellow-800",
          icon: Clock,
          title: "Pagamento Pendente",
          description: "Aguardando confirmação do pagamento",
          bgColor: "from-yellow-50 to-amber-100",
        }
      default:
        return {
          color: "bg-blue-100 text-blue-800",
          icon: CheckCircle,
          title: "Pagamento Processado",
          description: "Seu pagamento está sendo processado",
          bgColor: "from-blue-50 to-cyan-100",
        }
    }
  }

  const statusInfo = getStatusInfo(paymentStatus)
  const StatusIcon = statusInfo.icon

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${statusInfo.bgColor} flex items-center justify-center p-4`}>
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-md">
            <StatusIcon className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-gray-800">{statusInfo.title}</CardTitle>
          <CardDescription className="text-gray-600">{statusInfo.description}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Informações do Pagamento */}
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

            {amount && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Valor Pago:</span>
                  <span className="text-xl font-bold text-green-600">{formatPrice(amount)}</span>
                </div>
              </div>
            )}

            {service && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-1">
                  <span className="text-sm text-gray-600">Serviço Contratado:</span>
                  <p className="font-medium text-gray-800">{decodeURIComponent(service)}</p>
                </div>
              </div>
            )}

            <Badge className={`w-full justify-center py-2 ${statusInfo.color}`} variant="secondary">
              Status: {paymentStatus === "paid" ? "Pago" : paymentStatus === "pending" ? "Pendente" : "Processando"}
            </Badge>
          </div>

          {/* Próximos Passos */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-medium text-blue-800 mb-2">Próximos Passos:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• O prestador foi notificado sobre o pagamento</li>
              <li>• Você receberá atualizações por email</li>
              <li>• O serviço será executado conforme agendado</li>
              <li>• Use o chat para se comunicar com o prestador</li>
            </ul>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col space-y-3">
            <Button asChild className="w-full" size="lg">
              <Link href="/chat">
                <MessageSquare className="mr-2 h-4 w-4" />
                Conversar com Prestador
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

          {/* Informações Adicionais */}
          <div className="text-center text-xs text-gray-500 space-y-1">
            <p>Pagamento processado com segurança pelo Abacate Pay</p>
            <p>Em caso de dúvidas, entre em contato conosco</p>
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

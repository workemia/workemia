"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PaymentButton } from "@/components/payment/payment-button"
import { PaymentStatus } from "@/components/payment/payment-status"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Shield, Clock, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"

// Mock service data - replace with actual API call
const mockService = {
  id: "1",
  title: "Serviço de Pintura Residencial",
  description: "Pintura completa de casa com 3 quartos",
  amount: 850.0,
  provider: {
    name: "João Silva",
    rating: 4.9,
  },
  client: {
    name: "Maria Santos",
    email: "maria.santos@email.com",
  },
}

export default function PaymentPage() {
  const params = useParams()
  const router = useRouter()
  const serviceId = params.serviceId as string

  const [billingId, setBillingId] = useState<string | null>(null)
  const [paymentCreated, setPaymentCreated] = useState(false)

  const handlePaymentCreated = (paymentUrl: string, newBillingId: string) => {
    setBillingId(newBillingId)
    setPaymentCreated(true)
  }

  const handleStatusChange = (status: string) => {
    if (status === "PAID") {
      // Redirect to success page or dashboard after a delay
      setTimeout(() => {
        router.push("/dashboard/cliente?payment=success")
      }, 3000)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pagamento do Serviço</h1>
          <p className="text-gray-600">Complete o pagamento para confirmar o serviço</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Service Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Detalhes do Serviço
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{mockService.title}</h3>
                <p className="text-gray-600 mt-1">{mockService.description}</p>
              </div>

              <div className="flex items-center justify-between py-2 border-t">
                <span className="text-gray-600">Prestador:</span>
                <div className="text-right">
                  <div className="font-medium">{mockService.provider.name}</div>
                  <div className="flex items-center text-sm text-yellow-600">
                    <i className="fas fa-star mr-1"></i>
                    {mockService.provider.rating}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between py-2 border-t">
                <span className="text-gray-600">Cliente:</span>
                <div className="font-medium">{mockService.client.name}</div>
              </div>

              <div className="flex items-center justify-between py-2 border-t font-semibold text-lg">
                <span>Total:</span>
                <span className="text-green-600">R$ {mockService.amount.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Section */}
          <div className="space-y-6">
            {!paymentCreated ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Pagamento Seguro
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-800 mb-2">
                      <Shield className="h-4 w-4" />
                      <span className="font-medium">Pagamento 100% Seguro</span>
                    </div>
                    <p className="text-blue-700 text-sm">
                      Seus dados estão protegidos e o pagamento é processado de forma segura pelo Abacate Pay.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        PIX
                      </Badge>
                      <span className="text-sm text-gray-600">Aprovação instantânea</span>
                    </div>
                  </div>

                  <PaymentButton
                    serviceId={serviceId}
                    amount={mockService.amount}
                    description={mockService.title}
                    customerEmail={mockService.client.email}
                    customerName={mockService.client.name}
                    onPaymentCreated={handlePaymentCreated}
                    className="w-full"
                  />

                  <p className="text-xs text-gray-500 text-center">
                    Ao clicar em "Pagar", você será redirecionado para completar o pagamento de forma segura.
                  </p>
                </CardContent>
              </Card>
            ) : (
              billingId && <PaymentStatus billingId={billingId} onStatusChange={handleStatusChange} />
            )}

            {/* Security Info */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>O pagamento será confirmado automaticamente</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 mt-2">
                  <Shield className="h-4 w-4" />
                  <span>Transação protegida por criptografia SSL</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

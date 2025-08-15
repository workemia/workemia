"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { usePayment } from "@/hooks/use-payment"
import { CreditCard, Smartphone, FileText, Loader2, CheckCircle, XCircle } from "lucide-react"

interface Service {
  id: string
  title: string
  provider: string
  providerId: string
  price: number
  description: string
}

interface Client {
  id: string
  name: string
  email: string
  phone?: string
}

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  service: Service
  client: Client
}

export function PaymentModal({ isOpen, onClose, service, client }: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>("")
  const { createPayment, isLoading, error, paymentData } = usePayment()

  const paymentMethods = [
    {
      id: "pix",
      name: "PIX",
      description: "Pagamento instantâneo",
      icon: Smartphone,
      badge: "Instantâneo",
    },
    {
      id: "credit_card",
      name: "Cartão de Crédito",
      description: "Visa, Mastercard, Elo",
      icon: CreditCard,
      badge: "Parcelado",
    },
    {
      id: "debit_card",
      name: "Cartão de Débito",
      description: "Débito à vista",
      icon: CreditCard,
      badge: "À vista",
    },
    {
      id: "bank_slip",
      name: "Boleto Bancário",
      description: "Vencimento em 3 dias",
      icon: FileText,
      badge: "3 dias",
    },
  ]

  const handlePayment = async () => {
    try {
      const payment = await createPayment({
        serviceId: service.id,
        providerId: service.providerId,
        amount: service.price,
        description: `${service.title} - ${service.provider}`,
        clientName: client.name,
        clientEmail: client.email,
        clientPhone: client.phone,
      })

      if (payment?.paymentUrl) {
        // Redirecionar para a página de pagamento
        window.open(payment.paymentUrl, "_blank")
      }
    } catch (err) {
      console.error("Erro ao processar pagamento:", err)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Finalizar Pagamento</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Resumo do Serviço */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{service.title}</CardTitle>
              <CardDescription>Prestador: {service.provider}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="text-2xl font-bold">R$ {service.price.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Métodos de Pagamento */}
          <div className="space-y-3">
            <h3 className="font-medium">Escolha a forma de pagamento</h3>

            {paymentMethods.map((method) => {
              const Icon = method.icon
              return (
                <Card
                  key={method.id}
                  className={`cursor-pointer transition-colors ${
                    selectedMethod === method.id ? "ring-2 ring-primary bg-primary/5" : "hover:bg-muted/50"
                  }`}
                  onClick={() => setSelectedMethod(method.id)}
                >
                  <CardContent className="flex items-center gap-3 p-3">
                    <Icon className="h-5 w-5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{method.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {method.badge}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{method.description}</p>
                    </div>
                    {selectedMethod === method.id && <CheckCircle className="h-5 w-5 text-primary" />}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Status do Pagamento */}
          {paymentData && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  {paymentData.status === "pending" && (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />
                      <span className="text-sm">Aguardando pagamento...</span>
                    </>
                  )}
                  {paymentData.status === "paid" && (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600">Pagamento aprovado!</span>
                    </>
                  )}
                  {paymentData.status === "cancelled" && (
                    <>
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span className="text-sm text-red-600">Pagamento cancelado</span>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Erro */}
          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-600">{error}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Botões */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent" disabled={isLoading}>
              Cancelar
            </Button>
            <Button onClick={handlePayment} className="flex-1" disabled={!selectedMethod || isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                "Pagar Agora"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

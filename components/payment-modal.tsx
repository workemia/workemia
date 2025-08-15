"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Smartphone, FileText, Building2, X, Copy, Check } from "lucide-react"
import { usePayment } from "@/hooks/use-payment"

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
  const [copied, setCopied] = useState(false)
  const { createPayment, payment, loading, error } = usePayment()

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
      description: "Parcelado em até 12x",
      icon: CreditCard,
      badge: "Parcelado",
    },
    {
      id: "boleto",
      name: "Boleto Bancário",
      description: "Vencimento em 3 dias",
      icon: FileText,
      badge: "3 dias",
    },
    {
      id: "bank_transfer",
      name: "Transferência",
      description: "TED/DOC bancário",
      icon: Building2,
      badge: "1-2 dias",
    },
  ]

  const handlePayment = async () => {
    if (!selectedMethod) return

    await createPayment({
      serviceId: service.id,
      providerId: service.providerId,
      clientId: client.id,
      amount: service.price,
      description: `${service.title} - ${service.provider}`,
      customer: {
        name: client.name,
        email: client.email,
        phone: client.phone,
      },
    })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Pagamento do Serviço
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
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
                <span className="text-sm text-muted-foreground">Total:</span>
                <span className="text-xl font-bold text-green-600">{formatPrice(service.price)}</span>
              </div>
            </CardContent>
          </Card>

          {!payment ? (
            <>
              {/* Métodos de Pagamento */}
              <div className="space-y-3">
                <h3 className="font-medium">Escolha o método de pagamento:</h3>
                {paymentMethods.map((method) => {
                  const Icon = method.icon
                  return (
                    <Card
                      key={method.id}
                      className={`cursor-pointer transition-colors ${
                        selectedMethod === method.id ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedMethod(method.id)}
                    >
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center space-x-3">
                          <Icon className="h-5 w-5 text-gray-600" />
                          <div>
                            <p className="font-medium">{method.name}</p>
                            <p className="text-sm text-muted-foreground">{method.description}</p>
                          </div>
                        </div>
                        <Badge variant="secondary">{method.badge}</Badge>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <Button onClick={handlePayment} disabled={!selectedMethod || loading} className="w-full">
                {loading ? "Processando..." : "Confirmar Pagamento"}
              </Button>
            </>
          ) : (
            /* Dados do Pagamento */
            <div className="space-y-4">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-medium text-lg">Pagamento Criado!</h3>
                <p className="text-sm text-muted-foreground">ID: {payment.id}</p>
              </div>

              {payment.pixCode && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">PIX Copia e Cola</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      <code className="flex-1 p-2 bg-gray-100 rounded text-xs break-all">{payment.pixCode}</code>
                      <Button size="sm" variant="outline" onClick={() => copyToClipboard(payment.pixCode!)}>
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {payment.pixQrCode && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">QR Code PIX</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <img src={payment.pixQrCode || "/placeholder.svg"} alt="QR Code PIX" className="mx-auto max-w-48" />
                  </CardContent>
                </Card>
              )}

              {payment.boletoUrl && (
                <Button onClick={() => window.open(payment.boletoUrl, "_blank")} className="w-full">
                  Visualizar Boleto
                </Button>
              )}

              <Button onClick={() => window.open(payment.paymentUrl, "_blank")} variant="outline" className="w-full">
                Abrir Página de Pagamento
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

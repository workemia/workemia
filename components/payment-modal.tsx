"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { CreditCard, Smartphone, FileText, Building2, Loader2 } from "lucide-react"

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
  const [isLoading, setIsLoading] = useState(false)
  const [paymentData, setPaymentData] = useState<any>(null)
  const [selectedMethod, setSelectedMethod] = useState<string>("")
  const { toast } = useToast()

  const paymentMethods = [
    { id: "pix", name: "PIX", icon: Smartphone, description: "Pagamento instantâneo" },
    { id: "credit_card", name: "Cartão de Crédito", icon: CreditCard, description: "Parcelamento disponível" },
    { id: "debit_card", name: "Cartão de Débito", icon: CreditCard, description: "Débito à vista" },
    { id: "boleto", name: "Boleto", icon: FileText, description: "Vencimento em 3 dias" },
    { id: "bank_transfer", name: "Transferência", icon: Building2, description: "TED/DOC" },
  ]

  const handleCreatePayment = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/payments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
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
        }),
      })

      const data = await response.json()

      if (data.success) {
        setPaymentData(data.payment)
        toast({
          title: "Pagamento criado!",
          description: "Escolha a forma de pagamento desejada.",
        })
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível criar o pagamento. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePaymentMethod = (method: string) => {
    setSelectedMethod(method)

    if (paymentData) {
      // Redirecionar para a URL de pagamento do Abacate Pay
      window.open(paymentData.paymentUrl, "_blank")

      toast({
        title: "Redirecionando...",
        description: "Você será direcionado para completar o pagamento.",
      })
    }
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
          <DialogTitle>Pagamento do Serviço</DialogTitle>
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
                <span className="text-sm text-muted-foreground">Valor total:</span>
                <span className="text-xl font-bold text-green-600">{formatPrice(service.price)}</span>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Dados do Cliente */}
          <div className="space-y-2">
            <h4 className="font-medium">Dados do pagador:</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>
                <strong>Nome:</strong> {client.name}
              </p>
              <p>
                <strong>Email:</strong> {client.email}
              </p>
              {client.phone && (
                <p>
                  <strong>Telefone:</strong> {client.phone}
                </p>
              )}
            </div>
          </div>

          <Separator />

          {/* Botão para criar pagamento */}
          {!paymentData && (
            <Button onClick={handleCreatePayment} disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando pagamento...
                </>
              ) : (
                "Criar Pagamento"
              )}
            </Button>
          )}

          {/* Métodos de Pagamento */}
          {paymentData && (
            <div className="space-y-3">
              <h4 className="font-medium">Escolha a forma de pagamento:</h4>

              <div className="grid gap-2">
                {paymentMethods.map((method) => {
                  const Icon = method.icon
                  return (
                    <Button
                      key={method.id}
                      variant="outline"
                      className="justify-start h-auto p-3 bg-transparent"
                      onClick={() => handlePaymentMethod(method.id)}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      <div className="text-left">
                        <div className="font-medium">{method.name}</div>
                        <div className="text-xs text-muted-foreground">{method.description}</div>
                      </div>
                    </Button>
                  )
                })}
              </div>

              {/* Informações do PIX */}
              {paymentData.pixCode && (
                <Card className="mt-4">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center">
                      <Smartphone className="mr-2 h-4 w-4" />
                      PIX Copia e Cola
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted p-2 rounded text-xs font-mono break-all">{paymentData.pixCode}</div>
                    <Button
                      size="sm"
                      className="mt-2 w-full"
                      onClick={() => {
                        navigator.clipboard.writeText(paymentData.pixCode)
                        toast({
                          title: "Copiado!",
                          description: "Código PIX copiado para a área de transferência.",
                        })
                      }}
                    >
                      Copiar Código PIX
                    </Button>
                  </CardContent>
                </Card>
              )}

              <div className="text-xs text-muted-foreground text-center">
                Pagamento seguro processado pelo Abacate Pay
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

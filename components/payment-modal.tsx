"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { CreditCard, Smartphone, FileText, Loader2, CheckCircle, XCircle, Copy, ExternalLink, X } from "lucide-react"

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
  const [isLoading, setIsLoading] = useState(false)
  const [paymentData, setPaymentData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const paymentMethods = [
    {
      id: "pix",
      name: "PIX",
      description: "Pagamento instantâneo",
      icon: Smartphone,
      badge: "Instantâneo",
      color: "bg-green-100 text-green-800",
    },
    {
      id: "credit_card",
      name: "Cartão de Crédito",
      description: "Parcelado em até 12x",
      icon: CreditCard,
      badge: "Parcelado",
      color: "bg-blue-100 text-blue-800",
    },
    {
      id: "debit_card",
      name: "Cartão de Débito",
      description: "Débito à vista",
      icon: CreditCard,
      badge: "À vista",
      color: "bg-purple-100 text-purple-800",
    },
    {
      id: "bank_slip",
      name: "Boleto Bancário",
      description: "Vencimento em 3 dias",
      icon: FileText,
      badge: "3 dias",
      color: "bg-orange-100 text-orange-800",
    },
  ]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  const handleCreatePayment = async () => {
    if (!selectedMethod) {
      toast({
        title: "Método não selecionado",
        description: "Por favor, selecione um método de pagamento.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setError(null)

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
          description: "Escolha como deseja pagar.",
        })
      } else {
        throw new Error(data.error || "Erro ao criar pagamento")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido"
      setError(errorMessage)
      toast({
        title: "Erro no pagamento",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast({
      title: "Copiado!",
      description: "Código PIX copiado para a área de transferência.",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  const openPaymentUrl = () => {
    if (paymentData?.paymentUrl) {
      window.open(paymentData.paymentUrl, "_blank")
      toast({
        title: "Redirecionando...",
        description: "Abrindo página de pagamento em nova aba.",
      })
    }
  }

  const resetModal = () => {
    setSelectedMethod("")
    setPaymentData(null)
    setError(null)
    setIsLoading(false)
    setCopied(false)
  }

  const handleClose = () => {
    resetModal()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Pagamento do Serviço</span>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Resumo do Serviço */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{service.title}</CardTitle>
              <CardDescription>Prestador: {service.provider}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Valor total:</span>
                <span className="text-2xl font-bold text-green-600">{formatPrice(service.price)}</span>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {!paymentData ? (
            <>
              {/* Seleção de Método de Pagamento */}
              <div className="space-y-4">
                <h3 className="font-medium">Escolha o método de pagamento:</h3>

                <div className="grid gap-3">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon
                    const isSelected = selectedMethod === method.id

                    return (
                      <Card
                        key={method.id}
                        className={`cursor-pointer transition-all duration-200 ${
                          isSelected
                            ? "ring-2 ring-blue-500 bg-blue-50 border-blue-200"
                            : "hover:bg-gray-50 hover:border-gray-300"
                        }`}
                        onClick={() => setSelectedMethod(method.id)}
                      >
                        <CardContent className="flex items-center justify-between p-4">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-full ${method.color}`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-medium">{method.name}</p>
                              <p className="text-sm text-muted-foreground">{method.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="text-xs">
                              {method.badge}
                            </Badge>
                            {isSelected && <CheckCircle className="h-5 w-5 text-blue-500" />}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>

              {/* Erro */}
              {error && (
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <XCircle className="h-5 w-5 text-red-500" />
                      <span className="text-sm text-red-600">{error}</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Botão de Criar Pagamento */}
              <Button
                onClick={handleCreatePayment}
                disabled={!selectedMethod || isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando pagamento...
                  </>
                ) : (
                  "Criar Pagamento"
                )}
              </Button>
            </>
          ) : (
            /* Dados do Pagamento Criado */
            <div className="space-y-4">
              {/* Status */}
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">Pagamento Criado!</p>
                      <p className="text-sm text-green-600">ID: {paymentData.id}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* PIX Code */}
              {paymentData.pixCode && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center">
                      <Smartphone className="mr-2 h-4 w-4" />
                      PIX Copia e Cola
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <code className="text-xs break-all font-mono">{paymentData.pixCode}</code>
                    </div>
                    <Button
                      onClick={() => copyToClipboard(paymentData.pixCode)}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      {copied ? (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Copiado!
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-4 w-4" />
                          Copiar Código PIX
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* QR Code PIX */}
              {paymentData.pixQrCode && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">QR Code PIX</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <img
                      src={paymentData.pixQrCode || "/placeholder.svg"}
                      alt="QR Code PIX"
                      className="mx-auto max-w-48 border rounded-lg"
                    />
                  </CardContent>
                </Card>
              )}

              {/* Boleto */}
              {paymentData.boletoUrl && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center">
                      <FileText className="mr-2 h-4 w-4" />
                      Boleto Bancário
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => window.open(paymentData.boletoUrl, "_blank")}
                      variant="outline"
                      className="w-full"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Visualizar Boleto
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Botão Principal */}
              <Button onClick={openPaymentUrl} className="w-full" size="lg">
                <ExternalLink className="mr-2 h-4 w-4" />
                Abrir Página de Pagamento
              </Button>

              {/* Informações */}
              <div className="text-center text-xs text-muted-foreground space-y-1">
                <p>• Pagamento seguro processado pelo Abacate Pay</p>
                <p>• Você será notificado quando o pagamento for confirmado</p>
                <p>• Em caso de dúvidas, entre em contato conosco</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

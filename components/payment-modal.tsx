"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { CreditCard, DollarSign, Shield, Clock } from "lucide-react"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  service: {
    id: string
    title: string
    provider: string
    providerId: string
    price: number
    description: string
  }
  client: {
    id: string
    name: string
    email: string
    phone?: string
  }
}

export function PaymentModal({ isOpen, onClose, service, client }: PaymentModalProps) {
  const [loading, setLoading] = useState(false)
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null)

  const handlePayment = async () => {
    try {
      setLoading(true)

      const response = await fetch("/api/payments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: service.price,
          description: `Pagamento do serviço: ${service.title}`,
          customerName: client.name,
          customerEmail: client.email,
          customerPhone: client.phone,
          serviceId: service.id,
          providerId: service.providerId,
          clientId: client.id,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setPaymentUrl(data.payment.paymentUrl)
        toast({
          title: "Pagamento criado!",
          description: "Redirecionando para a página de pagamento...",
        })

        // Redirecionar para a URL de pagamento
        setTimeout(() => {
          window.open(data.payment.paymentUrl, "_blank")
        }, 1000)
      } else {
        throw new Error(data.error || "Erro ao criar pagamento")
      }
    } catch (error) {
      console.error("Erro:", error)
      toast({
        title: "Erro no pagamento",
        description: "Não foi possível processar o pagamento. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Pagamento do Serviço
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Resumo do Serviço */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{service.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Prestador:</span>
                <span className="font-medium">{service.provider}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Valor:</span>
                <span className="text-2xl font-bold text-green-600">R$ {service.price.toFixed(2)}</span>
              </div>
              <Separator />
              <p className="text-sm text-gray-600">{service.description}</p>
            </CardContent>
          </Card>

          {/* Informações de Segurança */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Pagamento Seguro</span>
            </div>
            <p className="text-xs text-blue-700">
              Processado pelo Abacate Pay com criptografia SSL e proteção de dados.
            </p>
          </div>

          {/* Métodos de Pagamento */}
          <div className="space-y-3">
            <h4 className="font-medium">Métodos de Pagamento Disponíveis:</h4>
            <div className="grid grid-cols-2 gap-2">
              <Badge variant="outline" className="justify-center py-2">
                PIX
              </Badge>
              <Badge variant="outline" className="justify-center py-2">
                Cartão
              </Badge>
              <Badge variant="outline" className="justify-center py-2">
                Boleto
              </Badge>
              <Badge variant="outline" className="justify-center py-2">
                Transferência
              </Badge>
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent" disabled={loading}>
              Cancelar
            </Button>
            <Button onClick={handlePayment} className="flex-1 bg-green-600 hover:bg-green-700" disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Pagar Agora
                </div>
              )}
            </Button>
          </div>

          {/* Informações Adicionais */}
          <div className="text-xs text-gray-500 space-y-1">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Processamento instantâneo para PIX</span>
            </div>
            <p>• Você receberá um e-mail de confirmação após o pagamento</p>
            <p>• O prestador será notificado automaticamente</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

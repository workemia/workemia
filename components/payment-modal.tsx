"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import { CreditCard, Loader2 } from "lucide-react"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { getStripeClient } from "@/lib/stripe/client"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  serviceId: string
  serviceTitle: string
  amount: number
  onSuccess?: () => void
}

function CheckoutForm({
  serviceId,
  amount,
  onSuccess,
  onClose,
}: {
  serviceId: string
  amount: number
  onSuccess?: () => void
  onClose: () => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/dashboard/cliente?payment=success`,
        },
      })

      if (error) {
        toast({
          title: "Erro no pagamento",
          description: error.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Pagamento realizado!",
          description: "O prestador será notificado para iniciar o serviço.",
        })
        onSuccess?.()
        onClose()
      }
    } catch (error) {
      console.error("Erro ao processar pagamento:", error)
      toast({
        title: "Erro",
        description: "Não foi possível processar o pagamento",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-600">Valor a pagar</p>
        <p className="text-3xl font-bold text-gray-900">
          R$ {amount.toFixed(2)}
        </p>
      </div>

      <PaymentElement />

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isProcessing}
          className="flex-1"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={!stripe || isProcessing}
          className="flex-1"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processando...
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4 mr-2" />
              Pagar R$ {amount.toFixed(2)}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}

export function PaymentModal({
  isOpen,
  onClose,
  serviceId,
  serviceTitle,
  amount,
  onSuccess,
}: PaymentModalProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleOpen = async (open: boolean) => {
    if (open && !clientSecret) {
      setIsLoading(true)
      try {
        const response = await fetch("/api/payments/create-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ serviceId }),
        })

        if (!response.ok) {
          throw new Error("Erro ao criar intenção de pagamento")
        }

        const data = await response.json()
        setClientSecret(data.clientSecret)
      } catch (error) {
        console.error("Erro ao iniciar pagamento:", error)
        toast({
          title: "Erro",
          description: "Não foi possível iniciar o pagamento",
          variant: "destructive",
        })
        onClose()
      } finally {
        setIsLoading(false)
      }
    } else if (!open) {
      onClose()
    }
  }

  const stripePromise = getStripeClient()

  return (
    <Dialog open={isOpen} onOpenChange={handleOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Pagamento do Serviço</DialogTitle>
          <DialogDescription>
            {serviceTitle}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : clientSecret ? (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: "stripe",
              },
            }}
          >
            <CheckoutForm
              serviceId={serviceId}
              amount={amount}
              onSuccess={onSuccess}
              onClose={onClose}
            />
          </Elements>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

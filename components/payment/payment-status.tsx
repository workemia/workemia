"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, XCircle, AlertTriangle, RefreshCw } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface PaymentStatusProps {
  billingId: string
  onStatusChange?: (status: string) => void
  autoRefresh?: boolean
  refreshInterval?: number
}

const statusConfig = {
  PENDING: {
    icon: Clock,
    color: "bg-yellow-100 text-yellow-800",
    label: "Pendente",
  },
  PAID: {
    icon: CheckCircle,
    color: "bg-green-100 text-green-800",
    label: "Pago",
  },
  CANCELLED: {
    icon: XCircle,
    color: "bg-red-100 text-red-800",
    label: "Cancelado",
  },
  EXPIRED: {
    icon: AlertTriangle,
    color: "bg-gray-100 text-gray-800",
    label: "Expirado",
  },
}

export function PaymentStatus({
  billingId,
  onStatusChange,
  autoRefresh = true,
  refreshInterval = 5000,
}: PaymentStatusProps) {
  const [status, setStatus] = useState<string>("PENDING")
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const checkPaymentStatus = async () => {
    if (!billingId) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/payments/status/${billingId}`)
      const data = await response.json()

      if (response.ok && data.success) {
        const newStatus = data.billing.status
        if (newStatus !== status) {
          setStatus(newStatus)
          setLastUpdated(new Date())

          if (onStatusChange) {
            onStatusChange(newStatus)
          }

          // Show toast for status changes
          if (newStatus === "PAID") {
            toast({
              title: "Pagamento confirmado!",
              description: "Seu pagamento foi processado com sucesso.",
            })
          } else if (newStatus === "CANCELLED") {
            toast({
              title: "Pagamento cancelado",
              description: "O pagamento foi cancelado.",
              variant: "destructive",
            })
          }
        }
      }
    } catch (error) {
      console.error("Error checking payment status:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Initial check
    checkPaymentStatus()

    // Set up auto-refresh if enabled and payment is still pending
    if (autoRefresh && status === "PENDING") {
      const interval = setInterval(checkPaymentStatus, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [billingId, autoRefresh, refreshInterval, status])

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING
  const Icon = config.icon

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Status do Pagamento</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon className="h-5 w-5" />
            <Badge className={config.color}>{config.label}</Badge>
          </div>
          <Button variant="outline" size="sm" onClick={checkPaymentStatus} disabled={isLoading}>
            {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          </Button>
        </div>

        <div className="text-sm text-gray-500">Última atualização: {lastUpdated.toLocaleTimeString("pt-BR")}</div>

        {status === "PENDING" && (
          <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
            <p>💡 Aguardando confirmação do pagamento. O status será atualizado automaticamente.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import { DollarSign, Clock, Calendar, Wrench } from "lucide-react"

interface ProposalModalProps {
  isOpen: boolean
  onClose: () => void
  serviceId: string
  serviceTitle: string
  serviceBudget?: { min: number; max: number }
  onSuccess?: () => void
}

export function ProposalModal({
  isOpen,
  onClose,
  serviceId,
  serviceTitle,
  serviceBudget,
  onSuccess,
}: ProposalModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    proposed_price: serviceBudget?.min || "",
    description: "",
    estimated_time: "",
    start_date: "",
    materials: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/proposals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service_id: serviceId,
          ...formData,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao enviar proposta")
      }

      toast({
        title: "Proposta enviada!",
        description: "O cliente receberá sua proposta e poderá aceitá-la.",
      })

      // Reset form
      setFormData({
        proposed_price: "",
        description: "",
        estimated_time: "",
        start_date: "",
        materials: "",
      })

      onSuccess?.()
      onClose()
    } catch (error) {
      console.error("Erro ao enviar proposta:", error)
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao enviar proposta",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Enviar Proposta</DialogTitle>
          <DialogDescription>
            Serviço: <span className="font-semibold">{serviceTitle}</span>
            {serviceBudget && (
              <span className="block text-sm text-gray-600 mt-1">
                Orçamento sugerido: R$ {serviceBudget.min} - R$ {serviceBudget.max}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Preço Proposto */}
          <div className="space-y-2">
            <Label htmlFor="proposed_price" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Valor da Proposta (R$) *
            </Label>
            <Input
              id="proposed_price"
              type="number"
              step="0.01"
              min="0"
              placeholder="150.00"
              value={formData.proposed_price}
              onChange={(e) =>
                setFormData({ ...formData, proposed_price: e.target.value })
              }
              required
            />
            <p className="text-xs text-gray-500">
              Informe um valor justo e competitivo
            </p>
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Descrição da Proposta *
            </Label>
            <Textarea
              id="description"
              placeholder="Descreva como você realizará o serviço, sua experiência e diferenciais..."
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
          </div>

          {/* Tempo Estimado */}
          <div className="space-y-2">
            <Label htmlFor="estimated_time" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Tempo Estimado
            </Label>
            <Input
              id="estimated_time"
              type="text"
              placeholder="Ex: 2-3 horas, 1 dia, 1 semana"
              value={formData.estimated_time}
              onChange={(e) =>
                setFormData({ ...formData, estimated_time: e.target.value })
              }
            />
          </div>

          {/* Data de Início */}
          <div className="space-y-2">
            <Label htmlFor="start_date" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Disponível a partir de
            </Label>
            <Input
              id="start_date"
              type="date"
              value={formData.start_date}
              onChange={(e) =>
                setFormData({ ...formData, start_date: e.target.value })
              }
            />
          </div>

          {/* Materiais */}
          <div className="space-y-2">
            <Label htmlFor="materials" className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Materiais e Equipamentos
            </Label>
            <Textarea
              id="materials"
              placeholder="Liste materiais necessários, se aplicável (opcional)"
              rows={3}
              value={formData.materials}
              onChange={(e) =>
                setFormData({ ...formData, materials: e.target.value })
              }
            />
            <p className="text-xs text-gray-500">
              Informe se o valor inclui materiais ou se serão cobrados à parte
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Enviar Proposta"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

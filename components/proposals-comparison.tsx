"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import { DollarSign, Clock, Calendar, Star, CheckCircle, User, Wrench } from "lucide-react"

interface Proposal {
  id: string
  proposed_price: number
  description: string
  estimated_time?: string
  start_date?: string
  materials?: string
  status: string
  created_at: string
  providers: {
    id: string
    profession?: string
    rating: number
    total_reviews: number
    completed_jobs: number
    response_time?: string
    users?: {
      email: string
    }
  }
}

interface ProposalsComparisonProps {
  serviceId: string
  serviceTitle: string
  proposals: Proposal[]
  onAccept?: (proposalId: string) => void
  onReject?: (proposalId: string) => void
}

export function ProposalsComparison({
  serviceId,
  serviceTitle,
  proposals,
  onAccept,
  onReject,
}: ProposalsComparisonProps) {
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const sortedProposals = [...proposals].sort((a, b) => a.proposed_price - b.proposed_price)

  const getBestValue = () => {
    if (proposals.length === 0) return null
    return sortedProposals[0]
  }

  const getHighestRated = () => {
    if (proposals.length === 0) return null
    return [...proposals].sort((a, b) => b.providers.rating - a.providers.rating)[0]
  }

  const getMostExperienced = () => {
    if (proposals.length === 0) return null
    return [...proposals].sort((a, b) => b.providers.completed_jobs - a.providers.completed_jobs)[0]
  }

  const bestValue = getBestValue()
  const highestRated = getHighestRated()
  const mostExperienced = getMostExperienced()

  const handleAcceptProposal = async (proposalId: string) => {
    if (!confirm("Tem certeza que deseja aceitar esta proposta?")) return

    setIsProcessing(true)
    try {
      const response = await fetch(`/api/proposals/${proposalId}/accept`, {
        method: "PATCH",
      })

      if (!response.ok) {
        throw new Error("Erro ao aceitar proposta")
      }

      toast({
        title: "Proposta aceita!",
        description: "O prestador foi notificado e o serviço foi iniciado.",
      })

      onAccept?.(proposalId)
      setShowDetailsModal(false)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível aceitar a proposta. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (proposals.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma proposta recebida ainda
            </h3>
            <p className="text-gray-600">
              Aguarde! Prestadores qualificados enviarão propostas em breve.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Comparar Propostas ({proposals.length})</CardTitle>
          <CardDescription>
            Serviço: <span className="font-semibold">{serviceTitle}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Destaques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {bestValue && (
              <div className="border rounded-lg p-4 bg-green-50">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <h4 className="font-semibold text-green-900">Melhor Preço</h4>
                </div>
                <p className="text-2xl font-bold text-green-700">
                  R$ {bestValue.proposed_price.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {bestValue.providers.users?.email}
                </p>
              </div>
            )}

            {highestRated && (
              <div className="border rounded-lg p-4 bg-yellow-50">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-5 w-5 text-yellow-600" />
                  <h4 className="font-semibold text-yellow-900">Melhor Avaliado</h4>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-yellow-700">
                    {highestRated.providers.rating.toFixed(1)}
                  </p>
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {highestRated.providers.total_reviews} avaliações
                </p>
              </div>
            )}

            {mostExperienced && (
              <div className="border rounded-lg p-4 bg-blue-50">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-900">Mais Experiente</h4>
                </div>
                <p className="text-2xl font-bold text-blue-700">
                  {mostExperienced.providers.completed_jobs}
                </p>
                <p className="text-sm text-gray-600 mt-1">trabalhos concluídos</p>
              </div>
            )}
          </div>

          {/* Lista de Propostas */}
          <div className="space-y-4">
            {sortedProposals.map((proposal) => (
              <div
                key={proposal.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-blue-500 text-white">
                        {proposal.providers.users?.email?.charAt(0).toUpperCase() || "P"}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-gray-900">
                          {proposal.providers.profession || "Prestador"}
                        </h4>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">
                            {proposal.providers.rating.toFixed(1)}
                          </span>
                          <span className="text-sm text-gray-500">
                            ({proposal.providers.total_reviews})
                          </span>
                        </div>
                        {proposal.id === bestValue?.id && (
                          <Badge className="bg-green-100 text-green-800">Melhor Preço</Badge>
                        )}
                        {proposal.id === highestRated?.id && (
                          <Badge className="bg-yellow-100 text-yellow-800">Melhor Avaliado</Badge>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {proposal.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-4 w-4" />
                          <span>{proposal.providers.completed_jobs} trabalhos</span>
                        </div>
                        {proposal.estimated_time && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{proposal.estimated_time}</span>
                          </div>
                        )}
                        {proposal.start_date && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              Início: {new Date(proposal.start_date).toLocaleDateString("pt-BR")}
                            </span>
                          </div>
                        )}
                        {proposal.providers.response_time && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>Responde em {proposal.providers.response_time}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right ml-4">
                    <p className="text-2xl font-bold text-gray-900">
                      R$ {proposal.proposed_price.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedProposal(proposal)
                          setShowDetailsModal(true)
                        }}
                      >
                        Ver Detalhes
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleAcceptProposal(proposal.id)}
                        disabled={isProcessing}
                      >
                        Aceitar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal de Detalhes */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Proposta</DialogTitle>
            <DialogDescription>
              {selectedProposal?.providers.profession || "Prestador"}
            </DialogDescription>
          </DialogHeader>

          {selectedProposal && (
            <div className="space-y-6">
              {/* Informações do Prestador */}
              <div>
                <h4 className="font-semibold mb-3">Sobre o Prestador</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{selectedProposal.providers.rating.toFixed(1)}</span>
                    <span className="text-gray-500">
                      ({selectedProposal.providers.total_reviews} avaliações)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>{selectedProposal.providers.completed_jobs} trabalhos concluídos</span>
                  </div>
                  {selectedProposal.providers.response_time && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>Tempo de resposta: {selectedProposal.providers.response_time}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Detalhes da Proposta */}
              <div>
                <h4 className="font-semibold mb-3">Detalhes da Proposta</h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Valor</p>
                    <p className="text-2xl font-bold text-gray-900">
                      R$ {selectedProposal.proposed_price.toFixed(2)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">Descrição</p>
                    <p className="text-gray-700">{selectedProposal.description}</p>
                  </div>

                  {selectedProposal.estimated_time && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Tempo Estimado</p>
                      <p className="text-gray-700">{selectedProposal.estimated_time}</p>
                    </div>
                  )}

                  {selectedProposal.start_date && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Data de Início</p>
                      <p className="text-gray-700">
                        {new Date(selectedProposal.start_date).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  )}

                  {selectedProposal.materials && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                        <Wrench className="h-4 w-4" />
                        Materiais e Equipamentos
                      </p>
                      <p className="text-gray-700 whitespace-pre-wrap">{selectedProposal.materials}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowDetailsModal(false)}
                >
                  Voltar
                </Button>
                <Button
                  onClick={() => handleAcceptProposal(selectedProposal.id)}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processando..." : "Aceitar Proposta"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

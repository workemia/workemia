"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ProposalsComparison } from "@/components/proposals-comparison"
import { PaymentModal } from "@/components/payment-modal"
import { ArrowLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function ProposalsPage() {
  const router = useRouter()
  const params = useParams()
  const serviceId = params.serviceId as string

  const [service, setService] = useState<any>(null)
  const [proposals, setProposals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [acceptedProposal, setAcceptedProposal] = useState<any>(null)

  useEffect(() => {
    if (serviceId) {
      fetchData()
    }
  }, [serviceId])

  async function fetchData() {
    try {
      setLoading(true)
      const supabase = createClient()

      // Buscar serviço
      const { data: serviceData, error: serviceError } = await supabase
        .from('services')
        .select('*')
        .eq('id', serviceId)
        .single()

      if (serviceError) {
        console.error('Erro ao buscar serviço:', serviceError)
      } else {
        setService(serviceData)
      }

      // Buscar propostas usando a API
      const response = await fetch(`/api/proposals?service_id=${serviceId}`)
      const data = await response.json()

      if (response.ok) {
        setProposals(data.proposals || [])
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando propostas...</p>
        </div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Serviço não encontrado</h2>
          <Button onClick={() => router.push('/dashboard/cliente')}>
            Voltar ao Dashboard
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard/cliente')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Propostas Recebidas</h1>
          <p className="text-gray-600">Compare e escolha o melhor prestador para seu serviço</p>
        </div>

        <ProposalsComparison
          serviceId={serviceId}
          serviceTitle={service.title}
          proposals={proposals}
          onAccept={(proposalId) => {
            fetchData()
            // Buscar proposta aceita e abrir modal de pagamento
            const proposal = proposals.find(p => p.id === proposalId)
            if (proposal) {
              setAcceptedProposal(proposal)
              setShowPaymentModal(true)
            }
          }}
        />

        {acceptedProposal && (
          <PaymentModal
            isOpen={showPaymentModal}
            onClose={() => {
              setShowPaymentModal(false)
              setAcceptedProposal(null)
            }}
            serviceId={serviceId}
            serviceTitle={service.title}
            amount={acceptedProposal.proposed_price}
            onSuccess={() => {
              setTimeout(() => {
                router.push('/dashboard/cliente')
              }, 1000)
            }}
          />
        )}
      </div>
    </div>
  )
}

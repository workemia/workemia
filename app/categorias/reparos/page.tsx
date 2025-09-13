"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function ReparosPage() {
  const router = useRouter()

  const servicos = [
    {
      nome: "Reparos Hidráulicos",
      descricao: "Conserto de vazamentos, torneiras e instalações hidráulicas",
      preco: "A partir de R$ 60",
      duracao: "1-3 horas"
    },
    {
      nome: "Reparos Elétricos", 
      descricao: "Instalação e reparo de sistemas elétricos residenciais",
      preco: "A partir de R$ 80",
      duracao: "2-4 horas"
    },
    {
      nome: "Reparos Gerais",
      descricao: "Móveis, portas, fechaduras e pequenos reparos domésticos",
      preco: "A partir de R$ 50",
      duracao: "1-2 horas"
    }
  ]

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <img src="/animated/home/reparos.gif" alt="Reparos" className="w-24 h-24" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Serviços de Reparos</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Profissionais especializados para resolver seus problemas de casa
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {servicos.map((servico, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{servico.nome}</h3>
              <p className="text-gray-600 mb-4">{servico.descricao}</p>
              <div className="space-y-2 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-500">Preço:</span>
                  <span className="font-semibold text-green-600">{servico.preco}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Duração:</span>
                  <span className="text-gray-900">{servico.duracao}</span>
                </div>
              </div>
              <Button 
                onClick={() => router.push('/solicitar-servico?categoria=reparos')}
                className="w-full"
              >
                Solicitar Serviço
              </Button>
            </div>
          ))}
        </div>

        <div className="bg-green-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Emergência 24h</h2>
          <p className="text-gray-600 mb-6">
            Para reparos urgentes, nossos profissionais estão disponíveis 24 horas
          </p>
          <Button 
            onClick={() => router.push('/solicitar-servico?categoria=reparos&urgente=true')}
            size="lg"
            className="bg-red-600 hover:bg-red-700"
          >
            Solicitar Reparo Urgente
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  )
}
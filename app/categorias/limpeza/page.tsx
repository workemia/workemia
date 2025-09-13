"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function LimpezaPage() {
  const router = useRouter()

  const servicos = [
    {
      nome: "Limpeza Residencial",
      descricao: "Limpeza completa da sua casa com produtos profissionais",
      preco: "A partir de R$ 80",
      duracao: "2-4 horas"
    },
    {
      nome: "Limpeza Comercial", 
      descricao: "Limpeza de escritórios e estabelecimentos comerciais",
      preco: "A partir de R$ 120",
      duracao: "3-6 horas"
    },
    {
      nome: "Limpeza Pós-Obra",
      descricao: "Limpeza especializada após reformas e construções",
      preco: "A partir de R$ 200",
      duracao: "4-8 horas"
    }
  ]

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <img src="/animated/home/limpeza.gif" alt="Limpeza" className="w-24 h-24" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Serviços de Limpeza</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Encontre profissionais qualificados para deixar seu ambiente impecável
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
                onClick={() => router.push('/solicitar-servico?categoria=limpeza')}
                className="w-full"
              >
                Solicitar Serviço
              </Button>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Precisa de um Serviço Personalizado?</h2>
          <p className="text-gray-600 mb-6">
            Descreva suas necessidades específicas e receba propostas personalizadas
          </p>
          <Button 
            onClick={() => router.push('/solicitar-servico?categoria=limpeza')}
            size="lg"
          >
            Solicitar Orçamento Personalizado
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  )
}
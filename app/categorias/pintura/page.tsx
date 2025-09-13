"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function PinturaPage() {
  const router = useRouter()

  const servicos = [
    {
      nome: "Pintura Residencial",
      descricao: "Pintura interna e externa de casas e apartamentos",
      preco: "A partir de R$ 15/m²",
      duracao: "2-5 dias"
    },
    {
      nome: "Pintura Comercial", 
      descricao: "Pintura de escritórios, lojas e estabelecimentos comerciais",
      preco: "A partir de R$ 18/m²",
      duracao: "3-7 dias"
    },
    {
      nome: "Pintura Decorativa",
      descricao: "Técnicas especiais, texturas e acabamentos personalizados",
      preco: "A partir de R$ 25/m²",
      duracao: "3-10 dias"
    }
  ]

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <img src="/animated/home/pintura.gif" alt="Pintura" className="w-24 h-24" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Serviços de Pintura</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transforme seu ambiente com pintores profissionais e materiais de qualidade
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
                onClick={() => router.push('/solicitar-servico?categoria=pintura')}
                className="w-full"
              >
                Solicitar Serviço
              </Button>
            </div>
          ))}
        </div>

        <div className="bg-yellow-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Consultoria de Cores Gratuita</h2>
          <p className="text-gray-600 mb-6">
            Nossos profissionais ajudam você a escolher as cores perfeitas para seu ambiente
          </p>
          <Button 
            onClick={() => router.push('/solicitar-servico?categoria=pintura&consultoria=true')}
            size="lg"
          >
            Solicitar Consultoria
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  )
}
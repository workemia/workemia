"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function TecnicoPage() {
  const router = useRouter()

  const servicos = [
    {
      nome: "Suporte Técnico em TI",
      descricao: "Instalação e manutenção de computadores e redes",
      preco: "A partir de R$ 80",
      duracao: "1-3 horas"
    },
    {
      nome: "Instalação de Eletrodomésticos", 
      descricao: "Instalação e configuração de ar-condicionado, TV, som",
      preco: "A partir de R$ 60",
      duracao: "1-2 horas"
    },
    {
      nome: "Manutenção de Equipamentos",
      descricao: "Reparo de eletrodomésticos e equipamentos eletrônicos",
      preco: "A partir de R$ 100",
      duracao: "2-4 horas"
    }
  ]

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <img src="/animated/home/tecnico.gif" alt="Técnico" className="w-24 h-24" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Serviços Técnicos</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Técnicos especializados para resolver problemas tecnológicos e eletrônicos
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
                onClick={() => router.push('/solicitar-servico?categoria=tecnico')}
                className="w-full"
              >
                Solicitar Serviço
              </Button>
            </div>
          ))}
        </div>

        <div className="bg-purple-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Diagnóstico Gratuito</h2>
          <p className="text-gray-600 mb-6">
            Nossos técnicos fazem uma avaliação inicial sem custo para você
          </p>
          <Button 
            onClick={() => router.push('/solicitar-servico?categoria=tecnico&diagnostico=true')}
            size="lg"
          >
            Solicitar Diagnóstico
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  )
}
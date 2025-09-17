"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function EducacaoPage() {
  const router = useRouter()

  const servicos = [
    {
      nome: "Aulas Particulares",
      descricao: "Reforço escolar em matemática, português, inglês e outras matérias",
      preco: "A partir de R$ 50/hora",
      duracao: "1-2 horas por aula"
    },
    {
      nome: "Preparação para Vestibular", 
      descricao: "Aulas focadas em ENEM, vestibulares e concursos públicos",
      preco: "A partir de R$ 70/hora",
      duracao: "1.5-3 horas por aula"
    },
    {
      nome: "Idiomas",
      descricao: "Aulas de inglês, espanhol, francês e outros idiomas",
      preco: "A partir de R$ 60/hora",
      duracao: "1-1.5 horas por aula"
    }
  ]

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex justify-center mb-4 sm:mb-6">
            <img src="/animated/home/educacao.gif" alt="Educação" className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Serviços de Educação</h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-xl sm:max-w-2xl mx-auto">
            Professores qualificados para impulsionar seu aprendizado
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
          {servicos.map((servico, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">{servico.nome}</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">{servico.descricao}</p>
              <div className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
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
                onClick={() => router.push('/solicitar-servico?categoria=educacao')}
                className="w-full h-10 sm:h-9 min-h-[40px] sm:min-h-[36px]"
              >
                Solicitar Serviço
              </Button>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 rounded-lg p-4 sm:p-6 lg:p-8 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Aula Experimental Gratuita</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
            Conheça nossa metodologia com uma aula gratuita antes de contratar
          </p>
          <Button 
            onClick={() => router.push('/solicitar-servico?categoria=educacao&experimental=true')}
            size="lg"
            className="h-12 min-h-[48px] px-6 sm:px-8"
          >
            Solicitar Aula Experimental
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  )
}
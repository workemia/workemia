"use client"

import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { InteractiveMap } from "@/components/interactive-map"
import { Button } from "@/components/ui/button"
import { useStats } from "@/hooks/use-stats"
import { useScrollToSection } from "@/hooks/use-scroll"
import { ChevronDown } from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  const { stats, loading } = useStats()
  const { scrollToSection } = useScrollToSection()

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  const handleScrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  // Função para mapear nomes das categorias para nomes dos arquivos GIF
  const getGifFileName = (categoryName: string) => {
    const nameMap: { [key: string]: string } = {
      'técnico': 'tecnico',
      'educação': 'educacao',
      'limpeza': 'limpeza',
      'reparos': 'reparos',
      'pintura': 'pintura',
      'beleza': 'beleza'
    }
    return nameMap[categoryName.toLowerCase()] || categoryName.toLowerCase()
  }

  const categories = [
    {
      name: "Limpeza",
      description: "Serviços de limpeza residencial e comercial",
      icon: "fas fa-broom",
      color: "text-blue-500",
    },
    {
      name: "Reparos",
      description: "Reparos gerais e manutenção",
      icon: "fas fa-wrench",
      color: "text-green-500",
    },
    {
      name: "Pintura",
      description: "Pintura residencial e comercial",
      icon: "fas fa-paint-roller",
      color: "text-yellow-500",
    },
    {
      name: "Técnico",
      description: "Serviços técnicos especializados",
      icon: "fas fa-laptop",
      color: "text-purple-500",
    },
    {
      name: "Beleza",
      description: "Serviços de beleza e estética",
      icon: "fas fa-cut",
      color: "text-pink-500",
    },
    {
      name: "Educação",
      description: "Aulas particulares e educação",
      icon: "fas fa-graduation-cap",
      color: "text-blue-600",
    },
  ]

  return (
    <div className="min-h-screen">
      <Header />

      <main>
        {/* Hero Section */}
        <section id="inicio" className="min-h-screen bg-cover bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 text-white relative">
          <div className="flex flex-col items-center justify-center max-w-4xl mx-auto text-center h-full px-4 py-8 sm:py-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 md:mb-12 leading-tight">
              Encontre o serviço perfeito perto de você
            </h1>
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-xl sm:max-w-2xl mx-auto leading-relaxed opacity-90">
              Conecte-se com prestadores de serviços qualificados na sua região. Desde limpeza doméstica até reparos técnicos.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 justify-center mb-8 sm:mb-12 w-full max-w-md sm:max-w-none mx-auto">
              <Button
                onClick={() => handleNavigation("/servicos")}
                className="bg-white text-blue-600 hover:bg-gray-100 px-6 sm:px-8 py-3 text-base sm:text-lg h-12 sm:h-14 font-semibold w-full sm:w-auto min-h-[48px] active:bg-gray-200 transition-all"
              >
                <i className="fas fa-search mr-2"></i>
                Buscar Serviços
              </Button>
              <Button
                onClick={() => handleNavigation("/solicitar-servico")}
                className="bg-white text-blue-600 hover:bg-gray-100 px-6 sm:px-8 py-3 text-base sm:text-lg h-12 sm:h-14 font-semibold w-full sm:w-auto min-h-[48px] active:bg-gray-200 transition-all"
              >
                Solicitar Serviço
              </Button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 w-full max-w-4xl">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">
                  {loading ? "..." : stats.totalUsers.toLocaleString()}
                </div>
                <div className="text-xs sm:text-sm md:text-base opacity-80">Usuários Ativos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">
                  {loading ? "..." : stats.totalProviders.toLocaleString()}
                </div>
                <div className="text-xs sm:text-sm md:text-base opacity-80">Prestadores</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">
                  {loading ? "..." : stats.completedServices.toLocaleString()}
                </div>
                <div className="text-xs sm:text-sm md:text-base opacity-80">Serviços Concluídos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">
                  {loading ? "..." : (stats.averageRating || 4.9).toFixed(1)}
                </div>
                <div className="text-xs sm:text-sm md:text-base opacity-80">Avaliação Média</div>
              </div>
            </div>
            
            {/* Botão para scroll para próxima seção */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => scrollToSection('categorias')}
                className="text-white hover:text-white hover:bg-white/10 animate-bounce"
              >
                <ChevronDown className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section id="categorias" className="py-12 sm:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Categorias Populares</h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600">Explore os serviços mais procurados na sua região</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {categories.map((category) => (
                <div
                  key={category.name}
                  onClick={() => handleNavigation(`/servicos?categoria=${category.name.toLowerCase()}`)}
                  className="text-center p-4 sm:p-6 rounded-lg hover:shadow-lg transition-all cursor-pointer hover:bg-gray-50 group active:bg-gray-100 min-h-[140px] sm:min-h-[160px] flex flex-col justify-center"
                >
                  <div className="mb-4 group-hover:scale-110 transition-transform flex justify-center">
                    <img 
                      src={`/animated/home/${getGifFileName(category.name)}.gif`} 
                      alt={category.name} 
                      className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20"
                    />
                  </div>
                  <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-gray-900 mb-1 sm:mb-2">{category.name}</h3>
                  <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed">{category.description}</p>
                </div>
              ))}
            </div>
            
            {/* Botão para próxima seção */}
            {/* <div className="text-center mt-12">
              <Button
                variant="outline"
                onClick={() => scrollToSection('como-funciona')}
                className="flex items-center gap-2"
              >
                Ver Como Funciona
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div> */}
          </div>
        </section>

        {/* Interactive Map Section */}
        {/*Colocar esse interactive em uma sessão e usar um id  paara   scroll até aqui*/}
        <section id="servicos" className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <InteractiveMap />
          </div>
        </section>

        {/* How It Works Section */}
        <section id="como-funciona" className="py-12 sm:py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Como Funciona</h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600">Processo simples em 4 etapas</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              <div className="text-center">
                <div className="bg-blue-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <i className="fas fa-edit text-lg sm:text-lg sm:text-2xl text-blue-600"></i>
                </div>
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">Descreva o Serviço</h3>
                <p className="text-sm sm:text-base text-gray-600">Conte-nos o que você precisa e onde</p>
              </div>

              <div className="text-center">
                <div className="bg-blue-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <i className="fas fa-envelope text-lg sm:text-2xl text-blue-600"></i>
                </div>
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">Receba Propostas</h3>
                <p className="text-sm sm:text-base text-gray-600">Prestadores qualificados enviam orçamentos</p>
              </div>

              <div className="text-center">
                <div className="bg-blue-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <i className="fas fa-check-circle text-lg sm:text-2xl text-blue-600"></i>
                </div>
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">Escolha o Melhor</h3>
                <p className="text-sm sm:text-base text-gray-600">Compare propostas e escolha o prestador</p>
              </div>

              <div className="text-center">
                <div className="bg-blue-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <i className="fas fa-thumbs-up text-lg sm:text-2xl text-blue-600"></i>
                </div>
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">Serviço Realizado</h3>
                <p className="text-sm sm:text-base text-gray-600">Acompanhe o progresso e avalie</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8">Junte-se a milhares de clientes satisfeitos</h2>
            <Button
              onClick={() => handleNavigation("/servicos")}
              className="bg-white text-blue-600 hover:bg-gray-100 px-6 sm:px-8 py-3 text-base sm:text-lg h-12 sm:h-14 font-semibold min-h-[48px] active:bg-gray-200 transition-all"
            >
              <i className="fas fa-rocket mr-2"></i>
              Solicitar Serviço Agora
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

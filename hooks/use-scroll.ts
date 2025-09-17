"use client"

import { useRouter } from "next/navigation"

export function useScrollToSection() {
  const router = useRouter()

  const scrollToSection = (sectionId: string, customOffset?: number) => {
    const scrollToElement = () => {
      const element = document.getElementById(sectionId)
      if (element) {
        // Definir offset específico por seção
        let headerOffset = 100
        
        switch (sectionId) {
          case 'inicio':
            headerOffset = 10 // Para o início, ir para o topo
            break
          case 'categorias':
            headerOffset = 65 // Mais espaço para categorias
            break
          case 'como-funciona':
            headerOffset = 65
            break
          default:
            headerOffset = customOffset || 100
        }
        
        const elementPosition = element.offsetTop - headerOffset
        
        window.scrollTo({
          top: Math.max(0, elementPosition),
          behavior: 'smooth'
        })
      }
    }

    // Verificar se estamos na homepage
    if (typeof window !== 'undefined' && window.location.pathname !== '/') {
      // Se não estamos na homepage, navegar primeiro para ela
      router.push('/')
      // Aguardar um pouco para a página carregar antes de fazer scroll
      setTimeout(scrollToElement, 300)
    } else {
      // Se já estamos na homepage, fazer scroll diretamente
      scrollToElement()
    }
  }

  return { scrollToSection }
}
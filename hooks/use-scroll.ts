"use client"

import { useRouter } from "next/navigation"

export function useScrollToSection() {
  const router = useRouter()

  const scrollToSection = (sectionId: string, headerOffset: number = 80) => {
    const scrollToElement = () => {
      const element = document.getElementById(sectionId)
      if (element) {
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
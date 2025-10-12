"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

interface PublicLayoutProps {
  children: React.ReactNode
}

/**
 * Layout para páginas públicas (não autenticadas)
 *
 * Inclui:
 * - Header completo com navbar marketing
 * - Footer completo com links, redes sociais, etc
 *
 * Usado em:
 * - Homepage (/)
 * - Como funciona (/como-funciona)
 * - Seja prestador (/seja-prestador)
 * - Serviços (/servicos)
 * - Categorias (/categorias/*)
 */
export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}

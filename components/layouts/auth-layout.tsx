"use client"

import Link from "next/link"

interface AuthLayoutProps {
  children: React.ReactNode
}

/**
 * Layout para páginas de autenticação (login/cadastro)
 *
 * Inclui:
 * - Apenas logo no topo
 * - Link "Voltar ao início"
 * - Sem header/footer completo
 * - Background gradiente
 *
 * Usado em:
 * - Login público (/login)
 * - Login admin (/admin/login)
 * - Cadastro (/cadastro)
 * - Recuperação de senha
 */
export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 flex flex-col">
      {/* Logo simples no topo */}
      <div className="w-full py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Link href="/" className="text-3xl sm:text-4xl font-bold text-white hover:text-blue-100 transition-colors inline-block">
            Workemia
          </Link>
        </div>
      </div>

      {/* Conteúdo principal (formulário de login/cadastro) */}
      <main className="flex-1 flex items-center justify-center p-4">
        {children}
      </main>

      {/* Link voltar ao início */}
      <div className="w-full py-6">
        <div className="text-center">
          <Link href="/" className="text-blue-100 hover:text-white text-sm transition-colors inline-flex items-center gap-2">
            <i className="fas fa-arrow-left"></i>
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  )
}

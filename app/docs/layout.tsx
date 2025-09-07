'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/hooks/use-auth'
import { DocsNavbar } from '@/components/docs/docs-navbar'
import { Lock, ShieldAlert } from 'lucide-react'

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading, isAdmin } = useAuth()
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login?redirect=/docs')
        return
      }
      
      if (!isAdmin) {
        router.push('/')
        return
      }
      
      setChecking(false)
    }
  }, [user, loading, isAdmin, router])

  if (loading || checking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400">
          <Lock className="h-6 w-6 animate-pulse" />
          <span className="text-lg font-medium">Verificando permissões...</span>
        </div>
      </div>
    )
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950 flex items-center justify-center">
        <Card className="p-8 max-w-md text-center border-2 border-red-200 dark:border-red-800">
          <ShieldAlert className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-700 dark:text-red-300 mb-2">
            Acesso Negado
          </h1>
          <p className="text-red-600 dark:text-red-400 mb-4">
            Esta área é restrita apenas para administradores.
          </p>
          <Link 
            href="/" 
            className="inline-block px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Voltar ao Início
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Docs Navigation */}
      <DocsNavbar />
      
      {/* Admin Badge */}
      <div className="flex justify-center py-4">
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900 border border-blue-200 dark:border-blue-800 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium">
          <Lock className="h-4 w-4" />
          <span>Área Administrativa</span>
          <span className="text-xs bg-blue-200 dark:bg-blue-800 px-2 py-1 rounded-full">
            {user.email}
          </span>
        </div>
      </div>

      {/* Content Container */}
      <div className="container mx-auto px-4 pb-8">
        <div className="max-w-5xl mx-auto">
          {/* Conteúdo da Página */}
          <main className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border-2 border-blue-200 dark:border-blue-800 p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
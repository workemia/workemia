'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Home, ListTodo, FileText, ArrowLeft } from 'lucide-react'

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
  description: string
  color: string
}

const navItems: NavItem[] = [
  {
    href: '/docs',
    label: 'Documentação',
    icon: <Home className="w-4 h-4" />,
    description: 'Guia oficial',
    color: 'text-blue-600 dark:text-blue-400'
  },
  {
    href: '/docs/todo',
    label: 'Lista de Tarefas',
    icon: <ListTodo className="w-4 h-4" />,
    description: 'Roadmap & TODOs',
    color: 'text-green-600 dark:text-green-400'
  },
  {
    href: '/docs/summary',
    label: 'Resumo',
    icon: <FileText className="w-4 h-4" />,
    description: 'Implementações',
    color: 'text-purple-600 dark:text-purple-400'
  }
]

export function DocsNavbar() {
  const pathname = usePathname()

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              📚 Documentação Workemia
            </h1>
            <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full font-medium">
              Somente Admins
            </span>
          </div>
          
          <Link 
            href="/" 
            className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Voltar ao Painel</span>
          </Link>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between py-4">
          <nav className="flex gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 group",
                    isActive
                      ? "bg-primary/10 text-primary border-2 border-primary/20"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                >
                  <span className={cn(
                    "transition-all duration-200",
                    isActive ? item.color : "text-gray-500 dark:text-gray-500",
                    "group-hover:scale-110"
                  )}>
                    {item.icon}
                  </span>
                  
                  <strong className={cn(
                    isActive ? "text-primary" : ""
                  )}>
                    {item.label}
                  </strong>
                  
                  <span className={cn(
                    "text-xs hidden md:inline ml-1 transition-colors",
                    isActive 
                      ? "text-primary/70" 
                      : "text-gray-500 dark:text-gray-500"
                  )}>
                    {item.description}
                  </span>
                </Link>
              )
            })}
          </nav>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <Link 
              href="/dashboard/prestador" 
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-primary border border-gray-200 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              🏗️ <span className="hidden sm:inline">Dashboard</span>
            </Link>
            
            <Link 
              href="/perfil" 
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-primary border border-gray-200 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              👤 <span className="hidden sm:inline">Perfil</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
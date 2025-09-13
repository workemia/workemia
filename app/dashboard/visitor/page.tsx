'use client'

import { usePermissions } from '@/hooks/use-permissions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Search, MapPin, Star, Users, ArrowRight, Shield, Clock } from 'lucide-react'
import Link from 'next/link'

export default function VisitorDashboard() {
  const { user } = usePermissions()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Encontre os Melhores Prestadores
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Conecte-se com profissionais qualificados na sua região
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/seja-prestador">
              <Button size="lg" variant="secondary" className="text-blue-600">
                Seja um Prestador
              </Button>
            </Link>
            <Link href="/servicos">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
                Explorar Serviços
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-16 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Como Funciona</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Nossa plataforma conecta você aos melhores profissionais da sua região de forma rápida e segura
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Busque</h3>
              <p className="text-gray-600">
                Encontre o serviço que você precisa em nossa ampla categoria de profissionais
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Compare</h3>
              <p className="text-gray-600">
                Veja perfis, avaliações e propostas de diferentes prestadores qualificados
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Contrate</h3>
              <p className="text-gray-600">
                Escolha o melhor profissional e tenha a segurança de pagamento protegido
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Categorias Populares */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Categorias Populares</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Limpeza', icon: '🧹', count: '234 prestadores' },
              { name: 'Eletricista', icon: '⚡', count: '156 prestadores' },
              { name: 'Encanador', icon: '🔧', count: '189 prestadores' },
              { name: 'Pintor', icon: '🎨', count: '145 prestadores' },
              { name: 'Jardinagem', icon: '🌱', count: '98 prestadores' },
              { name: 'Montagem', icon: '🔨', count: '167 prestadores' },
              { name: 'Reformas', icon: '🏠', count: '89 prestadores' },
              { name: 'Informática', icon: '💻', count: '123 prestadores' }
            ].map((category, index) => (
              <Link key={index} href={`/servicos?categoria=${category.name}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl mb-2">{category.icon}</div>
                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.count}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-lg p-8 shadow-sm mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">1,234</div>
              <div className="text-gray-600">Prestadores Ativos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">5,678</div>
              <div className="text-gray-600">Serviços Concluídos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">4.8</div>
              <div className="text-gray-600">Avaliação Média</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-600 mb-2">98%</div>
              <div className="text-gray-600">Satisfação dos Clientes</div>
            </div>
          </div>
        </div>

        {/* CTA Final */}
        <div className="text-center bg-gray-100 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Pronto para Começar?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Junte-se a milhares de pessoas que já encontraram os melhores profissionais através da nossa plataforma
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/cadastro">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Criar Conta Grátis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/como-funciona">
              <Button size="lg" variant="outline">
                Saber Mais
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
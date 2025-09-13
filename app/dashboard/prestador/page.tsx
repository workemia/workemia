"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import {
  Calendar,
  Clock,
  DollarSign,
  Star,
  Users,
  Bell,
  Settings,
  MessageCircle,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Service = any & {
  users: any
}

type Review = any & {
  users: any
}

export default function DashboardPrestador() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [services, setServices] = useState<Service[]>([])
  const [availableServices, setAvailableServices] = useState<Service[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState({
    totalEarnings: 0,
    completedJobs: 0,
    averageRating: 0,
    responseTime: "< 2h",
  })
  const [loading, setLoading] = useState(true)
  const [events, setEvents] = useState([])
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }

      setUser(user)
      await fetchDashboardData(user.id)
    }

    checkAuth()

    const supabase = createClient()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        router.push("/login")
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  async function fetchDashboardData(userId: string) {
    try {
      setLoading(true)
      const supabase = createClient()

      // Buscar serviços aceitos pelo prestador
      const { data: servicesData, error: servicesError } = await supabase
        .from("services")
        .select(`
          *,
          client:client_id (
            id,
            email
          ),
          categories (
            id,
            name
          )
        `)
        .eq("provider_id", userId)
        .order("created_at", { ascending: false })

      if (servicesError) {
        console.error("Erro ao buscar serviços do prestador:", servicesError)
      } else {
        setServices(servicesData || [])
      }

      // Buscar serviços disponíveis (sem prestador)
      const { data: availableServicesData, error: availableError } = await supabase
        .from("services")
        .select(`
          *,
          client:client_id (
            id,
            email
          ),
          categories (
            id,
            name
          )
        `)
        .is("provider_id", null)
        .eq("status", "pending")
        .order("created_at", { ascending: false })

      if (availableError) {
        console.error("Erro ao buscar serviços disponíveis:", availableError)
      } else {
        setAvailableServices(availableServicesData || [])
      }

      // Buscar reviews - usando uma query mais simples
      const { data: reviewsData, error: reviewsError } = await supabase
        .from("reviews")
        .select(`
          *
        `)
        .eq("provider_id", userId)
        .order("created_at", { ascending: false })
        .limit(5)

      if (reviewsError) {
        console.error("Erro ao buscar reviews:", reviewsError)
      } else {
        setReviews(reviewsData || [])
      }

      const completedServices = servicesData?.filter((s) => s.status === "completed") || []
      const totalEarnings = completedServices.reduce((sum, service) => sum + (service.final_price || 0), 0)
      const averageRating = reviewsData?.length
        ? reviewsData.reduce((sum, review) => sum + review.rating, 0) / reviewsData.length
        : 0

      setStats({
        totalEarnings,
        completedJobs: completedServices.length,
        averageRating,
        responseTime: "< 2h",
      })
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error)
    } finally {
      setLoading(false)
    }
  }

  const acceptService = async (serviceId: string) => {
    try {
      const supabase = createClient()
      
      const { error } = await supabase
        .from("services")
        .update({ 
          provider_id: user.id,
          status: "accepted" 
        })
        .eq("id", serviceId)
        .is("provider_id", null) // Só aceita se ainda não tiver prestador

      if (error) {
        console.error("Erro ao aceitar serviço:", error)
        return
      }

      // Atualizar as listas
      await fetchDashboardData(user.id)
    } catch (error) {
      console.error("Erro ao aceitar serviço:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "accepted":
        return "bg-blue-100 text-blue-800"
      case "in_progress":
        return "bg-purple-100 text-purple-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <AlertCircle className="h-4 w-4" />
      case "accepted":
        return <CheckCircle className="h-4 w-4" />
      case "in_progress":
        return <Clock className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendente"
      case "accepted":
        return "Aceito"
      case "in_progress":
        return "Em Andamento"
      case "completed":
        return "Concluído"
      case "cancelled":
        return "Cancelado"
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard do Prestador</h1>
            <p className="text-gray-600">Gerencie seus serviços e acompanhe seu desempenho</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Notificações
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ganhos Totais</p>
                  <p className="text-2xl font-bold text-gray-900">
                    R$ {stats.totalEarnings.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Trabalhos Concluídos</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completedJobs}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avaliação Média</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}</p>
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  </div>
                </div>
                <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tempo de Resposta</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.responseTime}</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="opportunities" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="opportunities">Oportunidades</TabsTrigger>
            <TabsTrigger value="services">Meus Serviços</TabsTrigger>
            <TabsTrigger value="calendar">Agenda</TabsTrigger>
            <TabsTrigger value="reviews">Avaliações</TabsTrigger>
            <TabsTrigger value="analytics">Análises</TabsTrigger>
          </TabsList>

          <TabsContent value="opportunities" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Novas Oportunidades</CardTitle>
                <CardDescription>Solicitações de clientes aguardando prestadores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {availableServices.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma oportunidade disponível</h3>
                      <p className="text-gray-600">Não há solicitações de serviço disponíveis no momento.</p>
                    </div>
                  ) : (
                    availableServices.map((service) => (
                      <div key={service.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-gray-900">{service.title}</h3>
                              <Badge className="bg-green-100 text-green-800">
                                <div className="flex items-center gap-1">
                                  <AlertCircle className="h-4 w-4" />
                                  Disponível
                                </div>
                              </Badge>
                              {service.categories && (
                                <Badge variant="outline">{service.categories.name}</Badge>
                              )}
                            </div>
                            <p className="text-gray-600 mb-3 line-clamp-2">{service.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                <span>{service.client?.email || 'Cliente'}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  {service.preferred_date
                                    ? new Date(service.preferred_date).toLocaleDateString("pt-BR")
                                    : "Data flexível"}
                                </span>
                              </div>
                              {service.budget_min && service.budget_max && (
                                <div className="flex items-center gap-1">
                                  <DollarSign className="h-4 w-4" />
                                  <span>
                                    R$ {service.budget_min} - R$ {service.budget_max}
                                  </span>
                                </div>
                              )}
                              {service.location && (
                                <div className="flex items-center gap-1">
                                  <span>📍 {service.location}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => acceptService(service.id)}
                            >
                              Ver Detalhes
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => acceptService(service.id)}
                            >
                              Aceitar Serviço
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Solicitações de Serviço</CardTitle>
                <CardDescription>Gerencie suas solicitações de serviço ativas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {services.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum serviço encontrado</h3>
                      <p className="text-gray-600">Você ainda não possui solicitações de serviço.</p>
                    </div>
                  ) : (
                    services.map((service) => (
                      <div key={service.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-gray-900">{service.title}</h3>
                              <Badge className={getStatusColor(service.status)}>
                                <div className="flex items-center gap-1">
                                  {getStatusIcon(service.status)}
                                  {getStatusText(service.status)}
                                </div>
                              </Badge>
                            </div>
                            <p className="text-gray-600 mb-3 line-clamp-2">{service.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                <span>{service.client?.email || 'Cliente'}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  {service.preferred_date
                                    ? new Date(service.preferred_date).toLocaleDateString("pt-BR")
                                    : "Data flexível"}
                                </span>
                              </div>
                              {service.budget_min && service.budget_max && (
                                <div className="flex items-center gap-1">
                                  <DollarSign className="h-4 w-4" />
                                  <span>
                                    R$ {service.budget_min} - R$ {service.budget_max}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <Button size="sm" variant="outline">
                              <MessageCircle className="h-4 w-4 mr-2" />
                              Chat
                            </Button>
                            {service.status === "pending" && <Button size="sm">Aceitar</Button>}
                          </div>
                        </div>
                        {service.progress > 0 && (
                          <div className="mt-4">
                            <div className="flex items-center justify-between text-sm mb-2">
                              <span className="text-gray-600">Progresso</span>
                              <span className="font-medium">{service.progress}%</span>
                            </div>
                            <Progress value={service.progress} className="h-2" />
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Agenda</CardTitle>
                <CardDescription>Visualize e gerencie seus compromissos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 flex items-center justify-center">
                  <div className="text-center">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Agenda em desenvolvimento</h3>
                    <p className="text-gray-600">A funcionalidade de agenda será implementada em breve.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Avaliações Recentes</CardTitle>
                <CardDescription>Veja o que seus clientes estão dizendo sobre você</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {reviews.length === 0 ? (
                    <div className="text-center py-8">
                      <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma avaliação ainda</h3>
                      <p className="text-gray-600">Complete alguns serviços para receber suas primeiras avaliações.</p>
                    </div>
                  ) : (
                    reviews.map((review) => (
                      <div key={review.id} className="border-b pb-6 last:border-b-0">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>
                              U
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium text-gray-900">Cliente</h4>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-500">
                                {new Date(review.created_at).toLocaleDateString("pt-BR")}
                              </span>
                            </div>
                            {review.comment && <p className="text-gray-700 mb-3">{review.comment}</p>}
                            {review.response && (
                              <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-sm text-gray-600 mb-1">Sua resposta:</p>
                                <p className="text-gray-700">{review.response}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Desempenho Mensal</CardTitle>
                  <CardDescription>Acompanhe seu crescimento ao longo do tempo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Taxa de Aceitação</span>
                      <span className="font-medium">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Satisfação do Cliente</span>
                      <span className="font-medium">4.8/5.0</span>
                    </div>
                    <Progress value={96} className="h-2" />

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Pontualidade</span>
                      <span className="font-medium">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ganhos por Categoria</CardTitle>
                  <CardDescription>Veja quais serviços geram mais receita</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Limpeza</span>
                      <span className="font-medium">R$ 2.400</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Reparos</span>
                      <span className="font-medium">R$ 1.800</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Pintura</span>
                      <span className="font-medium">R$ 1.200</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/hooks/use-toast"
import {
  Search,
  Filter,
  Star,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  Calendar,
  Heart,
  CreditCard,
  Plus,
  TrendingUp,
  Users,
  DollarSign,
  CheckCircle,
  Bell,
} from "lucide-react"

interface Service {
  id: string
  title: string
  provider: string
  status: "ativo" | "concluido" | "cancelado" | "pendente"
  progress: number
  price: string
  date: string
  description: string
  category: string
  location: string
  providerAvatar: string
  providerRating: number
  estimatedTime: string
}

interface Provider {
  id: string
  name: string
  service: string
  rating: number
  reviews: number
  price: string
  avatar: string
  verified: boolean
  responseTime: string
  completedJobs: number
  specialties: string[]
}

export default function ClientDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [showNewServiceModal, setShowNewServiceModal] = useState(false)
  const [notifications, setNotifications] = useState(3)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [stats, setStats] = useState({
    totalServices: 0,
    activeServices: 0,
    totalSpent: 0,
    averageRating: 0,
    monthlyGrowth: 0,
    completedServices: 0,
    favoriteProviders: 0,
    pendingPayments: 0,
  })

  const [activeServices, setActiveServices] = useState<Service[]>([])
  const [serviceHistory, setServiceHistory] = useState<Service[]>([])
  const [favoriteProviders, setFavoriteProviders] = useState<Provider[]>([])
  const [paymentHistory, setPaymentHistory] = useState<any[]>([])

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    location: "",
    birthDate: "",
    cpf: "",
    preferences: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      marketingEmails: false,
    },
    privacy: {
      showPhone: true,
      showEmail: false,
      showLocation: true,
    },
  })

  const [newService, setNewService] = useState({
    title: "",
    category: "",
    description: "",
    budget: "",
    location: "",
    urgency: "normal",
  })

  // Dados simulados
  /*
  const stats = {
    totalServices: 24,
    activeServices: 3,
    totalSpent: 2850,
    averageRating: 4.8,
    monthlyGrowth: 12,
    completedServices: 21,
    favoriteProviders: 8,
    pendingPayments: 1,
  }

  const activeServices: Service[] = [
    {
      id: "1",
      title: "Limpeza Residencial Completa",
      provider: "Maria Silva",
      status: "ativo",
      progress: 75,
      price: "R$ 120",
      date: "2024-01-15",
      description: "Limpeza completa de apartamento 2 quartos, incluindo banheiros, cozinha e área de serviço",
      category: "Limpeza",
      location: "São Paulo, SP",
      providerAvatar: "MS",
      providerRating: 4.9,
      estimatedTime: "4 horas",
    },
    {
      id: "2",
      title: "Reparo Elétrico",
      provider: "João Santos",
      status: "pendente",
      progress: 0,
      price: "R$ 200",
      date: "2024-01-16",
      description: "Instalação de novos pontos de luz na sala e quarto",
      category: "Elétrica",
      location: "São Paulo, SP",
      providerAvatar: "JS",
      providerRating: 4.7,
      estimatedTime: "3 horas",
    },
    {
      id: "3",
      title: "Aula de Matemática",
      provider: "Pedro Oliveira",
      status: "ativo",
      progress: 50,
      price: "R$ 80",
      date: "2024-01-14",
      description: "Aulas particulares de matemática para ensino médio",
      category: "Educação",
      location: "Online",
      providerAvatar: "PO",
      providerRating: 4.9,
      estimatedTime: "2 horas",
    },
  ]

  const serviceHistory: Service[] = [
    {
      id: "4",
      title: "Pintura de Parede",
      provider: "Carlos Mendes",
      status: "concluido",
      progress: 100,
      price: "R$ 350",
      date: "2024-01-10",
      description: "Pintura completa da sala de estar",
      category: "Pintura",
      location: "São Paulo, SP",
      providerAvatar: "CM",
      providerRating: 5.0,
      estimatedTime: "6 horas",
    },
    {
      id: "5",
      title: "Manicure e Pedicure",
      provider: "Ana Costa",
      status: "concluido",
      progress: 100,
      price: "R$ 60",
      date: "2024-01-08",
      description: "Serviço completo de manicure e pedicure",
      category: "Beleza",
      location: "São Paulo, SP",
      providerAvatar: "AC",
      providerRating: 4.8,
      estimatedTime: "2 horas",
    },
  ]

  const favoriteProviders: Provider[] = [
    {
      id: "1",
      name: "Maria Silva",
      service: "Limpeza Residencial",
      rating: 4.9,
      reviews: 127,
      price: "R$ 80/h",
      avatar: "MS",
      verified: true,
      responseTime: "< 1h",
      completedJobs: 156,
      specialties: ["Limpeza Pesada", "Organização", "Limpeza Pós-Obra"],
    },
    {
      id: "2",
      name: "João Santos",
      service: "Reparos Gerais",
      rating: 4.7,
      reviews: 89,
      price: "R$ 120/h",
      avatar: "JS",
      verified: true,
      responseTime: "< 2h",
      completedJobs: 94,
      specialties: ["Elétrica", "Hidráulica", "Marcenaria"],
    },
    {
      id: "3",
      name: "Pedro Oliveira",
      service: "Professor Particular",
      rating: 4.9,
      reviews: 78,
      price: "R$ 50/h",
      avatar: "PO",
      verified: true,
      responseTime: "< 30min",
      completedJobs: 203,
      specialties: ["Matemática", "Física", "Química"],
    },
  ]

  const paymentHistory = [
    {
      id: "1",
      service: "Limpeza Residencial",
      provider: "Maria Silva",
      amount: "R$ 120,00",
      date: "15/01/2024",
      status: "pago",
      method: "Cartão de Crédito",
      transactionId: "TXN123456",
    },
    {
      id: "2",
      service: "Pintura de Parede",
      provider: "Carlos Mendes",
      amount: "R$ 350,00",
      date: "10/01/2024",
      status: "pago",
      method: "PIX",
      transactionId: "TXN123457",
    },
    {
      id: "3",
      service: "Reparo Elétrico",
      provider: "João Santos",
      amount: "R$ 200,00",
      date: "16/01/2024",
      status: "pendente",
      method: "Cartão de Débito",
      transactionId: "TXN123458",
    },
  ]
  */

  const filteredActiveServices = activeServices.filter((service) => {
    const matchesSearch =
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.provider.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || service.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleNewServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Solicitação enviada!",
      description: "Sua solicitação foi enviada para os prestadores. Você receberá propostas em breve.",
    })
    setShowNewServiceModal(false)
    setNewService({
      title: "",
      category: "",
      description: "",
      budget: "",
      location: "",
      urgency: "normal",
    })
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string)
        toast({
          title: "Foto atualizada",
          description: "Sua foto de perfil foi atualizada com sucesso!",
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveProfile = () => {
    setIsEditingProfile(false)
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram salvas com sucesso!",
    })
  }

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handlePreferenceChange = (field: string, value: boolean) => {
    setProfileData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value,
      },
    }))
  }

  const handlePrivacyChange = (field: string, value: boolean) => {
    setProfileData((prev) => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [field]: value,
      },
    }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ativo":
        return "bg-green-100 text-green-800"
      case "pendente":
        return "bg-yellow-100 text-yellow-800"
      case "concluido":
        return "bg-blue-100 text-blue-800"
      case "cancelado":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "pago":
        return "bg-green-100 text-green-800"
      case "pendente":
        return "bg-yellow-100 text-yellow-800"
      case "cancelado":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

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

      await loadUserData(user.id)
      setLoading(false)
    }

    checkAuth()

    // Listen for auth changes
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

  const loadUserData = async (userId: string) => {
    const supabase = createClient()

    try {
      // Load user profile
      const { data: userProfile } = await supabase.from("users").select("*").eq("id", userId).single()

      if (userProfile) {
        setProfileData((prev) => ({
          ...prev,
          name: userProfile.display_name || userProfile.email,
          email: userProfile.email,
          phone: userProfile.phone || "",
          location: userProfile.location || "",
        }))
      }

      // Load user services
      const { data: services } = await supabase
        .from("services")
        .select(`
          *,
          service_requests!inner(
            id,
            status,
            created_at,
            users!service_requests_client_id_fkey(display_name, email)
          )
        `)
        .eq("service_requests.client_id", userId)

      if (services) {
        const activeServicesData = services
          .filter((service) => ["pending", "in_progress"].includes(service.service_requests[0]?.status))
          .map((service) => ({
            id: service.id,
            title: service.title,
            provider: service.service_requests[0]?.users?.display_name || "Prestador",
            status: service.service_requests[0]?.status === "in_progress" ? "ativo" : "pendente",
            progress: service.service_requests[0]?.status === "in_progress" ? 50 : 0,
            price: `R$ ${service.price}`,
            date: new Date(service.service_requests[0]?.created_at).toLocaleDateString("pt-BR"),
            description: service.description,
            category: service.category,
            location: service.location,
            providerAvatar:
              service.service_requests[0]?.users?.display_name
                ?.split(" ")
                .map((n) => n[0])
                .join("") || "P",
            providerRating: 4.5,
            estimatedTime: "2-4 horas",
          }))

        setActiveServices(activeServicesData)

        // Update stats
        setStats((prev) => ({
          ...prev,
          totalServices: services.length,
          activeServices: activeServicesData.length,
          completedServices: services.filter((s) => s.service_requests[0]?.status === "completed").length,
        }))
      }
    } catch (error) {
      console.error("Error loading user data:", error)
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
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard do Cliente</h1>
            <p className="text-gray-600 mt-1">Gerencie seus serviços e acompanhe seu histórico</p>
          </div>

          <div className="flex items-center space-x-4">
            <Button onClick={() => setNotifications(0)} variant="outline" className="relative bg-transparent">
              <Bell className="w-4 h-4 mr-2" />
              Notificações
              {notifications > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </Button>

            <Dialog open={showNewServiceModal} onOpenChange={setShowNewServiceModal}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Solicitar Serviço
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Solicitar Novo Serviço</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleNewServiceSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Título do Serviço</Label>
                    <Input
                      id="title"
                      placeholder="Ex: Limpeza residencial"
                      value={newService.title}
                      onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Categoria</Label>
                    <Select
                      value={newService.category}
                      onValueChange={(value) => setNewService({ ...newService, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="limpeza">Limpeza</SelectItem>
                        <SelectItem value="eletrica">Elétrica</SelectItem>
                        <SelectItem value="hidraulica">Hidráulica</SelectItem>
                        <SelectItem value="pintura">Pintura</SelectItem>
                        <SelectItem value="jardinagem">Jardinagem</SelectItem>
                        <SelectItem value="beleza">Beleza</SelectItem>
                        <SelectItem value="educacao">Educação</SelectItem>
                        <SelectItem value="outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      placeholder="Descreva detalhadamente o que você precisa..."
                      value={newService.description}
                      onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="budget">Orçamento Estimado</Label>
                    <Input
                      id="budget"
                      placeholder="R$ 100,00"
                      value={newService.budget}
                      onChange={(e) => setNewService({ ...newService, budget: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="location">Localização</Label>
                    <Input
                      id="location"
                      placeholder="Cidade, Estado"
                      value={newService.location}
                      onChange={(e) => setNewService({ ...newService, location: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="urgency">Urgência</Label>
                    <Select
                      value={newService.urgency}
                      onValueChange={(value) => setNewService({ ...newService, urgency: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="baixa">Baixa - Até 1 semana</SelectItem>
                        <SelectItem value="normal">Normal - Até 3 dias</SelectItem>
                        <SelectItem value="alta">Alta - Até 24h</SelectItem>
                        <SelectItem value="urgente">Urgente - Hoje</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <i className="fas fa-lightbulb mr-2"></i>
                      <strong>Dica:</strong> Seja específico na descrição para receber propostas mais precisas!
                    </p>
                  </div>

                  <Button type="submit" className="w-full">
                    Enviar Solicitação
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="active">Serviços Ativos</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
            <TabsTrigger value="favorites">Favoritos</TabsTrigger>
            <TabsTrigger value="payments">Pagamentos</TabsTrigger>
            <TabsTrigger value="profile">Perfil</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total de Serviços</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalServices}</p>
                      <p className="text-xs text-green-600 flex items-center mt-1">
                        <TrendingUp className="w-3 h-3 mr-1" />+{stats.monthlyGrowth}% este mês
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <i className="fas fa-clipboard-list text-blue-600 text-xl"></i>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Serviços Ativos</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.activeServices}</p>
                      <p className="text-xs text-blue-600 flex items-center mt-1">
                        <Clock className="w-3 h-3 mr-1" />
                        Em andamento
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <i className="fas fa-play-circle text-green-600 text-xl"></i>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Gasto</p>
                      <p className="text-2xl font-bold text-gray-900">R$ {stats.totalSpent.toLocaleString()}</p>
                      <p className="text-xs text-gray-600 flex items-center mt-1">
                        <DollarSign className="w-3 h-3 mr-1" />
                        Este ano
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <i className="fas fa-wallet text-purple-600 text-xl"></i>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avaliação Média</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.averageRating}</p>
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <i className="fas fa-star text-yellow-600 text-xl"></i>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Estatísticas Adicionais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Concluídos</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.completedServices}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Prestadores Favoritos</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.favoriteProviders}</p>
                    </div>
                    <Heart className="w-8 h-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pagamentos Pendentes</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.pendingPayments}</p>
                    </div>
                    <CreditCard className="w-8 h-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Prestadores Ativos</p>
                      <p className="text-2xl font-bold text-gray-900">12</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Serviços Recentes */}
            <Card>
              <CardHeader>
                <CardTitle>Atividade Recente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeServices.slice(0, 3).map((service) => (
                    <div key={service.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarFallback className="bg-blue-500 text-white">{service.providerAvatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold text-gray-900">{service.title}</h4>
                          <p className="text-sm text-gray-600">{service.provider}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(service.status)}>{service.status}</Badge>
                        <p className="text-sm text-gray-600 mt-1">{service.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex flex-1 items-center space-x-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar serviços..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="ativo">Ativos</SelectItem>
                    <SelectItem value="pendente">Pendentes</SelectItem>
                    <SelectItem value="concluido">Concluídos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-6">
              {filteredActiveServices.map((service) => (
                <Card key={service.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-blue-500 text-white">{service.providerAvatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{service.title}</h3>
                          <p className="text-gray-600">{service.provider}</p>
                          <div className="flex items-center mt-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600 ml-1">{service.providerRating}</span>
                            <span className="text-gray-400 mx-2">•</span>
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600 ml-1">{service.location}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(service.status)}>{service.status}</Badge>
                        <p className="text-lg font-semibold text-gray-900 mt-1">{service.price}</p>
                        <p className="text-sm text-gray-500">
                          <Clock className="w-4 h-4 inline mr-1" />
                          {service.estimatedTime}
                        </p>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4">{service.description}</p>

                    {service.status === "ativo" && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Progresso</span>
                          <span className="text-sm text-gray-600">{service.progress}%</span>
                        </div>
                        <Progress value={service.progress} className="h-2" />
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{service.category}</Badge>
                        <span className="text-sm text-gray-500">{service.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={() => setSelectedService(service)}>
                          <i className="fas fa-eye mr-2"></i>
                          Detalhes
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Chat
                        </Button>
                        <Button variant="outline" size="sm">
                          <Phone className="w-4 h-4 mr-2" />
                          Ligar
                        </Button>
                        {service.status === "ativo" && (
                          <Button variant="outline" size="sm">
                            <Calendar className="w-4 h-4 mr-2" />
                            Reagendar
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Modal de Detalhes do Serviço */}
            <Dialog open={!!selectedService} onOpenChange={() => setSelectedService(null)}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Detalhes do Serviço</DialogTitle>
                </DialogHeader>
                {selectedService && (
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-16 h-16">
                        <AvatarFallback className="bg-blue-500 text-white text-lg">
                          {selectedService.providerAvatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold">{selectedService.title}</h3>
                        <p className="text-gray-600">{selectedService.provider}</p>
                        <div className="flex items-center mt-2">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600 ml-1">{selectedService.providerRating}</span>
                          <Badge className={`ml-4 ${getStatusColor(selectedService.status)}`}>
                            {selectedService.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">{selectedService.price}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{selectedService.category}</Badge>
                        <span className="text-sm text-gray-500">{selectedService.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Calendar className="w-4 h-4 mr-2" />
                          Reagendar
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            {/* Histórico de Serviços */}
            <div className="grid gap-6">
              {serviceHistory.map((service) => (
                <Card key={service.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-blue-500 text-white">{service.providerAvatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{service.title}</h3>
                          <p className="text-gray-600">{service.provider}</p>
                          <div className="flex items-center mt-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600 ml-1">{service.providerRating}</span>
                            <span className="text-gray-400 mx-2">•</span>
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600 ml-1">{service.location}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(service.status)}>{service.status}</Badge>
                        <p className="text-lg font-semibold text-gray-900 mt-1">{service.price}</p>
                        <p className="text-sm text-gray-500">
                          <Clock className="w-4 h-4 inline mr-1" />
                          {service.estimatedTime}
                        </p>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4">{service.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{service.category}</Badge>
                        <span className="text-sm text-gray-500">{service.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Chat
                        </Button>
                        <Button variant="outline" size="sm">
                          <Phone className="w-4 h-4 mr-2" />
                          Ligar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="favorites" className="space-y-6">
            {/* Prestadores Favoritos */}
            <div className="grid gap-6">
              {favoriteProviders.map((provider) => (
                <Card key={provider.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-blue-500 text-white">{provider.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{provider.name}</h3>
                          <p className="text-gray-600">{provider.service}</p>
                          <div className="flex items-center mt-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600 ml-1">{provider.rating}</span>
                            <span className="text-gray-400 mx-2">•</span>
                            <span className="text-sm text-gray-600">{provider.reviews} avaliações</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">{provider.price}</p>
                        <p className="text-sm text-gray-500">
                          <Clock className="w-4 h-4 inline mr-1" />
                          {provider.responseTime}
                        </p>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4">Especialidades: {provider.specialties.join(", ")}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{provider.service}</Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Chat
                        </Button>
                        <Button variant="outline" size="sm">
                          <Phone className="w-4 h-4 mr-2" />
                          Ligar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            {/* Histórico de Pagamentos */}
            <div className="grid gap-6">
              {paymentHistory.map((payment) => (
                <Card key={payment.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-blue-500 text-white">P</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{payment.service}</h3>
                          <p className="text-gray-600">{payment.provider}</p>
                          <div className="flex items-center mt-1">
                            <Badge className={getPaymentStatusColor(payment.status)}>{payment.status}</Badge>
                            <span className="text-gray-400 mx-2">•</span>
                            <span className="text-sm text-gray-600">{payment.method}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">{payment.amount}</p>
                        <p className="text-sm text-gray-500">
                          <Calendar className="w-4 h-4 inline mr-1" />
                          {payment.date}
                        </p>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4">ID da Transação: {payment.transactionId}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{payment.service}</Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Chat
                        </Button>
                        <Button variant="outline" size="sm">
                          <Phone className="w-4 h-4 mr-2" />
                          Ligar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            {/* Perfil do Cliente */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Informações Pessoais</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditingProfile ? (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">Nome</Label>
                          <Input
                            id="name"
                            placeholder="João Silva"
                            value={profileData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            placeholder="joao.silva@email.com"
                            value={profileData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Telefone</Label>
                          <Input
                            id="phone"
                            placeholder="(11) 99999-9999"
                            value={profileData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            id="bio"
                            placeholder="Descreva um pouco sobre você..."
                            value={profileData.bio}
                            onChange={(e) => handleInputChange("bio", e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="location">Localização</Label>
                          <Input
                            id="location"
                            placeholder="São Paulo, SP"
                            value={profileData.location}
                            onChange={(e) => handleInputChange("location", e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="birthDate">Data de Nascimento</Label>
                          <Input
                            id="birthDate"
                            type="date"
                            value={profileData.birthDate}
                            onChange={(e) => handleInputChange("birthDate", e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="cpf">CPF</Label>
                          <Input
                            id="cpf"
                            placeholder="123.456.789-00"
                            value={profileData.cpf}
                            onChange={(e) => handleInputChange("cpf", e.target.value)}
                            required
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Button onClick={handleSaveProfile} className="bg-blue-600 hover:bg-blue-700">
                            Salvar
                          </Button>
                          <Button onClick={() => setIsEditingProfile(false)} variant="outline">
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                          {profileImage ? (
                            <AvatarImage src={profileImage || "/placeholder.svg"} alt="Profile Image" />
                          ) : (
                            <AvatarFallback className="bg-blue-500 text-white">JS</AvatarFallback>
                          )}
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{profileData.name}</h3>
                            <p className="text-gray-600">{profileData.email}</p>
                            <p className="text-gray-600">{profileData.phone}</p>
                            <p className="text-gray-600">{profileData.location}</p>
                            <p className="text-gray-600">Data de Nascimento: {profileData.birthDate}</p>
                            <p className="text-gray-600">CPF: {profileData.cpf}</p>
                          </div>
                        </div>
                        <div>
                          <Button onClick={() => setIsEditingProfile(true)} className="bg-blue-600 hover:bg-blue-700">
                            Editar Perfil
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Preferências de Notificação</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={profileData.preferences.emailNotifications}
                            onCheckedChange={(checked) => handlePreferenceChange("emailNotifications", checked)}
                          />
                          <span>Email</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={profileData.preferences.smsNotifications}
                            onCheckedChange={(checked) => handlePreferenceChange("smsNotifications", checked)}
                          />
                          <span>SMS</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={profileData.preferences.pushNotifications}
                            onCheckedChange={(checked) => handlePreferenceChange("pushNotifications", checked)}
                          />
                          <span>Push</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={profileData.preferences.marketingEmails}
                            onCheckedChange={(checked) => handlePreferenceChange("marketingEmails", checked)}
                          />
                          <span>Emails de Marketing</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Configurações de Privacidade</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={profileData.privacy.showPhone}
                            onCheckedChange={(checked) => handlePrivacyChange("showPhone", checked)}
                          />
                          <span>Mostrar Telefone</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={profileData.privacy.showEmail}
                            onCheckedChange={(checked) => handlePrivacyChange("showEmail", checked)}
                          />
                          <span>Mostrar Email</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={profileData.privacy.showLocation}
                            onCheckedChange={(checked) => handlePrivacyChange("showLocation", checked)}
                          />
                          <span>Mostrar Localização</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  )
}

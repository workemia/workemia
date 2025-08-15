"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import {
  Eye,
  EyeOff,
  User,
  Settings,
  Shield,
  CreditCard,
  Star,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Clock,
} from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [userType, setUserType] = useState<"cliente" | "prestador">("prestador")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      try {
        const user = JSON.parse(userData)
        setUserType(user.type || "cliente")
        setProfileData((prev) => ({
          ...prev,
          name: user.name || prev.name,
          email: user.email || prev.email,
        }))
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error)
      }
    }
  }, [])

  const [profileData, setProfileData] = useState({
    name: "João Santos",
    email: "joao.santos@email.com",
    phone: "(11) 99999-9999",
    bio:
      userType === "prestador"
        ? "Profissional experiente em serviços gerais com mais de 5 anos de experiência. Especializado em reparos domésticos, pintura e manutenção."
        : "Cliente ativo da plataforma, sempre em busca de profissionais qualificados para serviços domésticos.",
    location: "São Paulo, SP",
    birthDate: "1985-03-15",
    cpf: "123.456.789-00",
    services: userType === "prestador" ? ["Reparos Gerais", "Pintura", "Elétrica"] : [],
    hourlyRate: "120",
    availability: "Segunda a Sexta, 8h às 18h",
    company: "",
    website: "",
  })

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    marketing: false,
    serviceUpdates: true,
    promotions: false,
  })

  const [privacy, setPrivacy] = useState({
    showPhone: true,
    showEmail: false,
    showLocation: true,
    showBirthDate: false,
  })

  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false,
  })

  const [paymentData, setPaymentData] = useState({
    pixKey: "joao.santos@email.com",
    bankAccount: "",
    preferredMethod: "pix",
  })

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Arquivo muito grande",
          description: "A imagem deve ter no máximo 5MB.",
          variant: "destructive",
        })
        return
      }

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

  const handleSave = () => {
    // Validações básicas
    if (!profileData.name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, preencha seu nome completo.",
        variant: "destructive",
      })
      return
    }

    if (!profileData.email.trim() || !profileData.email.includes("@")) {
      toast({
        title: "E-mail inválido",
        description: "Por favor, insira um e-mail válido.",
        variant: "destructive",
      })
      return
    }

    // Salvar no localStorage
    const userData = localStorage.getItem("user")
    if (userData) {
      try {
        const user = JSON.parse(userData)
        const updatedUser = {
          ...user,
          name: profileData.name,
          email: profileData.email,
        }
        localStorage.setItem("user", JSON.stringify(updatedUser))
      } catch (error) {
        console.error("Erro ao salvar dados:", error)
      }
    }

    setIsEditing(false)
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

  const handleSecurityChange = (field: string, value: string | boolean) => {
    setSecurityData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handlePaymentChange = (field: string, value: string) => {
    setPaymentData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleChangePassword = () => {
    if (!securityData.currentPassword) {
      toast({
        title: "Senha atual obrigatória",
        description: "Digite sua senha atual para continuar.",
        variant: "destructive",
      })
      return
    }

    if (securityData.newPassword.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "A nova senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      })
      return
    }

    if (securityData.newPassword !== securityData.confirmPassword) {
      toast({
        title: "Senhas não coincidem",
        description: "A confirmação da senha não confere.",
        variant: "destructive",
      })
      return
    }

    // Simular alteração de senha
    setSecurityData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      twoFactorEnabled: securityData.twoFactorEnabled,
    })

    toast({
      title: "Senha alterada",
      description: "Sua senha foi alterada com sucesso!",
    })
  }

  const handleTwoFactorSetup = () => {
    toast({
      title: "Configuração de 2FA",
      description: "Redirecionando para configuração de autenticação em duas etapas...",
    })
    // Aqui seria implementada a lógica real de 2FA
  }

  const handleAddPaymentMethod = () => {
    toast({
      title: "Adicionar método de pagamento",
      description: "Funcionalidade em desenvolvimento.",
    })
  }

  const handleGoToDashboard = () => {
    const dashboardUrl = userType === "cliente" ? "/dashboard/cliente" : "/dashboard/prestador"
    router.push(dashboardUrl)
  }

  const reviews = [
    {
      id: 1,
      client: "Maria Silva",
      rating: 5,
      comment: "Excelente profissional! Muito pontual e caprichoso no trabalho.",
      date: "15/12/2024",
      service: "Pintura",
    },
    {
      id: 2,
      client: "Carlos Mendes",
      rating: 4,
      comment: "Bom trabalho, recomendo. Preço justo e qualidade.",
      date: "10/12/2024",
      service: "Reparos",
    },
    {
      id: 3,
      client: "Ana Costa",
      rating: 5,
      comment: "Superou minhas expectativas. Voltarei a contratar!",
      date: "05/12/2024",
      service: "Elétrica",
    },
  ]

  const stats = {
    totalJobs: userType === "prestador" ? 127 : 23,
    rating: 4.9,
    responseTime: "2h",
    completionRate: "98%",
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Meu Perfil</h1>
            <p className="text-gray-600">Gerencie suas informações pessoais e configurações</p>
          </div>
          <Button onClick={handleGoToDashboard} className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Ir para Dashboard
          </Button>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Perfil</span>
            </TabsTrigger>
            {userType === "prestador" && (
              <TabsTrigger value="reviews" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                <span className="hidden sm:inline">Avaliações</span>
              </TabsTrigger>
            )}
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Configurações</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Segurança</span>
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Pagamentos</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Informações Principais */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Informações Pessoais
                    </CardTitle>
                    <Button
                      variant={isEditing ? "default" : "outline"}
                      onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                    >
                      {isEditing ? "Salvar" : "Editar"}
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Foto de Perfil */}
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Avatar className="w-20 h-20">
                          <AvatarImage src={profileImage || undefined} />
                          <AvatarFallback className="bg-blue-500 text-white text-xl">
                            {profileData.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        {isEditing && (
                          <Button
                            size="sm"
                            className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            📷
                          </Button>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{profileData.name}</h3>
                        <p className="text-gray-500 capitalize">
                          {userType === "prestador" ? "Prestador de Serviços" : "Cliente"}
                        </p>
                        <Badge className="bg-green-100 text-green-700 mt-1">✓ Verificado</Badge>
                      </div>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />

                    {/* Campos do Formulário */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Nome Completo
                        </Label>
                        <Input
                          id="name"
                          value={profileData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          E-mail
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Telefone
                        </Label>
                        <Input
                          id="phone"
                          value={profileData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="location" className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Localização
                        </Label>
                        <Input
                          id="location"
                          value={profileData.location}
                          onChange={(e) => handleInputChange("location", e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="birthDate" className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Data de Nascimento
                        </Label>
                        <Input
                          id="birthDate"
                          type="date"
                          value={profileData.birthDate}
                          onChange={(e) => handleInputChange("birthDate", e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      {userType === "prestador" && (
                        <div>
                          <Label htmlFor="hourlyRate">Valor por Hora (R$)</Label>
                          <Input
                            id="hourlyRate"
                            value={profileData.hourlyRate}
                            onChange={(e) => handleInputChange("hourlyRate", e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="bio">Sobre Você</Label>
                      <Textarea
                        id="bio"
                        value={profileData.bio}
                        onChange={(e) => handleInputChange("bio", e.target.value)}
                        disabled={!isEditing}
                        rows={4}
                      />
                    </div>

                    {userType === "prestador" && (
                      <div>
                        <Label htmlFor="availability" className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Disponibilidade
                        </Label>
                        <Input
                          id="availability"
                          value={profileData.availability}
                          onChange={(e) => handleInputChange("availability", e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Estatísticas */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Estatísticas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">
                        {userType === "prestador" ? "Trabalhos Concluídos" : "Serviços Contratados"}
                      </span>
                      <span className="font-semibold">{stats.totalJobs}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Avaliação Média</span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="font-semibold">{stats.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Tempo de Resposta</span>
                      <span className="font-semibold">{stats.responseTime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Taxa de Conclusão</span>
                      <span className="font-semibold text-green-600">{stats.completionRate}</span>
                    </div>
                  </CardContent>
                </Card>

                {userType === "prestador" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Serviços Oferecidos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {profileData.services.map((service, index) => (
                          <Badge key={index} variant="secondary">
                            {service}
                          </Badge>
                        ))}
                      </div>
                      {isEditing && (
                        <Button variant="outline" className="w-full mt-3 bg-transparent">
                          Gerenciar Serviços
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {userType === "prestador" && (
            <TabsContent value="reviews" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Avaliações dos Clientes
                  </CardTitle>
                  <p className="text-gray-600">Veja o que seus clientes estão dizendo sobre você</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold">{review.client}</h4>
                            <div className="flex items-center mt-1">
                              <div className="flex text-yellow-400 mr-2">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${i < review.rating ? "fill-current" : "text-gray-300"}`}
                                  />
                                ))}
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {review.service}
                              </Badge>
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Notificações
                </CardTitle>
                <p className="text-gray-600">Configure como você quer receber notificações</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications">Notificações por E-mail</Label>
                    <p className="text-sm text-gray-500">Receba atualizações importantes por e-mail</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={notifications.email}
                    onCheckedChange={(checked) => {
                      setNotifications((prev) => ({ ...prev, email: checked }))
                      toast({
                        title: checked ? "E-mail ativado" : "E-mail desativado",
                        description: `Notificações por e-mail ${checked ? "ativadas" : "desativadas"}.`,
                      })
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sms-notifications">Notificações por SMS</Label>
                    <p className="text-sm text-gray-500">Receba alertas urgentes por SMS</p>
                  </div>
                  <Switch
                    id="sms-notifications"
                    checked={notifications.sms}
                    onCheckedChange={(checked) => {
                      setNotifications((prev) => ({ ...prev, sms: checked }))
                      toast({
                        title: checked ? "SMS ativado" : "SMS desativado",
                        description: `Notificações por SMS ${checked ? "ativadas" : "desativadas"}.`,
                      })
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push-notifications">Notificações Push</Label>
                    <p className="text-sm text-gray-500">Receba notificações no navegador</p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={notifications.push}
                    onCheckedChange={(checked) => {
                      setNotifications((prev) => ({ ...prev, push: checked }))
                      toast({
                        title: checked ? "Push ativado" : "Push desativado",
                        description: `Notificações push ${checked ? "ativadas" : "desativadas"}.`,
                      })
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="service-updates">Atualizações de Serviços</Label>
                    <p className="text-sm text-gray-500">Receba notificações sobre seus serviços</p>
                  </div>
                  <Switch
                    id="service-updates"
                    checked={notifications.serviceUpdates}
                    onCheckedChange={(checked) => {
                      setNotifications((prev) => ({ ...prev, serviceUpdates: checked }))
                      toast({
                        title: checked ? "Atualizações ativadas" : "Atualizações desativadas",
                        description: `Notificações de serviços ${checked ? "ativadas" : "desativadas"}.`,
                      })
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Privacidade</CardTitle>
                <p className="text-gray-600">Controle quais informações são visíveis para outros usuários</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show-phone">Mostrar Telefone</Label>
                    <p className="text-sm text-gray-500">Permitir que outros usuários vejam seu telefone</p>
                  </div>
                  <Switch
                    id="show-phone"
                    checked={privacy.showPhone}
                    onCheckedChange={(checked) => setPrivacy((prev) => ({ ...prev, showPhone: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show-email">Mostrar E-mail</Label>
                    <p className="text-sm text-gray-500">Permitir que outros usuários vejam seu e-mail</p>
                  </div>
                  <Switch
                    id="show-email"
                    checked={privacy.showEmail}
                    onCheckedChange={(checked) => setPrivacy((prev) => ({ ...prev, showEmail: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show-location">Mostrar Localização</Label>
                    <p className="text-sm text-gray-500">Permitir que outros usuários vejam sua localização</p>
                  </div>
                  <Switch
                    id="show-location"
                    checked={privacy.showLocation}
                    onCheckedChange={(checked) => setPrivacy((prev) => ({ ...prev, showLocation: checked }))}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Alterar Senha
                </CardTitle>
                <p className="text-gray-600">Mantenha sua conta segura com uma senha forte</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="current-password">Senha Atual</Label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showCurrentPassword ? "text" : "password"}
                      value={securityData.currentPassword}
                      onChange={(e) => handleSecurityChange("currentPassword", e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="new-password">Nova Senha</Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      value={securityData.newPassword}
                      onChange={(e) => handleSecurityChange("newPassword", e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={securityData.confirmPassword}
                      onChange={(e) => handleSecurityChange("confirmPassword", e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <Button onClick={handleChangePassword}>Alterar Senha</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Verificação em Duas Etapas</CardTitle>
                <p className="text-gray-600">Adicione uma camada extra de segurança à sua conta</p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Autenticação em Duas Etapas</Label>
                    <p className="text-sm text-gray-500">Usar SMS ou app autenticador</p>
                  </div>
                  <Button variant="outline" onClick={handleTwoFactorSetup} className="bg-transparent">
                    {securityData.twoFactorEnabled ? "Configurado" : "Configurar"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Métodos de Pagamento
                </CardTitle>
                <p className="text-gray-600">
                  {userType === "prestador"
                    ? "Gerencie como você recebe pagamentos"
                    : "Gerencie seus métodos de pagamento"}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-6 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">
                        PIX
                      </div>
                      <div>
                        <p className="font-medium">PIX</p>
                        <p className="text-sm text-gray-500">{paymentData.pixKey}</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Principal</Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label htmlFor="pix-key">Chave PIX</Label>
                    <Input
                      id="pix-key"
                      value={paymentData.pixKey}
                      onChange={(e) => handlePaymentChange("pixKey", e.target.value)}
                      placeholder="Digite sua chave PIX"
                    />
                  </div>

                  <div>
                    <Label htmlFor="preferred-method">Método Preferido</Label>
                    <Select
                      value={paymentData.preferredMethod}
                      onValueChange={(value) => handlePaymentChange("preferredMethod", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o método preferido" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pix">PIX</SelectItem>
                        <SelectItem value="bank">Transferência Bancária</SelectItem>
                        <SelectItem value="card">Cartão de Crédito</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button variant="outline" className="w-full bg-transparent" onClick={handleAddPaymentMethod}>
                  Adicionar Método de Pagamento
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Histórico de Pagamentos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b">
                    <div>
                      <p className="font-medium">
                        {userType === "prestador"
                          ? "Serviço de Pintura - Maria Silva"
                          : "Pagamento - Serviço de Limpeza"}
                      </p>
                      <p className="text-sm text-gray-500">15/12/2024</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${userType === "prestador" ? "text-green-600" : "text-red-600"}`}>
                        {userType === "prestador" ? "+ R$ 240,00" : "- R$ 180,00"}
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        Concluído
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <div>
                      <p className="font-medium">
                        {userType === "prestador" ? "Reparos Gerais - Carlos Mendes" : "Pagamento - Serviço de Pintura"}
                      </p>
                      <p className="text-sm text-gray-500">10/12/2024</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${userType === "prestador" ? "text-green-600" : "text-red-600"}`}>
                        {userType === "prestador" ? "+ R$ 180,00" : "- R$ 240,00"}
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        Concluído
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  )
}

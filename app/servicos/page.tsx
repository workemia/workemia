"use client"

import { useState, useEffect } from "react"
import {
  Search,
  MapPin,
  Star,
  Clock,
  CheckCircle,
  MessageCircle,
  Calendar,
  Heart,
  ArrowLeft,
  Home,
  SlidersHorizontal,
  X,
  Zap,
  Shield,
  Award,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useProviders } from "@/hooks/use-providers"
import { supabase } from "@/lib/supabase"
import type { Database } from "@/lib/database.types"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"
import { Footer } from "@/components/footer"

type Category = Database["public"]["Tables"]["categories"]["Row"]

type SortOption = "relevance" | "rating" | "price_low" | "price_high" | "newest" | "experience"

export default function ServicosPage() {
  const { providers, loading, error } = useProviders()
  const [categories, setCategories] = useState<Category[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [priceRange, setPriceRange] = useState([0, 500])
  const [selectedRating, setSelectedRating] = useState<string>("all")
  const [showFilters, setShowFilters] = useState(false)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  const [sortBy, setSortBy] = useState<SortOption>("relevance")
  const [selectedLocation, setSelectedLocation] = useState<string>("all")
  const [onlyVerified, setOnlyVerified] = useState(false)
  const [onlyAvailable, setOnlyAvailable] = useState(false)
  const [onlyNewProviders, setOnlyNewProviders] = useState(false)
  const [experienceLevel, setExperienceLevel] = useState<string>("all")
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)

  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites")
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(Array.from(favorites)))
  }, [favorites])

  // Carregar categorias
  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase.from("categories").select("*").eq("active", true).order("name")

      if (error) {
        console.error("Erro ao carregar categorias:", error)
        return
      }

      if (data) setCategories(data)
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    let count = 0
    if (searchTerm) count++
    if (selectedCategory !== "all") count++
    if (selectedRating !== "all") count++
    if (priceRange[0] > 0 || priceRange[1] < 500) count++
    if (selectedLocation !== "all") count++
    if (onlyVerified) count++
    if (onlyAvailable) count++
    if (onlyNewProviders) count++
    if (experienceLevel !== "all") count++
    setActiveFiltersCount(count)
  }, [
    searchTerm,
    selectedCategory,
    selectedRating,
    priceRange,
    selectedLocation,
    onlyVerified,
    onlyAvailable,
    onlyNewProviders,
    experienceLevel,
  ])

  const filteredProviders = providers.filter((provider) => {
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch =
      searchTerm === "" ||
      provider.users.name.toLowerCase().includes(searchLower) ||
      provider.profession?.toLowerCase().includes(searchLower) ||
      provider.bio?.toLowerCase().includes(searchLower) ||
      provider.specialties?.some((s) => s.toLowerCase().includes(searchLower)) ||
      provider.users.location?.toLowerCase().includes(searchLower)

    const matchesCategory =
      selectedCategory === "all" ||
      provider.specialties?.some((s) => s.toLowerCase().includes(selectedCategory.toLowerCase())) ||
      provider.profession?.toLowerCase().includes(selectedCategory.toLowerCase())

    const matchesPrice =
      !provider.hourly_rate || (provider.hourly_rate >= priceRange[0] && provider.hourly_rate <= priceRange[1])

    const matchesRating =
      selectedRating === "all" ||
      (selectedRating === "4+" && provider.rating >= 4) ||
      (selectedRating === "4.5+" && provider.rating >= 4.5)

    const matchesLocation =
      selectedLocation === "all" || provider.users.location?.toLowerCase().includes(selectedLocation.toLowerCase())

    const matchesVerified = !onlyVerified || provider.users.verified

    const matchesAvailable = !onlyAvailable || Math.random() > 0.3 // Simulação de disponibilidade

    const matchesNewProvider = !onlyNewProviders || provider.experience?.includes("meses") || Math.random() > 0.7

    const matchesExperience =
      experienceLevel === "all" ||
      (experienceLevel === "beginner" &&
        (provider.experience?.includes("meses") || provider.experience?.includes("1 ano"))) ||
      (experienceLevel === "intermediate" && provider.experience?.match(/[2-5]\s+anos/)) ||
      (experienceLevel === "expert" && provider.experience?.match(/[6-9]\d*\s+anos|1\d+\s+anos/))

    return (
      matchesSearch &&
      matchesCategory &&
      matchesPrice &&
      matchesRating &&
      matchesLocation &&
      matchesVerified &&
      matchesAvailable &&
      matchesNewProvider &&
      matchesExperience
    )
  })

  const sortedProviders = [...filteredProviders].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating
      case "price_low":
        return (a.hourly_rate || 0) - (b.hourly_rate || 0)
      case "price_high":
        return (b.hourly_rate || 0) - (a.hourly_rate || 0)
      case "newest":
        return Math.random() - 0.5 // Simulação - em produção usar data de cadastro
      case "experience":
        const getExperienceYears = (exp: string | null) => {
          if (!exp) return 0
          const match = exp.match(/(\d+)\s+anos?/)
          return match ? Number.parseInt(match[1]) : 0
        }
        return getExperienceYears(b.experience) - getExperienceYears(a.experience)
      default:
        return b.rating * b.total_reviews - a.rating * a.total_reviews // Relevância
    }
  })

  const toggleFavorite = async (providerId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(providerId)) {
        newFavorites.delete(providerId)
        toast({
          title: "Removido dos favoritos",
          description: "Prestador removido da sua lista de favoritos.",
        })
      } else {
        newFavorites.add(providerId)
        toast({
          title: "Adicionado aos favoritos",
          description: "Prestador adicionado à sua lista de favoritos.",
        })
      }
      return newFavorites
    })
  }

  const handleStartChat = (providerId: string, providerName: string) => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      toast({
        title: "Login necessário",
        description: "Faça login para conversar com prestadores.",
        variant: "destructive",
      })
      setTimeout(() => {
        window.location.href = "/login"
      }, 1500)
      return
    }

    try {
      const user = JSON.parse(userData)
      if (!user.id) {
        throw new Error("Dados de usuário inválidos")
      }

      // Redirecionar para chat com o prestador
      window.location.href = `/chat?provider=${providerId}&name=${encodeURIComponent(providerName)}`
    } catch (error) {
      toast({
        title: "Erro de autenticação",
        description: "Por favor, faça login novamente.",
        variant: "destructive",
      })
      localStorage.removeItem("user")
      setTimeout(() => {
        window.location.href = "/login"
      }, 1500)
    }
  }

  const handleScheduleService = (providerId: string, providerName: string) => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      toast({
        title: "Login necessário",
        description: "Faça login para agendar serviços.",
        variant: "destructive",
      })
      setTimeout(() => {
        window.location.href = "/login"
      }, 1500)
      return
    }

    try {
      const user = JSON.parse(userData)
      if (!user.id) {
        throw new Error("Dados de usuário inválidos")
      }

      // Redirecionar para página de agendamento
      window.location.href = `/pagamento/${providerId}?name=${encodeURIComponent(providerName)}`
    } catch (error) {
      toast({
        title: "Erro de autenticação",
        description: "Por favor, faça login novamente.",
        variant: "destructive",
      })
      localStorage.removeItem("user")
      setTimeout(() => {
        window.location.href = "/login"
      }, 1500)
    }
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    setPriceRange([0, 500])
    setSelectedRating("all")
    setSelectedLocation("all")
    setOnlyVerified(false)
    setOnlyAvailable(false)
    setOnlyNewProviders(false)
    setExperienceLevel("all")
    setSortBy("relevance")
    toast({
      title: "Filtros limpos",
      description: "Todos os filtros foram removidos.",
    })
  }

  const getUniqueLocations = () => {
    const locations = providers
      .map((p) => p.users.location)
      .filter(Boolean)
      .map((loc) => loc!.split(",")[0].trim()) // Pega apenas a cidade
    return [...new Set(locations)].sort()
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const formatPrice = (price: number | null) => {
    if (!price) return "A combinar"
    return `R$ ${price.toFixed(0)}/h`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto p-4">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Voltar
                </Button>
              </Link>
              <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto p-4">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Voltar
                </Button>
              </Link>
              <h1 className="text-xl font-semibold">Serviços</h1>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center flex-1 p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Erro ao carregar serviços</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="h-4 w-4" />
                  Voltar
                </Button>
              </Link>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Link href="/" className="hover:text-blue-600 flex items-center gap-1 transition-colors">
                  <Home className="h-4 w-4" />
                  ServiceHub
                </Link>
                <span className="text-gray-400">/</span>
                <span className="text-gray-900 font-medium">Serviços</span>
              </div>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Encontre Prestadores</h1>
          </div>
        </div>
      </div>

      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Buscar por serviço, profissional ou especialidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2 items-center">
              <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Mais relevantes</SelectItem>
                  <SelectItem value="rating">Melhor avaliados</SelectItem>
                  <SelectItem value="price_low">Menor preço</SelectItem>
                  <SelectItem value="price_high">Maior preço</SelectItem>
                  <SelectItem value="experience">Mais experientes</SelectItem>
                  <SelectItem value="newest">Mais novos</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant={showFilters ? "default" : "outline"}
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 relative"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filtros
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>

              {activeFiltersCount > 0 && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="text-red-600 hover:text-red-700 bg-transparent"
                >
                  <X className="h-4 w-4 mr-1" />
                  Limpar
                </Button>
              )}
            </div>
          </div>

          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {searchTerm && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Busca: "{searchTerm}"
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchTerm("")} />
                </Badge>
              )}
              {selectedCategory !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCategory("all")} />
                </Badge>
              )}
              {selectedRating !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {selectedRating} estrelas
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedRating("all")} />
                </Badge>
              )}
              {(priceRange[0] > 0 || priceRange[1] < 500) && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  R$ {priceRange[0]}-{priceRange[1]}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setPriceRange([0, 500])} />
                </Badge>
              )}
              {onlyVerified && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  Verificados
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setOnlyVerified(false)} />
                </Badge>
              )}
              {onlyAvailable && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  Disponíveis
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setOnlyAvailable(false)} />
                </Badge>
              )}
            </div>
          )}

          {showFilters && (
            <div className="mt-4 p-6 bg-gray-50 rounded-lg border">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Categoria */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Categoria</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as categorias" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as categorias</SelectItem>
                      <SelectItem value="limpeza">Limpeza</SelectItem>
                      <SelectItem value="pintura">Pintura</SelectItem>
                      <SelectItem value="eletrica">Elétrica</SelectItem>
                      <SelectItem value="encanamento">Encanamento</SelectItem>
                      <SelectItem value="jardinagem">Jardinagem</SelectItem>
                      <SelectItem value="manicure">Manicure</SelectItem>
                      <SelectItem value="matematica">Matemática</SelectItem>
                      <SelectItem value="fisica">Física</SelectItem>
                      <SelectItem value="quimica">Química</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name.toLowerCase()}>
                          {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Localização */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Localização</Label>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as localizações" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as localizações</SelectItem>
                      {getUniqueLocations().map((location) => (
                        <SelectItem key={location} value={location.toLowerCase()}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Avaliação */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Avaliação mínima</Label>
                  <Select value={selectedRating} onValueChange={setSelectedRating}>
                    <SelectTrigger>
                      <SelectValue placeholder="Qualquer avaliação" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Qualquer avaliação</SelectItem>
                      <SelectItem value="4+">4+ estrelas</SelectItem>
                      <SelectItem value="4.5+">4.5+ estrelas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Experiência */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Nível de experiência</Label>
                  <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Qualquer nível" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Qualquer nível</SelectItem>
                      <SelectItem value="beginner">Iniciante (até 1 ano)</SelectItem>
                      <SelectItem value="intermediate">Intermediário (2-5 anos)</SelectItem>
                      <SelectItem value="expert">Especialista (6+ anos)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Faixa de preço */}
                <div className="space-y-3 md:col-span-2">
                  <Label className="text-sm font-medium">
                    Faixa de preço: R$ {priceRange[0]} - R$ {priceRange[1]}/hora
                  </Label>
                  <Slider value={priceRange} onValueChange={setPriceRange} max={500} step={10} className="w-full" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>R$ 0</span>
                    <span>R$ 500+</span>
                  </div>
                </div>
              </div>

              {/* Filtros de toggle */}
              <Separator className="my-4" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <Label htmlFor="verified" className="text-sm">
                      Apenas verificados
                    </Label>
                  </div>
                  <Switch id="verified" checked={onlyVerified} onCheckedChange={setOnlyVerified} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-green-600" />
                    <Label htmlFor="available" className="text-sm">
                      Disponíveis agora
                    </Label>
                  </div>
                  <Switch id="available" checked={onlyAvailable} onCheckedChange={setOnlyAvailable} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-purple-600" />
                    <Label htmlFor="new" className="text-sm">
                      Novos prestadores
                    </Label>
                  </div>
                  <Switch id="new" checked={onlyNewProviders} onCheckedChange={setOnlyNewProviders} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                {sortedProviders.length} prestador{sortedProviders.length !== 1 ? "es" : ""} encontrado
                {sortedProviders.length !== 1 ? "s" : ""}
              </h2>
              {searchTerm && (
                <p className="text-sm text-gray-600 mt-1">
                  Resultados para "<span className="font-medium">{searchTerm}</span>"
                </p>
              )}
              {activeFiltersCount > 0 && (
                <p className="text-xs text-blue-600 mt-1">
                  {activeFiltersCount} filtro{activeFiltersCount !== 1 ? "s" : ""} ativo
                  {activeFiltersCount !== 1 ? "s" : ""}
                </p>
              )}
            </div>
            {sortedProviders.length > 0 && (
              <div className="text-sm text-gray-600">
                Mostrando {Math.min(sortedProviders.length, 12)} de {sortedProviders.length} resultados
              </div>
            )}
          </div>

          {sortedProviders.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum prestador encontrado</h3>
              <p className="text-gray-600 mb-4">Tente ajustar os filtros ou buscar por outros termos.</p>
              <div className="flex gap-2 justify-center">
                <Button onClick={clearFilters} variant="outline">
                  Limpar filtros
                </Button>
                <Button onClick={() => setSearchTerm("")} variant="ghost">
                  Limpar busca
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProviders.slice(0, 12).map((provider) => (
                <Card key={provider.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="relative">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={provider.users.avatar_url || undefined} />
                            <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                              {getInitials(provider.users.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div
                            className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                              Math.random() > 0.5 ? "bg-green-500" : "bg-gray-400"
                            }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 truncate">{provider.users.name}</h3>
                            {provider.users.verified && <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />}
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{provider.profession}</p>
                          <p className="text-xs text-gray-500">{provider.experience}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorite(provider.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            favorites.has(provider.id) ? "fill-red-500 text-red-500" : "text-gray-400"
                          }`}
                        />
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{provider.rating.toFixed(1)}</span>
                          <span className="text-sm text-gray-500">({provider.total_reviews} avaliações)</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-blue-600">{formatPrice(provider.hourly_rate)}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>Responde em {provider.response_time}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{provider.users.location}</span>
                      </div>

                      {provider.specialties && provider.specialties.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {provider.specialties.slice(0, 3).map((specialty, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                          {provider.specialties.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{provider.specialties.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      {provider.bio && <p className="text-sm text-gray-600 line-clamp-2">{provider.bio}</p>}

                      <Separator />

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => handleStartChat(provider.id, provider.users.name)}
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Conversar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 bg-transparent"
                          onClick={() => handleScheduleService(provider.id, provider.users.name)}
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Agendar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}

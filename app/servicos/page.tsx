"use client"

import { useState, useEffect } from "react"
import { Search, MapPin, Filter, Star, Clock, CheckCircle, MessageCircle, Calendar, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { InteractiveMap } from "@/components/interactive-map"
import { useProviders } from "@/hooks/use-providers"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabase"
import type { Database } from "@/lib/database.types"

type Category = Database["public"]["Tables"]["categories"]["Row"]

export default function ServicosPage() {
  const { providers, loading, error } = useProviders()
  const { user, isAuthenticated } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [priceRange, setPriceRange] = useState([0, 500])
  const [selectedRating, setSelectedRating] = useState<string>("all")
  const [showMap, setShowMap] = useState(false)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  // Carregar categorias
  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase.from("categories").select("*").eq("active", true).order("name")

      if (data) setCategories(data)
    }
    fetchCategories()
  }, [])

  // Filtrar prestadores
  const filteredProviders = providers.filter((provider) => {
    const matchesSearch =
      provider.users.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.profession?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.specialties?.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory =
      selectedCategory === "all" || provider.specialties?.some((s) => s.toLowerCase().includes(selectedCategory))

    const matchesPrice =
      !provider.hourly_rate || (provider.hourly_rate >= priceRange[0] && provider.hourly_rate <= priceRange[1])

    const matchesRating =
      selectedRating === "all" ||
      (selectedRating === "4+" && provider.rating >= 4) ||
      (selectedRating === "4.5+" && provider.rating >= 4.5)

    return matchesSearch && matchesCategory && matchesPrice && matchesRating
  })

  const toggleFavorite = (providerId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(providerId)) {
        newFavorites.delete(providerId)
      } else {
        newFavorites.add(providerId)
      }
      return newFavorites
    })
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
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erro ao carregar serviços</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header de busca melhorado */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto p-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Descubra Serviços Incríveis</h1>
            <p className="text-lg opacity-90">Encontre o profissional perfeito para suas necessidades</p>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-4 max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Ex: limpeza, pintura, aulas de inglês..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 text-lg bg-white/95 border-0 shadow-lg"
              />
            </div>
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 h-12 font-semibold"
              onClick={() => setSearchTerm(searchTerm)}
            >
              <Search className="h-5 w-5 mr-2" />
              Buscar
            </Button>
          </div>
        </div>
      </div>
      
      {/* Filtros aprimorados */}
      <div className="bg-white border-b shadow-sm sticky top-16 z-40">
        <div className="max-w-7xl mx-auto p-4">

          <div className="flex flex-col md:flex-row gap-4">
            {/* Categorias rápidas */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filtros Rápidos</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {['limpeza', 'reparos', 'pintura', 'técnico', 'beleza', 'educação'].map((cat) => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(selectedCategory === cat ? "all" : cat)}
                    className="capitalize"
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={showMap ? "default" : "outline"}
                onClick={() => setShowMap(!showMap)}
                className="flex items-center gap-2"
              >
                <MapPin className="h-4 w-4" />
                {showMap ? "Lista" : "Mapa"}
              </Button>
            </div>
          </div>
          
          {/* Filtros detalhados */}
          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t">
            <Select value={selectedRating} onValueChange={setSelectedRating}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Avaliação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="4+">⭐ 4+ estrelas</SelectItem>
                <SelectItem value="4.5+">⭐ 4.5+ estrelas</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-3 min-w-60">
              <span className="text-sm font-medium text-gray-700">Faixa de preço:</span>
              <Slider value={priceRange} onValueChange={setPriceRange} max={500} step={10} className="flex-1" />
              <span className="text-sm font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded min-w-24 text-center">
                R$ {priceRange[0]}-{priceRange[1]}/h
              </span>
            </div>
            
            <Button variant="outline" size="sm" onClick={() => {
              setSelectedCategory("all")
              setSelectedRating("all")
              setPriceRange([0, 500])
              setSearchTerm("")
            }}>
              Limpar Filtros
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        {showMap ? (
          <div className="h-[600px] rounded-lg overflow-hidden">
            <InteractiveMap providers={filteredProviders} />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Resultados com estatísticas */}
            <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {filteredProviders.length} {filteredProviders.length === 1 ? 'prestador encontrado' : 'prestadores encontrados'}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {searchTerm && `Resultados para "${searchTerm}"`}
                    {selectedCategory !== "all" && ` na categoria ${selectedCategory}`}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>{Math.floor(filteredProviders.length * 0.7)} online agora</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span>Avaliação média: 4.8</span>
                  </div>
                </div>
              </div>
            </div>

            {filteredProviders.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum prestador encontrado</h3>
                <p className="text-gray-600">Tente ajustar os filtros ou buscar por outros termos.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProviders.slice(0, 8).map((provider) => (
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
                              {provider.users.verified && (
                                <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />
                              )}
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
                          {isAuthenticated ? (
                            <>
                              <Button size="sm" className="flex-1">
                                <MessageCircle className="h-4 w-4 mr-2" />
                                Conversar
                              </Button>
                              <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                                <Calendar className="h-4 w-4 mr-2" />
                                Contratar
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button 
                                size="sm" 
                                className="flex-1"
                                onClick={() => window.location.href = '/login'}
                              >
                                <MessageCircle className="h-4 w-4 mr-2" />
                                Entrar para Conversar
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="flex-1 bg-transparent"
                                onClick={() => window.location.href = '/login'}
                              >
                                <Calendar className="h-4 w-4 mr-2" />
                                Entrar para Contratar
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

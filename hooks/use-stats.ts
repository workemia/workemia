"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

interface Stats {
  totalUsers: number
  totalProviders: number
  completedServices: number
  averageRating: number
  onlineProviders: number
  activeRequests: number
}

export function useStats() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalProviders: 0,
    completedServices: 0,
    averageRating: 0,
    onlineProviders: 0,
    activeRequests: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        // Contar usuários totais
        const { count: usersCount } = await supabase
          .from("users")
          .select("*", { count: "exact", head: true })

        // Contar prestadores
        const { count: providersCount } = await supabase
          .from("providers")
          .select("*", { count: "exact", head: true })

        // Contar serviços concluídos
        const { count: completedCount } = await supabase
          .from("service_requests")
          .select("*", { count: "exact", head: true })
          .eq("status", "completed")

        // Calcular avaliação média
        const { data: ratingsData } = await supabase
          .from("providers")
          .select("rating")
          .gt("rating", 0)

        let averageRating = 0
        if (ratingsData && ratingsData.length > 0) {
          const sum = ratingsData.reduce((acc, curr) => acc + ((curr as any).rating || 0), 0)
          averageRating = sum / ratingsData.length
        }

        // Simular prestadores online (70% dos prestadores)
        const onlineProviders = Math.floor((providersCount || 0) * 0.7)

        // Contar solicitações ativas
        const { count: activeRequestsCount } = await supabase
          .from("service_requests")
          .select("*", { count: "exact", head: true })
          .in("status", ["pending", "accepted", "in_progress"])

        setStats({
          totalUsers: usersCount || 0,
          totalProviders: providersCount || 0,
          completedServices: completedCount || 0,
          averageRating: Math.round(averageRating * 10) / 10,
          onlineProviders,
          activeRequests: activeRequestsCount || 0
        })
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
    
    // Atualizar a cada 30 segundos
    const interval = setInterval(fetchStats, 30000)
    
    return () => clearInterval(interval)
  }, [])

  return { stats, loading }
}
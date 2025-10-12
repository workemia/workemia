"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { Database } from "@/lib/database.types"

type Provider = Database["public"]["Tables"]["providers"]["Row"] & {
  users: Database["public"]["Tables"]["users"]["Row"]
}

export function useProviders() {
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProviders = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("providers")
        .select(`
          *,
          users (*)
        `)
        .eq("users.active", true)
        .order("rating", { ascending: false })

      if (error) throw error

      setProviders(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar prestadores")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProviders()
  }, [])

  return { providers, loading, error, refetch: fetchProviders }
}

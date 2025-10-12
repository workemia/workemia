"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { Database } from "@/lib/database.types"

type CalendarEvent = Database["public"]["Tables"]["calendar_events"]["Row"]

export function useCalendarEvents(providerId?: string) {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!providerId) return

    async function fetchEvents() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from("calendar_events")
          .select("*")
          .eq("provider_id", providerId)
          .order("start_time", { ascending: true })

        if (error) throw error

        setEvents(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar eventos")
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [providerId])

  const addEvent = async (event: Omit<CalendarEvent, "id" | "created_at">) => {
    try {
      // @ts-ignore - Database types need regeneration
      const { data, error } = await supabase.from("calendar_events").insert([event]).select().single()

      if (error) throw error

      setEvents((prev) => [...prev, data])
      return data
    } catch (err) {
      console.error("Erro ao adicionar evento:", err)
      throw err
    }
  }

  const updateEvent = async (id: string, updates: Partial<CalendarEvent>) => {
    try {
      // @ts-ignore - Database types need regeneration
      const { data, error } = await supabase.from("calendar_events").update(updates).eq("id", id).select().single()

      if (error) throw error

      setEvents((prev) => prev.map((e) => (e.id === id ? data : e)))
      return data
    } catch (err) {
      console.error("Erro ao atualizar evento:", err)
      throw err
    }
  }

  const deleteEvent = async (id: string) => {
    try {
      const { error } = await supabase.from("calendar_events").delete().eq("id", id)

      if (error) throw error

      setEvents((prev) => prev.filter((e) => e.id !== id))
    } catch (err) {
      console.error("Erro ao deletar evento:", err)
      throw err
    }
  }

  return {
    events,
    loading,
    error,
    addEvent,
    updateEvent,
    deleteEvent,
  }
}

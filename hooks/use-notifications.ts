"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { Database } from "@/lib/database.types"

type Notification = Database["public"]["Tables"]["notifications"]["Row"]

export function useNotifications(userId?: string) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return

    async function fetchNotifications() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(50)

        if (error) throw error

        setNotifications(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar notificações")
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()

    // Subscribe to real-time notifications
    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setNotifications((prev) => [payload.new as Notification, ...prev])
          } else if (payload.eventType === "UPDATE") {
            setNotifications((prev) => prev.map((n) => (n.id === payload.new.id ? (payload.new as Notification) : n)))
          } else if (payload.eventType === "DELETE") {
            setNotifications((prev) => prev.filter((n) => n.id !== payload.old.id))
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  const markAsRead = async (notificationId: string) => {
    try {
      // @ts-ignore - Database types need regeneration
      const { error } = await supabase.from("notifications").update({ read: true }).eq("id", notificationId)

      if (error) throw error

      setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)))
    } catch (err) {
      console.error("Erro ao marcar notificação como lida:", err)
    }
  }

  const markAllAsRead = async () => {
    if (!userId) return

    try {
      // @ts-ignore - Database types need regeneration
      const { error } = await supabase
        .from("notifications")
        // @ts-ignore
        .update({ read: true })
        .eq("user_id", userId)
        .eq("read", false)

      if (error) throw error

      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    } catch (err) {
      console.error("Erro ao marcar todas as notificações como lidas:", err)
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return {
    notifications,
    loading,
    error,
    unreadCount,
    markAsRead,
    markAllAsRead,
  }
}

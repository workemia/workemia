"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth"
import { auth, isFirebaseConfigured } from "@/lib/firebase"
import { supabase } from "@/lib/supabase"

export interface AuthUser {
  id: string
  email: string
  name: string
  userType: "cliente" | "prestador"
  avatar?: string
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  error: string | null
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      console.warn("[v0] Firebase não configurado")
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth!, async (firebaseUser: FirebaseUser | null) => {
      console.log("[v0] Auth state changed:", firebaseUser?.email)

      if (firebaseUser) {
        try {
          const { data: existingUser } = await supabase
            .from("users")
            .select("*")
            .eq("email", firebaseUser.email)
            .single()

          if (existingUser) {
            setUser({
              id: existingUser.id,
              email: existingUser.email,
              name: existingUser.name,
              userType: existingUser.user_type,
              avatar: existingUser.avatar_url,
            })
          } else {
            // Usuário não existe no Supabase, criar um básico
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email!,
              name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Usuário",
              userType: "cliente",
              avatar: firebaseUser.photoURL || undefined,
            })
          }
          setError(null)
        } catch (err) {
          console.error("[v0] Erro ao buscar usuário:", err)
          setError("Erro ao carregar dados do usuário")
        }
      } else {
        setUser(null)
        setError(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signOut = async () => {
    try {
      if (isFirebaseConfigured() && auth) {
        await auth.signOut()
      }
      setUser(null)
      setError(null)
    } catch (err) {
      console.error("[v0] Erro ao fazer logout:", err)
      setError("Erro ao fazer logout")
    }
  }

  return <AuthContext.Provider value={{ user, loading, error, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

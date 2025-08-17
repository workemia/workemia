"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client"
import type { User, AuthState } from "@/lib/types"

interface AuthContextType extends AuthState {
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  })

  const supabase = getSupabaseClient()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        if (isSupabaseConfigured) {
          try {
            const { data: existingUser } = await supabase
              .from("users")
              .select("*")
              .eq("firebase_uid", firebaseUser.uid)
              .single()

            let user: User

            if (!existingUser) {
              // Create new user in Supabase
              const { data: newUser, error } = await supabase
                .from("users")
                .insert({
                  firebase_uid: firebaseUser.uid,
                  email: firebaseUser.email!,
                  display_name: firebaseUser.displayName,
                })
                .select()
                .single()

              if (error) throw error
              user = newUser
            } else {
              user = existingUser
            }

            setState({ user, loading: false, error: null })
          } catch (error) {
            console.error("Error syncing user:", error)
            setState({ user: null, loading: false, error: "Failed to sync user data" })
          }
        } else {
          const user: User = {
            id: firebaseUser.uid,
            firebase_uid: firebaseUser.uid,
            email: firebaseUser.email!,
            display_name: firebaseUser.displayName,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
          setState({ user, loading: false, error: null })
        }
      } else {
        setState({ user: null, loading: false, error: null })
      }
    })

    return () => unsubscribe()
  }, [supabase])

  const signOut = async () => {
    try {
      await auth.signOut()
      setState({ user: null, loading: false, error: null })
    } catch (error) {
      console.error("Error signing out:", error)
      setState((prev) => ({ ...prev, error: "Failed to sign out" }))
    }
  }

  return <AuthContext.Provider value={{ ...state, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

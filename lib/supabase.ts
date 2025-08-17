import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "./database.types"

// Check if Supabase environment variables are available
export const isSupabaseConfigured =
  typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.length > 0 &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== "your_supabase_url" &&
  typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 0 &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== "your_supabase_anon_key"

// Create a singleton instance of the Supabase client
let supabaseInstance: ReturnType<typeof createBrowserClient<Database>> | null = null

export function getSupabaseClient() {
  if (!isSupabaseConfigured) {
    console.warn("Supabase environment variables are not properly configured")
    return {
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        signUp: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
        signInWithPassword: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
        signOut: () => Promise.resolve({ error: null }),
      },
      from: (table: string) => {
        // Mock data for categories table
        const mockCategories = [
          { id: 1, name: "Limpeza", active: true },
          { id: 2, name: "Pintura", active: true },
          { id: 3, name: "Elétrica", active: true },
          { id: 4, name: "Encanamento", active: true },
          { id: 5, name: "Jardinagem", active: true },
        ]

        return {
          select: (columns: string) => ({
            eq: (column: string, value: any) => ({
              order: (orderBy: string) =>
                Promise.resolve({
                  data: table === "categories" ? mockCategories : [],
                  error: null,
                }),
            }),
          }),
          insert: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
          update: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
          delete: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
        }
      },
    } as any
  }

  if (!supabaseInstance) {
    supabaseInstance = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
  }
  return supabaseInstance
}

// Export the main client
export const supabase = getSupabaseClient()

export const auth = {
  signUp: async (email: string, password: string, userData?: any) => {
    const client = getSupabaseClient()
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: userData,
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || window.location.origin,
      },
    })
    return { data, error }
  },

  signIn: async (email: string, password: string) => {
    const client = getSupabaseClient()
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  signOut: async () => {
    const client = getSupabaseClient()
    const { error } = await client.auth.signOut()
    return { error }
  },

  getCurrentUser: async () => {
    const client = getSupabaseClient()
    const {
      data: { user },
      error,
    } = await client.auth.getUser()
    return { user, error }
  },
}

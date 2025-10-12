import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

// Variáveis de ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Mock client para build time
const createMockClient = () => ({
  auth: {
    signUp: async () => ({ data: null, error: { message: 'Mock client' } }),
    signInWithPassword: async () => ({ data: null, error: { message: 'Mock client' } }),
    signOut: async () => ({ error: { message: 'Mock client' } }),
    getUser: async () => ({ data: { user: null }, error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
  from: () => ({
    select: () => Promise.resolve({ data: null, error: null }),
    insert: () => Promise.resolve({ data: null, error: null }),
    update: () => Promise.resolve({ data: null, error: null }),
    delete: () => Promise.resolve({ data: null, error: null }),
    eq: function() { return this },
    single: () => Promise.resolve({ data: null, error: null }),
    limit: function() { return this },
    order: function() { return this },
  }),
}) as any

// Singleton com validação
let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null

// Exportar supabase com validação
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : createMockClient()

// Singleton pattern for client-side
export function getSupabaseClient() {
  if (!supabaseInstance) {
    if (!supabaseUrl || !supabaseAnonKey) {
      return createMockClient()
    }
    supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey)
  }
  return supabaseInstance
}

// Server-side client
export function createServerClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return createMockClient()
  }
  return createClient<Database>(supabaseUrl, supabaseAnonKey)
}

// Auth helpers
export const auth = {
  signUp: async (email: string, password: string, userData: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    })
    return { data, error }
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  getCurrentUser: async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    return { user, error }
  },
}

import { createBrowserClient } from "@supabase/ssr"

function isValidSupabaseUrl(url: string): boolean {
  if (!url || url.length === 0) return false
  if (url.includes("your_supabase_url") || url.includes("placeholder")) return false
  try {
    new URL(url)
    return url.includes("supabase.co") || url.includes("localhost")
  } catch {
    return false
  }
}

function isValidSupabaseKey(key: string): boolean {
  if (!key || key.length === 0) return false
  if (key.includes("your_supabase_key") || key.includes("placeholder")) return false
  return key.length > 20 // Supabase keys are typically longer
}

// Check if Supabase environment variables are available and valid
export const isSupabaseConfigured =
  typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
  isValidSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "string" &&
  isValidSupabaseKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

export function createClient() {
  if (!isSupabaseConfigured) {
    console.warn("Supabase environment variables are not properly configured. Using dummy client.")
    return {
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        signInWithPassword: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
        signUp: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
        signOut: () => Promise.resolve({ error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      },
      from: (table: string) => ({
        select: (columns?: string) => ({
          eq: (column: string, value: any) => ({
            single: () => Promise.resolve({ data: null, error: null }),
            order: () => Promise.resolve({ data: [], error: null }),
          }),
          order: (column: string) => Promise.resolve({ data: [], error: null }),
        }),
        insert: (data: any) => Promise.resolve({ data: null, error: null }),
        update: (data: any) => ({
          eq: (column: string, value: any) => Promise.resolve({ data: null, error: null }),
        }),
        delete: () => ({
          eq: (column: string, value: any) => Promise.resolve({ data: null, error: null }),
        }),
      }),
    }
  }

  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
}

// Singleton instance
let client: ReturnType<typeof createClient> | null = null

export function getSupabaseClient() {
  if (!client) {
    client = createClient()
  }
  return client
}

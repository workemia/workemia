import { createBrowserClient } from "@supabase/ssr"

// Next.js mapeia ENV_NEXT_PUBLIC_* para NEXT_PUBLIC_* via next.config.mjs
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Validação para build time - retorna um mock se env vars não estão disponíveis
  if (!supabaseUrl || !supabaseAnonKey) {
    // Durante build/prerender, retornar um cliente mock que não faz nada
    // Isso evita erros durante static generation
    if (typeof window === 'undefined') {
      // Server-side durante build - retornar mock
      return {
        auth: {
          getSession: async () => ({ data: { session: null }, error: null }),
          getUser: async () => ({ data: { user: null }, error: null }),
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        },
        from: () => ({
          select: () => ({ data: null, error: null }),
          insert: () => ({ data: null, error: null }),
          update: () => ({ data: null, error: null }),
          delete: () => ({ data: null, error: null }),
        }),
      } as any
    }
    // Client-side sem env vars - erro mais informativo
    throw new Error('Supabase URL and Anon Key are required. Check your environment variables.')
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { cache } from "react"
import type { Database } from "../database.types"

function validateSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (
    !url ||
    !anonKey ||
    url === "your_supabase_url" ||
    anonKey === "your_supabase_anon_key" ||
    url.includes("your_") ||
    anonKey.includes("your_")
  ) {
    return false
  }

  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

function createDummyServerClient() {
  const dummyQueryBuilder = {
    select: () => dummyQueryBuilder,
    eq: () => dummyQueryBuilder,
    order: () => dummyQueryBuilder,
    limit: () => dummyQueryBuilder,
    single: () => Promise.resolve({ data: null, error: null }),
    insert: () => Promise.resolve({ data: null, error: null }),
    update: () => dummyQueryBuilder,
    then: (resolve: any) => resolve({ data: [], error: null }),
  }

  return {
    from: () => dummyQueryBuilder,
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    },
  }
}

export const createClient = cache(async () => {
  if (!validateSupabaseConfig()) {
    console.warn("[v0] Supabase not configured properly, using dummy server client")
    return createDummyServerClient() as any
  }

  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  )
})

export const isSupabaseConfigured = validateSupabaseConfig()

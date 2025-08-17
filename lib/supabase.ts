import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "./database.types"

function validateSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Check if variables exist and are not placeholder values
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

  // Basic URL format validation
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

function createDummyClient() {
  const dummyQueryBuilder = {
    select: () => dummyQueryBuilder,
    eq: () => dummyQueryBuilder,
    order: () => dummyQueryBuilder,
    limit: () => dummyQueryBuilder,
    insert: () => dummyQueryBuilder,
    update: () => dummyQueryBuilder,
    single: () => Promise.resolve({ data: null, error: null }),
    then: (resolve: any) => resolve({ data: [], error: null }),
  }

  const dummyChannel = {
    on: () => dummyChannel,
    subscribe: () => dummyChannel,
    unsubscribe: () => Promise.resolve({ error: null }),
  }

  return {
    from: () => dummyQueryBuilder,
    auth: {
      signInWithPassword: () =>
        Promise.resolve({ data: { user: null }, error: { message: "Supabase not configured" } }),
      signUp: () => Promise.resolve({ data: { user: null }, error: { message: "Supabase not configured" } }),
      signOut: () => Promise.resolve({ error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    },
    channel: () => dummyChannel,
    removeChannel: () => Promise.resolve({ error: null }),
  }
}

export function createClient() {
  if (validateSupabaseConfig()) {
    return createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
  }

  console.warn("[v0] Supabase not configured properly, using dummy client")
  return createDummyClient() as any
}

// Export the main client
export const supabase = createClient()

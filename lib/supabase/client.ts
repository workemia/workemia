import { createBrowserClient } from "@supabase/ssr"

// Next.js mapeia ENV_NEXT_PUBLIC_* para NEXT_PUBLIC_* via next.config.mjs
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

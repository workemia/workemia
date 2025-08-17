import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error("Auth callback error:", error)
      return NextResponse.redirect(`${requestUrl.origin}/login?error=auth_callback_error`)
    }

    if (data.user) {
      const { data: userData } = await supabase.from("users").select("user_type").eq("id", data.user.id).single()

      if (userData?.user_type === "provider") {
        return NextResponse.redirect(`${requestUrl.origin}/dashboard/prestador`)
      } else {
        return NextResponse.redirect(`${requestUrl.origin}/dashboard/cliente`)
      }
    }
  }

  return NextResponse.redirect(requestUrl.origin)
}

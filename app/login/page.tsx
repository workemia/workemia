import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import LoginForm from "@/components/login-form"

export default async function LoginPage() {
  // If Supabase is not configured, show setup message directly
  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-white">Connect Supabase to get started</h1>
          <p className="text-blue-100">Configure your Supabase integration in Project Settings</p>
        </div>
      </div>
    )
  }

  // Check if user is already logged in
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If user is logged in, redirect based on user type
  if (session) {
    const { data: userData } = await supabase.from("users").select("user_type").eq("id", session.user.id).single()

    if (userData?.user_type === "provider") {
      redirect("/dashboard/prestador")
    } else {
      redirect("/dashboard/cliente")
    }
  }

  return <LoginForm />
}

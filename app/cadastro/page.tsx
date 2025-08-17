import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import SignUpForm from "@/components/sign-up-form"

export default async function CadastroPage() {
  // If Supabase is not configured, show setup message directly
  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-xl p-8 text-center">
            <h1 className="text-2xl font-bold mb-4 text-gray-900">Connect Supabase to get started</h1>
          </div>
        </div>
      </div>
    )
  }

  // Check if user is already logged in
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If user is logged in, redirect to appropriate dashboard
  if (session) {
    const { data: userData } = await supabase
      .from("users")
      .select("user_type")
      .eq("firebase_uid", session.user.id)
      .single()

    if (userData?.user_type === "prestador") {
      redirect("/dashboard/prestador")
    } else {
      redirect("/dashboard/cliente")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">ServiceHub</h1>
            <p className="text-gray-600">Crie sua conta</p>
          </div>
          <SignUpForm />
        </div>
      </div>
    </div>
  )
}

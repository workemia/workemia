"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth"
import { auth, googleProvider, isFirebaseConfigured } from "@/lib/firebase"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"

export default function CadastroPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [userType, setUserType] = useState<"cliente" | "prestador">("cliente")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const syncUserWithSupabase = async (firebaseUser: any, selectedUserType: "cliente" | "prestador", name: string) => {
    console.log("[v0] Criando usuário no Supabase:", firebaseUser.email)

    // Criar usuário no Supabase
    const { data: newUser, error } = await supabase
      .from("users")
      .insert({
        id: firebaseUser.uid,
        email: firebaseUser.email,
        name: name || firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Usuário",
        user_type: selectedUserType,
        avatar_url: firebaseUser.photoURL,
        verified: firebaseUser.emailVerified,
        active: true,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Erro ao criar usuário no Supabase:", error)
      throw new Error("Erro ao criar conta")
    }

    // Se for prestador, criar perfil de prestador
    if (selectedUserType === "prestador") {
      await supabase.from("providers").insert({
        id: firebaseUser.uid,
        bio: "Novo prestador de serviços",
        experience: "iniciante",
        hourly_rate: 50,
        rating: 5,
        total_reviews: 0,
        completed_jobs: 0,
        acceptance_rate: 100,
        response_time: "< 1 hora",
        work_radius: 10,
        joined_year: new Date().getFullYear(),
      })
    }

    return newUser
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFirebaseConfigured()) {
      setError("Firebase não configurado")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem")
      return
    }

    if (formData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres")
      return
    }

    setLoading(true)
    setError("")

    try {
      console.log("[v0] Criando conta com email:", formData.email)
      const { user } = await createUserWithEmailAndPassword(auth!, formData.email, formData.password)

      await syncUserWithSupabase(user, userType, formData.name)
      console.log("[v0] Conta criada com sucesso:", formData.email)

      // Redirecionar baseado no tipo de usuário
      if (userType === "prestador") {
        router.push("/dashboard/prestador")
      } else {
        router.push("/dashboard/cliente")
      }
    } catch (err: any) {
      console.error("[v0] Erro ao criar conta:", err)

      if (err.code === "auth/email-already-in-use") {
        setError("Este email já está em uso. Tente fazer login.")
      } else if (err.code === "auth/invalid-email") {
        setError("Email inválido. Verifique o formato do email.")
      } else if (err.code === "auth/weak-password") {
        setError("Senha muito fraca. Use pelo menos 6 caracteres.")
      } else {
        setError("Erro ao criar conta. Tente novamente.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    if (!isFirebaseConfigured()) {
      setError("Firebase não configurado")
      return
    }

    setLoading(true)
    setError("")

    try {
      console.log("[v0] Criando conta com Google")
      const { user } = await signInWithPopup(auth!, googleProvider!)

      await syncUserWithSupabase(user, userType, user.displayName || "")
      console.log("[v0] Conta criada com Google:", user.email)

      // Redirecionar baseado no tipo de usuário
      if (userType === "prestador") {
        router.push("/dashboard/prestador")
      } else {
        router.push("/dashboard/cliente")
      }
    } catch (err: any) {
      console.error("[v0] Erro ao criar conta com Google:", err)

      if (err.code === "auth/unauthorized-domain") {
        setError("Domínio não autorizado. Configure o domínio no Firebase Console.")
      } else if (err.code === "auth/popup-closed-by-user") {
        setError("Cadastro cancelado pelo usuário.")
      } else if (err.code === "auth/popup-blocked") {
        setError("Pop-up bloqueado. Permita pop-ups para este site.")
      } else {
        setError("Erro ao criar conta com Google. Tente novamente.")
      }
    } finally {
      setLoading(false)
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

          <div className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Seletor de tipo de usuário */}
            <div className="flex space-x-2">
              <Button
                type="button"
                variant={userType === "cliente" ? "default" : "outline"}
                onClick={() => setUserType("cliente")}
                className="flex-1"
              >
                👤 Cliente
              </Button>
              <Button
                type="button"
                variant={userType === "prestador" ? "default" : "outline"}
                onClick={() => setUserType("prestador")}
                className="flex-1"
              >
                🔧 Prestador
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Seu nome completo"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="seu@email.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Mínimo 6 caracteres"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirmar senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Confirme sua senha"
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Criando conta..." : `Criar conta como ${userType === "cliente" ? "Cliente" : "Prestador"}`}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">Ou continue com</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignUp}
              disabled={loading}
              className="w-full bg-transparent"
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continuar com Google
            </Button>

            <div className="text-center text-sm">
              Já tem uma conta?{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                Faça login aqui
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

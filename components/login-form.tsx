"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, User, Briefcase, Mail, Lock, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth"
import { auth, googleProvider } from "@/lib/firebase"

export default function LoginForm() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("cliente")
  const [showClientPassword, setShowClientPassword] = useState(false)
  const [showProviderPassword, setShowProviderPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const userType = formData.get("userType") as string

    try {
      await signInWithEmailAndPassword(auth, email, password)
      // Redirect based on user type
      if (userType === "provider") {
        router.push("/dashboard/prestador")
      } else {
        router.push("/dashboard/cliente")
      }
    } catch (error: any) {
      setError("Email ou senha incorretos")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError("")

    try {
      await signInWithPopup(auth, googleProvider)
      router.push("/dashboard/cliente") // Default to client dashboard
    } catch (error: any) {
      setError("Erro ao fazer login com Google")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="cliente" className="text-sm flex items-center gap-2">
            <User className="w-4 h-4" />
            Cliente
          </TabsTrigger>
          <TabsTrigger value="prestador" className="text-sm flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Prestador
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cliente" className="space-y-4 mt-6">
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <input type="hidden" name="userType" value="client" />

            <div className="space-y-2">
              <Label htmlFor="client-email" className="text-sm font-medium">
                E-mail
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="client-email"
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="client-password" className="text-sm font-medium">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="client-password"
                  name="password"
                  type={showClientPassword ? "text" : "password"}
                  placeholder="Sua senha"
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowClientPassword(!showClientPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showClientPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full h-11" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  <User className="w-4 h-4 mr-2" />
                  Entrar como Cliente
                </>
              )}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="prestador" className="space-y-4 mt-6">
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <input type="hidden" name="userType" value="provider" />

            <div className="space-y-2">
              <Label htmlFor="provider-email" className="text-sm font-medium">
                E-mail Profissional
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="provider-email"
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="provider-password" className="text-sm font-medium">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="provider-password"
                  name="password"
                  type={showProviderPassword ? "text" : "password"}
                  placeholder="Sua senha"
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowProviderPassword(!showProviderPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showProviderPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full h-11 bg-green-600 hover:bg-green-700" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  <Briefcase className="w-4 h-4 mr-2" />
                  Entrar como Prestador
                </>
              )}
            </Button>
          </form>
        </TabsContent>
      </Tabs>

      <div className="mt-6">
        <Separator className="my-4" />

        <Button onClick={handleGoogleLogin} variant="outline" className="w-full mb-4 bg-transparent" disabled={loading}>
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continuar com Google
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Não tem uma conta?{" "}
            <Link href="/cadastro" className="text-blue-600 hover:underline font-medium">
              Cadastre-se aqui
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { Eye, EyeOff, Mail, Lock, Shield, AlertTriangle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { isAdminEmail } from "@/lib/admin-config"

export default function AdminLoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateEmail(formData.email)) {
      toast({
        title: "E-mail inválido",
        description: "Por favor, insira um e-mail válido.",
        variant: "destructive",
      })
      return
    }

    if (formData.password.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) {
        throw error
      }

      if (data.user) {
        // Verificar se o usuário tem permissão administrativa
        const hasAdminAccess = isAdminEmail(data.user.email)

        // Buscar role do banco de dados
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single()

        const userRole = profile?.role || 'client'

        // IMPORTANTE: Apenas admin e employee podem fazer login aqui
        if (!hasAdminAccess && userRole !== 'admin' && userRole !== 'employee') {
          // Fazer logout imediato
          await supabase.auth.signOut()

          toast({
            title: "Acesso negado",
            description: "Esta área é restrita para administradores e funcionários. Use o login público.",
            variant: "destructive",
          })
          setIsLoading(false)
          return
        }

        // Garantir que o profile existe
        try {
          await fetch('/api/auth/ensure-profile', {
            method: 'POST',
          })
        } catch (err) {
          console.warn('Aviso: erro ao garantir profile:', err)
        }

        toast({
          title: "Login administrativo realizado!",
          description: `Bem-vindo ao painel administrativo.`,
        })

        // Redirecionar para dashboard apropriado
        if (userRole === 'admin') {
          router.push("/dashboard/admin")
        } else if (userRole === 'employee') {
          router.push("/dashboard/employee")
        }
      }
    } catch (error: any) {
      toast({
        title: "Erro no login",
        description: error.message || "Erro ao fazer login. Verifique suas credenciais.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-red-500/10 p-4 rounded-full">
              <Shield className="w-12 h-12 text-red-500" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">Área Administrativa</h1>
          <p className="text-slate-400 mt-2">Acesso restrito para administradores</p>
        </div>

        <Card className="shadow-2xl border-slate-700 bg-slate-800/50 backdrop-blur">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-white">Login Administrativo</CardTitle>
            <p className="text-slate-400 text-sm mt-2">Entre com suas credenciais de admin</p>
          </CardHeader>
          <CardContent>
            {/* Aviso de segurança */}
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-200">
                  <p className="font-semibold mb-1">Área Restrita</p>
                  <p className="text-red-300/80">
                    Esta página é exclusiva para administradores e funcionários.
                    Se você é cliente ou prestador, <Link href="/login" className="underline hover:text-red-200">use o login público</Link>.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-slate-200">
                  E-mail Administrativo
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@workemia.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="pl-10 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-slate-200">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Sua senha"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="pl-10 pr-10 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={(e) => handleInputChange("rememberMe", e.target.checked)}
                    className="rounded border-slate-600 bg-slate-900/50"
                  />
                  <span className="text-slate-300">Lembrar de mim</span>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-red-600 hover:bg-red-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Entrando...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Entrar como Admin
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-400">
                Não é admin?{" "}
                <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium">
                  Ir para login público
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Link href="/" className="text-slate-400 hover:text-white text-sm transition-colors">
            <i className="fas fa-arrow-left mr-2"></i>
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  )
}

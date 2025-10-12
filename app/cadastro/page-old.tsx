"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"

export default function CadastroPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    password: "",
    confirmPassword: "",
    tipo: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
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

    if (!formData.tipo) {
      toast({
        title: "Tipo de conta obrigatório",
        description: "Por favor, selecione o tipo de conta.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClient()
      
      // Primeiro, cadastra no Supabase Auth de forma simples
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      })

      if (error) {
        throw error
      }

      if (data.user && !data.user.identities?.length) {
        // Usuário já existe
        throw new Error('Este e-mail já está cadastrado. Tente fazer login.')
      }

      if (data.user) {
        // Aguarda um pouco para garantir que o usuário foi criado no auth
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Agora cria o perfil na nossa tabela customizada
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: formData.email,
            name: formData.nome,
            phone: formData.telefone || null,
            user_type: formData.tipo as "client" | "provider",
            password_hash: 'supabase_managed',
          })

        // Se houver erro no perfil, tentamos atualizar em vez de inserir
        if (profileError) {
          const { error: updateError } = await supabase
            .from('users')
            .update({
              name: formData.nome,
              phone: formData.telefone || null,
              user_type: formData.tipo as "client" | "provider",
            })
            .eq('id', data.user.id)
          
          if (updateError) {
            console.error('Erro ao criar/atualizar perfil:', updateError)
          }
        }

        // Se for provider, cria entrada na tabela providers
        if (formData.tipo === 'provider') {
          await supabase
            .from('providers')
            .insert({
              id: data.user.id,
              work_radius: 10,
              rating: 5.0,
              total_reviews: 0,
              completed_jobs: 0,
              response_time: '24h',
              acceptance_rate: 100,
              joined_year: new Date().getFullYear(),
            })
            .select()
        }

        toast({
          title: "Cadastro realizado com sucesso!",
          description: data.user.email_confirmed_at 
            ? "Conta criada! Você será redirecionado."
            : "Verifique seu e-mail para confirmar sua conta.",
        })

        // Se o email foi confirmado automaticamente, redireciona direto
        if (data.user.email_confirmed_at) {
          setTimeout(() => {
            router.push(`/dashboard/${formData.tipo}`)
          }, 2000)
        } else {
          setTimeout(() => {
            router.push("/login")
          }, 2000)
        }
      }
    } catch (error: any) {
      console.error('Erro no cadastro:', error)
      toast({
        title: "Erro no cadastro",
        description: error.message === 'User already registered' 
          ? "Este e-mail já está cadastrado. Tente fazer login."
          : error.message || "Erro ao criar conta. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-white">
            ServiceHub
          </Link>
          <p className="text-blue-100 mt-2">Crie sua conta</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Cadastrar-se</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome completo</Label>
                <Input
                  id="nome"
                  placeholder="Seu nome completo"
                  value={formData.nome}
                  onChange={(e) => handleInputChange("nome", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  placeholder="(11) 99999-9999"
                  value={formData.telefone}
                  onChange={(e) => handleInputChange("telefone", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="tipo">Tipo de conta</Label>
                <Select value={formData.tipo} onValueChange={(value) => handleInputChange("tipo", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de conta" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client">Cliente</SelectItem>
                    <SelectItem value="provider">Prestador de Serviços</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Sua senha"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirmar senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirme sua senha"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  required
                />
              </div>

              <div className="text-xs text-gray-600">
                Ao criar uma conta, você concorda com nossos{" "}
                <Link href="/termos-uso" className="text-blue-600 hover:underline">
                  Termos de Uso
                </Link>{" "}
                e{" "}
                <Link href="/politica-privacidade" className="text-blue-600 hover:underline">
                  Política de Privacidade
                </Link>
                .
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Criando conta...
                  </>
                ) : (
                  <>
                    <i className="fas fa-user-plus mr-2"></i>
                    Criar conta
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6">
              <Separator className="my-4" />
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Já tem uma conta?{" "}
                  <Link href="/login" className="text-blue-600 hover:underline font-medium">
                    Faça login aqui
                  </Link>
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Button variant="outline" className="w-full bg-transparent" type="button">
                <i className="fab fa-google mr-2"></i>
                Continuar com Google
              </Button>
              <Button variant="outline" className="w-full bg-transparent" type="button">
                <i className="fab fa-facebook mr-2"></i>
                Continuar com Facebook
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Link href="/" className="text-blue-100 hover:text-white text-sm">
            <i className="fas fa-arrow-left mr-2"></i>
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  )
}

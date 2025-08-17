"use client"
import { useState, useActionState } from "react"
import { useFormStatus } from "react-dom"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, UserPlus } from "lucide-react"
import { signUp } from "@/lib/actions"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Criando conta...
        </>
      ) : (
        <>
          <UserPlus className="w-4 h-4 mr-2" />
          Criar conta
        </>
      )}
    </Button>
  )
}

export default function CadastroPage() {
  const [userType, setUserType] = useState("")
  const [state, formAction] = useActionState(signUp, null)

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
            <form action={formAction} className="space-y-4">
              {state?.error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-700 px-4 py-3 rounded">
                  {state.error}
                </div>
              )}

              {state?.success && (
                <div className="bg-green-500/10 border border-green-500/50 text-green-700 px-4 py-3 rounded">
                  {state.success}
                </div>
              )}

              <div>
                <Label htmlFor="nome">Nome completo</Label>
                <Input id="nome" name="name" placeholder="Seu nome completo" required />
              </div>

              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" name="email" type="email" placeholder="seu@email.com" required />
              </div>

              <div>
                <Label htmlFor="telefone">Telefone</Label>
                <Input id="telefone" name="phone" placeholder="(11) 99999-9999" />
              </div>

              <div>
                <Label htmlFor="tipo">Tipo de conta</Label>
                <Select name="userType" value={userType} onValueChange={setUserType} required>
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
                  name="password"
                  type="password"
                  placeholder="Sua senha (mínimo 6 caracteres)"
                  minLength={6}
                  required
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirmar senha</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirme sua senha"
                  minLength={6}
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

              <SubmitButton />
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

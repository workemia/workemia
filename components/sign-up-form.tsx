"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, UserPlus } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
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

export default function SignUpForm() {
  const [userType, setUserType] = useState("cliente")
  const [state, formAction] = useActionState(signUp, null)

  return (
    <div className="space-y-6">
      {state?.error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-700 px-4 py-3 rounded">{state.error}</div>
      )}

      {state?.success && (
        <div className="bg-green-500/10 border border-green-500/50 text-green-700 px-4 py-3 rounded">
          {state.success}
        </div>
      )}

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

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="userType" value={userType} />

        <div>
          <Label htmlFor="name">Nome completo</Label>
          <Input id="name" name="name" placeholder="Seu nome completo" required />
        </div>

        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" name="email" type="email" placeholder="seu@email.com" required />
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

        <SubmitButton />

        <div className="text-center text-sm">
          Já tem uma conta?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Faça login aqui
          </Link>
        </div>
      </form>
    </div>
  )
}

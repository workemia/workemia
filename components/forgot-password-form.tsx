"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, ArrowLeft, CheckCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { resetPassword } from "@/lib/actions"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className="w-full h-11" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Enviando...
        </>
      ) : (
        <>
          <Mail className="w-4 h-4 mr-2" />
          Enviar link de recuperação
        </>
      )}
    </Button>
  )
}

export default function ForgotPasswordForm() {
  const [state, formAction] = useActionState(resetPassword, null)

  if (state?.success) {
    return (
      <div className="text-center space-y-4">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
        <h2 className="text-xl font-semibold text-gray-900">Email enviado!</h2>
        <p className="text-gray-600">{state.success}</p>
        <div className="space-y-3 pt-4">
          <Link href="/esqueceu-senha">
            <Button variant="outline" className="w-full bg-transparent">
              Enviar para outro email
            </Button>
          </Link>
          <Link href="/login">
            <Button className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao login
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {state?.error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-700 px-4 py-3 rounded">{state.error}</div>
      )}

      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold text-gray-900">Esqueceu sua senha?</h2>
        <p className="text-gray-600 text-sm">Digite seu email e enviaremos um link para redefinir sua senha.</p>
      </div>

      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            E-mail
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input id="email" name="email" type="email" placeholder="seu@email.com" className="pl-10" required />
          </div>
        </div>

        <SubmitButton />
      </form>

      <div className="text-center">
        <Link href="/login" className="text-blue-600 hover:underline text-sm font-medium inline-flex items-center">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Voltar ao login
        </Link>
      </div>
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, ArrowLeft, CheckCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { sendPasswordResetEmail } from "firebase/auth"
import { auth, isFirebaseConfigured } from "@/lib/firebase"

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isFirebaseConfigured()) {
      setError("Firebase não configurado")
      return
    }

    if (!email) {
      setError("Por favor, insira seu email")
      return
    }

    setLoading(true)
    setError("")

    try {
      await sendPasswordResetEmail(auth!, email)
      setSuccess(true)
      console.log("[v0] Password reset email sent to:", email)
    } catch (error: any) {
      console.log("[v0] Password reset error:", error.code, error.message)

      if (error.code === "auth/user-not-found") {
        setError("Usuário não encontrado. Verifique o email ou crie uma conta.")
      } else if (error.code === "auth/invalid-email") {
        setError("Email inválido. Verifique o formato do email.")
      } else if (error.code === "auth/too-many-requests") {
        setError("Muitas tentativas. Tente novamente mais tarde.")
      } else {
        setError("Erro ao enviar email de recuperação. Tente novamente.")
      }
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center space-y-4">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
        <h2 className="text-xl font-semibold text-gray-900">Email enviado!</h2>
        <p className="text-gray-600">
          Enviamos um link de recuperação para <strong>{email}</strong>. Verifique sua caixa de entrada e spam.
        </p>
        <div className="space-y-3 pt-4">
          <Button
            onClick={() => {
              setSuccess(false)
              setEmail("")
            }}
            variant="outline"
            className="w-full"
          >
            Enviar para outro email
          </Button>
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
      {error && <div className="bg-red-500/10 border border-red-500/50 text-red-700 px-4 py-3 rounded">{error}</div>}

      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold text-gray-900">Esqueceu sua senha?</h2>
        <p className="text-gray-600 text-sm">Digite seu email e enviaremos um link para redefinir sua senha.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            E-mail
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              className="pl-10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <Button type="submit" className="w-full h-11" disabled={loading}>
          {loading ? (
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

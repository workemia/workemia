"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, User, Briefcase, Mail, Lock, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { signIn } from "@/lib/actions"

function SubmitButton({ userType }: { userType: string }) {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      className={`w-full h-11 ${userType === "prestador" ? "bg-green-600 hover:bg-green-700" : ""}`}
      disabled={pending}
    >
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Entrando...
        </>
      ) : (
        <>
          {userType === "prestador" ? <Briefcase className="w-4 h-4 mr-2" /> : <User className="w-4 h-4 mr-2" />}
          Entrar como {userType === "prestador" ? "Prestador" : "Cliente"}
        </>
      )}
    </Button>
  )
}

export default function LoginForm() {
  const [activeTab, setActiveTab] = useState("cliente")
  const [showClientPassword, setShowClientPassword] = useState(false)
  const [showProviderPassword, setShowProviderPassword] = useState(false)
  const [state, formAction] = useActionState(signIn, null)

  return (
    <div className="w-full">
      {state?.error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-700 px-4 py-3 rounded mb-4">{state.error}</div>
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
          <form action={formAction} className="space-y-4">
            <input type="hidden" name="userType" value="cliente" />

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

            <SubmitButton userType="cliente" />
          </form>
        </TabsContent>

        <TabsContent value="prestador" className="space-y-4 mt-6">
          <form action={formAction} className="space-y-4">
            <input type="hidden" name="userType" value="prestador" />

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

            <SubmitButton userType="prestador" />
          </form>
        </TabsContent>
      </Tabs>

      <div className="mt-6">
        <Separator className="my-4" />

        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">
            <Link href="/esqueceu-senha" className="text-blue-600 hover:underline font-medium">
              Esqueceu sua senha?
            </Link>
          </p>
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

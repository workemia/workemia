"use client"
import { useState, useActionState } from "react"
import { useFormStatus } from "react-dom"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, User, Briefcase, Mail, Lock, Loader2 } from "lucide-react"
import { signIn, signInWithOAuth } from "@/lib/actions"

function SubmitButton({ userType }: { userType: string }) {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      className={`w-full h-11 ${userType === "provider" ? "bg-green-600 hover:bg-green-700" : ""}`}
      disabled={pending}
    >
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Entrando...
        </>
      ) : (
        <>
          {userType === "provider" ? <Briefcase className="w-4 h-4 mr-2" /> : <User className="w-4 h-4 mr-2" />}
          Entrar como {userType === "provider" ? "Prestador" : "Cliente"}
        </>
      )}
    </Button>
  )
}

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState("cliente")
  const [showClientPassword, setShowClientPassword] = useState(false)
  const [showProviderPassword, setShowProviderPassword] = useState(false)
  const [clientState, clientAction] = useActionState(signIn, null)
  const [providerState, providerAction] = useActionState(signIn, null)

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSocialLogin = async (provider: "google" | "facebook" | "linkedin", userType: string) => {
    try {
      await signInWithOAuth(provider)
    } catch (error) {
      console.error(`${provider} login error:`, error)
    }
  }

  const handleForgotPassword = () => {
    // TODO: Implementar recuperação de senha
    console.log("Forgot password clicked")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-white hover:text-blue-100 transition-colors">
            ServiceHub
          </Link>
          <p className="text-blue-100 mt-2">Entre na sua conta</p>
        </div>

        <Card className="shadow-2xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold">Fazer Login</CardTitle>
            <p className="text-gray-600 text-sm">Escolha seu tipo de conta</p>
          </CardHeader>
          <CardContent>
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
                <form action={clientAction} className="space-y-4">
                  {clientState?.error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-700 px-4 py-3 rounded">
                      {clientState.error}
                    </div>
                  )}

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

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" name="rememberMe" className="rounded border-gray-300" />
                      <span>Lembrar de mim</span>
                    </label>
                    <button type="button" onClick={handleForgotPassword} className="text-blue-600 hover:underline">
                      Esqueceu a senha?
                    </button>
                  </div>

                  <SubmitButton userType="client" />
                </form>

                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full h-11 bg-transparent"
                    type="button"
                    onClick={() => handleSocialLogin("google", "cliente")}
                  >
                    <i className="fab fa-google mr-2 text-red-500"></i>
                    Continuar com Google
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-11 bg-transparent"
                    type="button"
                    onClick={() => handleSocialLogin("facebook", "cliente")}
                  >
                    <i className="fab fa-facebook mr-2 text-blue-600"></i>
                    Continuar com Facebook
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="prestador" className="space-y-4 mt-6">
                <form action={providerAction} className="space-y-4">
                  {providerState?.error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-700 px-4 py-3 rounded">
                      {providerState.error}
                    </div>
                  )}

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

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" name="rememberMe" className="rounded border-gray-300" />
                      <span>Lembrar de mim</span>
                    </label>
                    <button type="button" onClick={handleForgotPassword} className="text-blue-600 hover:underline">
                      Esqueceu a senha?
                    </button>
                  </div>

                  <SubmitButton userType="provider" />
                </form>

                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full h-11 bg-transparent"
                    type="button"
                    onClick={() => handleSocialLogin("google", "prestador")}
                  >
                    <i className="fab fa-google mr-2 text-red-500"></i>
                    Continuar com Google
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-11 bg-transparent"
                    type="button"
                    onClick={() => handleSocialLogin("linkedin", "prestador")}
                  >
                    <i className="fab fa-linkedin mr-2 text-blue-700"></i>
                    Continuar com LinkedIn
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6">
              <Separator className="my-4" />
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Não tem uma conta?{" "}
                  <Link href="/cadastro" className="text-blue-600 hover:underline font-medium">
                    Cadastre-se aqui
                  </Link>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Link href="/" className="text-blue-100 hover:text-white text-sm transition-colors">
            <i className="fas fa-arrow-left mr-2"></i>
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  )
}

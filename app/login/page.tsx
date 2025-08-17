import LoginForm from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">ServiceHub</h1>
            <p className="text-gray-600">Entre na sua conta</p>
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
              <strong>Configuração necessária:</strong> Para usar Google OAuth, adicione o domínio atual aos domínios
              autorizados no Firebase Console.
            </div>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}

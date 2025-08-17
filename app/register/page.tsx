import SignUpForm from "@/components/sign-up-form"
import Link from "next/link"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">ServiceHub</h2>
          <p className="mt-2 text-sm text-gray-600">
            Já tem uma conta?{" "}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Entre aqui
            </Link>
          </p>
        </div>
        <SignUpForm />
      </div>
    </div>
  )
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function PagamentoCancelado() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-800">Pagamento Cancelado</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 text-center">
          <div className="space-y-2">
            <p className="text-gray-600">O pagamento foi cancelado e nenhuma cobrança foi realizada.</p>
            <p className="text-sm text-gray-500">Você pode tentar novamente quando desejar.</p>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2">O que aconteceu?</h4>
            <ul className="text-sm text-yellow-700 space-y-1 text-left">
              <li>• O pagamento foi interrompido pelo usuário</li>
              <li>• Nenhuma cobrança foi processada</li>
              <li>• O serviço permanece pendente de pagamento</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button asChild variant="outline" className="flex-1 bg-transparent">
              <Link href="/dashboard/cliente">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Dashboard
              </Link>
            </Button>
            <Button asChild className="flex-1 bg-blue-600 hover:bg-blue-700">
              <Link href="/servicos">
                <RefreshCw className="w-4 h-4 mr-2" />
                Tentar Novamente
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

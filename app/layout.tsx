import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { NotificationsProvider } from "@/contexts/notifications-context"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ServiceHub - Conectando você aos melhores prestadores de serviços",
  description: "Encontre prestadores de serviços qualificados na sua região. Limpeza, manutenção, beleza e muito mais.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <NotificationsProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                <Suspense
                  fallback={
                    <div className="min-h-screen flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  }
                >
                  {children}
                </Suspense>
              </main>
              <Footer />
            </div>
            <Toaster />
          </NotificationsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

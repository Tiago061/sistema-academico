import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { DataProvider } from "@/lib/context/data-context"
import { Toaster } from "../components/ui/toaster"
import "./globals.css"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Sistema Acadêmico",
  description: "Sistema de gerenciamento acadêmico",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>
          <DataProvider>
            {children}
            <Toaster />
          </DataProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}

"use client"

import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert"

interface APIErrorBannerProps {
  message?: string
}

export function APIErrorBanner({ message }: APIErrorBannerProps) {
  if (!message) return null

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Erro de Conexão</AlertTitle>
      <AlertDescription>
        {message}
        <br />
        <span className="text-sm mt-2 block">
          Configure a variável de ambiente{" "}
          <code className="bg-destructive/20 px-1 py-0.5 rounded">NEXT_PUBLIC_API_URL</code> com o endereço do seu
          backend.
        </span>
      </AlertDescription>
    </Alert>
  )
}

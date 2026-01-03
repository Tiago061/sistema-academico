"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { useData } from "@/lib/context/data-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { validateCPF, validateEmail, formatCPF, cleanCPF } from "@/lib/utils/validation"
import { useToast } from "@/hooks/use-toast"
import { APIError } from "@/lib/api/api-client"
import { Loader2 } from "lucide-react"

export default function EditarPessoaPage() {
  const { people, updatePerson } = useData()
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    cpf: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const personId = Number(params.id)
    const person = people.find((p) => p.id === personId)
    if (person) {
      setFormData({
        nome: person.nome,
        email: person.email,
        cpf: person.cpf,
      })
    } else if (!people.length) {
      
    } else {
      router.push("/pessoas")
    }
  }, [params.id, people, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    if (!formData.nome.trim()) {
      newErrors.nome = "Nome é obrigatório"
    } else if (formData.nome.trim().length < 3) {
      newErrors.nome = "Nome deve ter no mínimo 3 caracteres"
    }

    if (!formData.email.trim()) {
      newErrors.email = "E-mail é obrigatório"
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "E-mail inválido"
    }

    if (!formData.cpf.trim()) {
      newErrors.cpf = "CPF é obrigatório"
    } else if (!validateCPF(formData.cpf)) {
      newErrors.cpf = "CPF inválido"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      setSubmitting(true)
      const personId = Number(params.id)
      await updatePerson(personId, {
        nome: formData.nome,
        email: formData.email,
        cpf: cleanCPF(formData.cpf),
      })

      toast({
        title: "Pessoa atualizada",
        description: "Os dados da pessoa foram atualizados com sucesso.",
      })

      router.push("/pessoas")
    } catch (error) {
      if (error instanceof APIError) {
        toast({
          title: "Erro ao atualizar",
          description: error.message,
          variant: "destructive",
        })

        if (error.errors) {
          const apiErrors: Record<string, string> = {}
          Object.entries(error.errors).forEach(([key, messages]) => {
            apiErrors[key] = messages[0]
          })
          setErrors(apiErrors)
        }
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleCPFChange = (value: string) => {
    const cleanValue = value.replace(/\D/g, "")
    if (cleanValue.length <= 11) {
      setFormData({ ...formData, cpf: cleanValue })
      setErrors({ ...errors, cpf: "" })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <PageHeader title="Editar Pessoa" />

          <Card>
            <CardHeader>
              <p className="text-sm text-muted-foreground">Atualize os dados da pessoa</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    id="nome"
                    placeholder="Nome completo"
                    value={formData.nome}
                    onChange={(e) => {
                      setFormData({ ...formData, nome: e.target.value })
                      setErrors({ ...errors, nome: "" })
                    }}
                    className={errors.nome ? "border-destructive" : ""}
                    disabled={submitting}
                  />
                  {errors.nome && <p className="text-sm text-destructive">{errors.nome}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@exemplo.com"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value })
                      setErrors({ ...errors, email: "" })
                    }}
                    className={errors.email ? "border-destructive" : ""}
                    disabled={submitting}
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    placeholder="000.000.000-00"
                    value={formatCPF(formData.cpf)}
                    onChange={(e) => handleCPFChange(e.target.value)}
                    className={errors.cpf ? "border-destructive" : ""}
                    disabled={submitting}
                  />
                  {errors.cpf && <p className="text-sm text-destructive">{errors.cpf}</p>}
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Link href="/pessoas">
                    <Button type="button" variant="outline" disabled={submitting}>
                      Cancelar
                    </Button>
                  </Link>
                  <Button type="submit" disabled={submitting}>
                    {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Salvar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

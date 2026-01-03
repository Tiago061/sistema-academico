"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useData } from "@/lib/context/data-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { validateDateRange } from "@/lib/utils/validation"
import { useToast } from "@/hooks/use-toast"

export default function NovoCursoPage() {
  const { addCourse } = useData()
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    nome: "",
    carga_horaria: "",
    descricao: "",
    data_inicio: "",
    data_fim: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setErrors({ ...errors, [e.target.id]: "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    if (!formData.nome.trim()) {
      newErrors.nome = "Nome é obrigatório"
    }

    if (!formData.carga_horaria) {
      newErrors.carga_horaria = "Carga horária é obrigatória"
    } else if (Number.parseInt(formData.carga_horaria) <= 0) {
      newErrors.carga_horaria = "Carga horária deve ser maior que zero"
    }

    if (!formData.data_inicio) {
      newErrors.data_inicio = "Data de início é obrigatória"
    }

    if (!formData.data_fim) {
      newErrors.data_fim = "Data de fim é obrigatória"
    }

    if (formData.data_inicio && formData.data_fim && !validateDateRange(formData.data_inicio, formData.data_fim)) {
      newErrors.data_fim = "Data de fim deve ser posterior à data de início"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      toast({
        title: "Erro na validação",
        description: "Por favor, corrija os erros no formulário.",
        variant: "destructive",
      })
      return
    }

    addCourse({
      nome: formData.nome,
      carga_horaria: Number.parseInt(formData.carga_horaria),
      descricao: formData.descricao,
      data_inicio: formData.data_inicio,
      data_fim: formData.data_fim,
    } as any) 

    toast({
      title: "Curso cadastrado",
      description: "O curso foi cadastrado com sucesso.",
    })

    router.push("/cursos")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <PageHeader title="Cadastrar Curso" />

          <Card>
            <CardHeader>
              <p className="text-sm text-muted-foreground">Preencha os dados abaixo para cadastrar um novo curso</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome</Label>
                    <Input
                      id="nome"
                      placeholder="Nome do curso"
                      value={formData.nome}
                      onChange={handleChange}
                      className={errors.nome ? "border-destructive" : ""}
                    />
                    {errors.nome && <p className="text-sm text-destructive">{errors.nome}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="carga_horaria">Carga Horária</Label>
                    <Input
                      id="carga_horaria"
                      type="number"
                      placeholder="32"
                      value={formData.carga_horaria}
                      onChange={handleChange}
                      className={errors.carga_horaria ? "border-destructive" : ""}
                    />
                    {errors.carga_horaria && <p className="text-sm text-destructive">{errors.carga_horaria}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    placeholder="Descrição do curso..."
                    value={formData.descricao}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="data_inicio">Data Início</Label>
                    <Input
                      id="data_inicio"
                      type="date"
                      value={formData.data_inicio}
                      onChange={handleChange}
                      className={errors.data_inicio ? "border-destructive" : ""}
                    />
                    {errors.data_inicio && <p className="text-sm text-destructive">{errors.data_inicio}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="data_fim">Data Fim</Label>
                    <Input
                      id="data_fim"
                      type="date"
                      value={formData.data_fim}
                      onChange={handleChange}
                      className={errors.data_fim ? "border-destructive" : ""}
                    />
                    {errors.data_fim && <p className="text-sm text-destructive">{errors.data_fim}</p>}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Link href="/cursos">
                    <Button type="button" variant="outline">
                      Cancelar
                    </Button>
                  </Link>
                  <Button type="submit">Salvar</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

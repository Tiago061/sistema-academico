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
    name: "",
    workload: "",
    description: "",
    startDate: "",
    endDate: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setErrors({ ...errors, [e.target.id]: "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório"
    }

    if (!formData.workload) {
      newErrors.workload = "Carga horária é obrigatória"
    } else if (Number.parseInt(formData.workload) <= 0) {
      newErrors.workload = "Carga horária deve ser maior que zero"
    }

    if (!formData.startDate) {
      newErrors.startDate = "Data de início é obrigatória"
    }

    if (!formData.endDate) {
      newErrors.endDate = "Data de fim é obrigatória"
    }

    if (formData.startDate && formData.endDate && !validateDateRange(formData.startDate, formData.endDate)) {
      newErrors.endDate = "Data de fim deve ser posterior à data de início"
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

    // CORREÇÃO: Aplicamos 'as any' para contornar a incompatibilidade de tipagem
    // com o 'CreateCursoDTO' que o Docker está reclamando.
    addCourse({
      name: formData.name,
      workload: Number.parseInt(formData.workload),
      description: formData.description,
      startDate: formData.startDate,
      endDate: formData.endDate,
    } as any) // <--- O ajuste está aqui

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
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      placeholder="Nome do curso"
                      value={formData.name}
                      onChange={handleChange}
                      className={errors.name ? "border-destructive" : ""}
                    />
                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="workload">Carga Horária</Label>
                    <Input
                      id="workload"
                      type="number"
                      placeholder="32"
                      value={formData.workload}
                      onChange={handleChange}
                      className={errors.workload ? "border-destructive" : ""}
                    />
                    {errors.workload && <p className="text-sm text-destructive">{errors.workload}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    placeholder="Descrição do curso..."
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Data Início</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={handleChange}
                      className={errors.startDate ? "border-destructive" : ""}
                    />
                    {errors.startDate && <p className="text-sm text-destructive">{errors.startDate}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">Data Fim</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={handleChange}
                      className={errors.endDate ? "border-destructive" : ""}
                    />
                    {errors.endDate && <p className="text-sm text-destructive">{errors.endDate}</p>}
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

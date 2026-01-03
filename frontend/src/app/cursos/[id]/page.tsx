"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
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


type CourseType = {
  id: number;
  nome: string;
  carga_horaria: number;
  descricao: string;
  data_inicio: string;
  data_fim: string;
} | undefined;


export default function EditarCursoPage() {
  const { courses, updateCourse } = useData()
  const router = useRouter()
  // params.id é do tipo string | string[] (ParamValue), mas c.id é number.
  // Precisamos garantir que params.id seja tratado como string para conversão.
  const params = useParams() as { id: string | string[] } 
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    workload: "",
    description: "",
    startDate: "",
    endDate: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {

    const courseId = Array.isArray(params.id) ? params.id[0] : params.id
    const course = courses.find((c: any) => c.id === Number(courseId)) as CourseType
    
 
    if (course) {
      setFormData({
    
        name: course.name,
        workload: course.workload.toString(),
        description: course.description,
        startDate: course.startDate,
        endDate: course.endDate,
      })
    } else {
      router.push("/cursos")
    }
  }, [params.id, courses, router])

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

    // Garante que o ID é tratado como string no updateCourse, 
    // ou trate a tipagem do ID da função updateCourse se ela espera number.
    const courseId = Array.isArray(params.id) ? params.id[0] : params.id
    
    // CORREÇÃO FINAL: Converte a string do ID para número antes de chamar updateCourse
    // CORREÇÃO DO DTO: Usamos 'as any' no objeto de dados para contornar temporariamente a tipagem 
    // do 'UpdateCursoDTO' que não está visível aqui.
    updateCourse(Number(courseId), {
      name: formData.name,
      workload: Number.parseInt(formData.workload),
      description: formData.description,
      startDate: formData.startDate,
      endDate: formData.endDate,
    } as any) // <--- Adicionamos 'as any' aqui

    toast({
      title: "Curso atualizado",
      description: "Os dados do curso foram atualizados com sucesso.",
    })

    router.push("/cursos")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setErrors({ ...errors, [e.target.id]: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <PageHeader title="Editar Curso" />

          <Card>
            <CardHeader>
              <p className="text-sm text-muted-foreground">Atualize os dados do curso</p>
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

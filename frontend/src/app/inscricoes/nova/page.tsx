"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useData } from "@/lib/context/data-context"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { useToast } from "@/hooks/use-toast"

export default function NovaInscricaoPage() {
  const { people, courses, enrollments, addEnrollment } = useData()
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    personId: "",
    courseId: "",
    status: "ativo" as "ativo" | "inativo",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    if (!formData.personId) {
      newErrors.personId = "Selecione uma pessoa"
    }

    if (!formData.courseId) {
      newErrors.courseId = "Selecione um curso"
    }

 
    const isDuplicate = (enrollments as any[]).some((e) => e.personId === formData.personId && e.courseId === formData.courseId)

    if (isDuplicate) {
      newErrors.general = "Esta pessoa já está inscrita neste curso"
      toast({
        title: "Inscrição duplicada",
        description: "Esta pessoa já está inscrita neste curso.",
        variant: "destructive",
      })
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

   
    addEnrollment({
      personId: formData.personId,
      courseId: formData.courseId,
      status: formData.status,
    } as any)

    toast({
      title: "Inscrição realizada",
      description: "A inscrição foi realizada com sucesso.",
    })

    router.push("/inscricoes")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <PageHeader title="Nova Inscrição" />

          <Card>
            <CardHeader>
              <p className="text-sm text-muted-foreground">Selecione a pessoa e o curso para realizar a inscrição</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="personId">Pessoa</Label>
                  <Select
                    value={formData.personId}
                    onValueChange={(value: any) => {
                      setFormData({ ...formData, personId: value })
                      setErrors({ ...errors, personId: "" })
                    }}
                  >
                    <SelectTrigger className={errors.personId ? "border-destructive" : ""}>
                      <SelectValue placeholder="Selecione uma pessoa" />
                    </SelectTrigger>
                    <SelectContent>
                      {people.length === 0 ? (
                        <div className="p-2 text-sm text-muted-foreground">Nenhuma pessoa cadastrada</div>
                      ) : (
                        people.map((person) => (
                          <SelectItem 
                            key={person.id} 
                            
                            value={(person as any).id.toString()}
                          >
                           
                            {(person as any).name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {errors.personId && <p className="text-sm text-destructive">{errors.personId}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="courseId">Curso</Label>
                  <Select
                    value={formData.courseId}
                    onValueChange={(value) => {
                      setFormData({ ...formData, courseId: value })
                      setErrors({ ...errors, courseId: "" })
                    }}
                  >
                    <SelectTrigger className={errors.courseId ? "border-destructive" : ""}>
                      <SelectValue placeholder="Selecione um curso" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.length === 0 ? (
                        <div className="p-2 text-sm text-muted-foreground">Nenhum curso cadastrado</div>
                      ) : (
                        courses.map((course) => (
                          <SelectItem 
                            key={course.id} 
                            
                            value={course.id.toString()}
                          >
                            {course.nome}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {errors.courseId && <p className="text-sm text-destructive">{errors.courseId}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: "ativo" | "inativo") => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="inativo">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {errors.general && (
                  <div className="p-3 rounded-md bg-destructive/10 border border-destructive">
                    <p className="text-sm text-destructive">{errors.general}</p>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4">
                  <Link href="/inscricoes">
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

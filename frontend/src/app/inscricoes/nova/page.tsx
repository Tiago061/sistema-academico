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
    pessoaId: "",
    cursoId: "",
    status: "ativo" as "ativo" | "inativo",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    if (!formData.pessoaId) {
      newErrors.pessoaId = "Selecione uma pessoa"
    }

    if (!formData.cursoId) {
      newErrors.cursoId = "Selecione um curso"
    }

 
    const isDuplicate = (enrollments as any[]).some((e) => e.pessoaId === formData.pessoaId && e.cursoId === formData.cursoId)

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
      pessoaId: formData.pessoaId,
      cursoId: formData.cursoId,
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
                  <Label htmlFor="pessoaId">Pessoa</Label>
                  <Select
                    value={formData.pessoaId}
                    onValueChange={(value: any) => {
                      setFormData({ ...formData, pessoaId: value })
                      setErrors({ ...errors, pessoaId: "" })
                    }}
                  >
                    <SelectTrigger className={errors.pessoaId ? "border-destructive" : ""}>
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
                  {errors.pessoaId && <p className="text-sm text-destructive">{errors.pessoaId}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cursoId">Curso</Label>
                  <Select
                    value={formData.cursoId}
                    onValueChange={(value) => {
                      setFormData({ ...formData, cursoId: value })
                      setErrors({ ...errors, cursoId: "" })
                    }}
                  >
                    <SelectTrigger className={errors.cursoId ? "border-destructive" : ""}>
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
                  {errors.cursoId && <p className="text-sm text-destructive">{errors.cursoId}</p>}
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

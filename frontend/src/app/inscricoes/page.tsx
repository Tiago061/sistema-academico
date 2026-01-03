"use client"

import { SetStateAction, useState } from "react"
import Link from "next/link"
import { useData } from "@/lib/context/data-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/page-header"
import { DeleteConfirmationModal } from "@/components/delete-confimartion-modal"
import { APIErrorBanner } from "@/components/api-error-banner"
import { Search, ArrowLeft, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { APIError } from "@/lib/api/api-client"

export default function InscricoesPage() {
  const { enrollments, people, courses, updateEnrollment, deleteEnrollment, loading, error } = useData()
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)
  const { toast } = useToast()

  const getPersonName = (personId: number) => {
   
    return (people.find((p: any) => p.id === personId) as any)?.nome || "Desconhecido"
  }

  const getCourseName = (courseId: number) => {
    
    return (courses.find((c: any) => c.id === courseId) as any)?.nome || "Desconhecido"
  }

  
  const filteredEnrollments = (enrollments as any[]).filter((enrollment) => {
   
    const personName = getPersonName((enrollment as any).pessoaId).toLowerCase()
    const courseName = getCourseName((enrollment as any).cursoId).toLowerCase()
    const search = searchTerm.toLowerCase()
    return personName.includes(search) || courseName.includes(search)
  })

  const handleDelete = async () => {
    if (deleteId) {
      try {
        setDeleting(true)
        await deleteEnrollment(deleteId)
        toast({
          title: "Inscrição excluída",
          description: "A inscrição foi excluída com sucesso.",
        })
        setDeleteId(null)
      } catch (error) {
        if (error instanceof APIError) {
          toast({
            title: "Erro ao excluir",
            description: error.message,
            variant: "destructive",
          })
        }
      } finally {
        setDeleting(false)
      }
    }
  }

  const handleStatusChange = async (enrollmentId: number, newStatus: boolean) => {
    try {
      await updateEnrollment(enrollmentId, { ativo: newStatus } as any) 
      toast({
        title: "Status atualizado",
        description: `Inscrição ${newStatus ? "ativada" : "desativada"} com sucesso.`,
      })
    } catch (error) {
      if (error instanceof APIError) {
        toast({
          title: "Erro ao atualizar",
          description: error.message,
          variant: "destructive",
        })
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <PageHeader title="Lista de Inscrições">
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <Link href="/inscricoes/nova">
              <Button>Nova Inscrição</Button>
            </Link>
          </PageHeader>

          <APIErrorBanner message={error || undefined} />

          <Card>
            <CardHeader>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Pesquisar por pessoa ou curso..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pessoa</TableHead>
                      <TableHead>Curso</TableHead>
                      <TableHead>Nota</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEnrollments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                          Nenhuma inscrição encontrada
                        </TableCell>
                      </TableRow>
                    ) : (
                      // CORREÇÃO FINAL: Usa o array já corrigido e mapeia ele como 'any' para evitar erros de tipagem
                      (filteredEnrollments as any[]).map((enrollment) => (
                        <TableRow key={enrollment.id}>
                          {/* Propriedades corrigidas para 'pessoaId' e 'cursoId' */}
                          <TableCell className="font-medium">{getPersonName(enrollment.pessoaId)}</TableCell>
                          <TableCell>{getCourseName(enrollment.cursoId)}</TableCell>
                          <TableCell>{enrollment.nota ? enrollment.nota.toFixed(2) : "-"}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={enrollment.ativo}
                                onCheckedChange={(checked: boolean) => handleStatusChange(enrollment.id, checked)}
                              />
                              <Badge variant={enrollment.ativo ? "default" : "secondary"}>
                                {enrollment.ativo ? "Ativo" : "Inativo"}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => setDeleteId(enrollment.id)}
                            >
                              Excluir
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <DeleteConfirmationModal
        open={deleteId !== null}
        onOpenChange={(open: any) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
        title="Excluir Inscrição"
        loading={deleting}
      />
    </div>
  )
}

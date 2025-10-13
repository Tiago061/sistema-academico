import Link from "next/link"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Users, BookOpen, UserPlus } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Sistema Acadêmico</h1>
            <p className="text-lg text-muted-foreground">
              Gerencie pessoas, cursos e inscrições de forma simples e eficiente
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Pessoas</CardTitle>
                <CardDescription>Cadastre e gerencie pessoas no sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/pessoas">
                  <Button className="w-full">Gerenciar Pessoas</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>Cursos</CardTitle>
                <CardDescription>Cadastre e gerencie cursos disponíveis</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/cursos">
                  <Button className="w-full bg-transparent" variant="outline">
                    Gerenciar Cursos
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-chart-3/10 flex items-center justify-center mb-4">
                  <UserPlus className="w-6 h-6 text-chart-3" />
                </div>
                <CardTitle>Inscrições</CardTitle>
                <CardDescription>Gerencie inscrições de pessoas em cursos</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/inscricoes">
                  <Button className="w-full bg-transparent" variant="outline">
                    Gerenciar Inscrições
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

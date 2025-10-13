export interface Person {
  id: number
  nome: string
  email: string
  cpf: string
  createdAt?: string
  updatedAt?: string
}

export interface Course {
  id: number
  nome: string
  carga_horaria: number
  descricao?: string
  data_inicio: string
  data_fim: string
  createdAt?: string
  updatedAt?: string
}

export interface Enrollment {
  id: number
  pessoaId: number
  cursoId: number
  ativo: boolean
  nota: number | null
  createdAt?: string
  updatedAt?: string
  pessoa?: {
    id: number
    nome: string
    email: string
  }
  curso?: {
    id: number
    nome: string
    descricao?: string
  }
}

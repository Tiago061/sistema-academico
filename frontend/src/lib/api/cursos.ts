import { apiClient } from "./api-client"

export interface Curso {
  id: number
  nome: string
  descricao?: string
  carga_horaria: number
  data_inicio: string
  data_fim: string
  createdAt: string
  updatedAt: string
}

export interface CreateCursoDTO {
  nome: string
  descricao?: string
  carga_horaria: number
  data_inicio: string
  data_fim: string
}

export interface UpdateCursoDTO {
  nome?: string
  descricao?: string
  carga_horaria?: number
  data_inicio?: string
  data_fim?: string
}

export const cursosAPI = {
  getAll: () => apiClient.get<Curso[]>("/cursos"),

  getById: (id: number) => apiClient.get<Curso>(`/cursos/${id}`),

  create: (data: CreateCursoDTO) => apiClient.post<Curso>("/cursos", data),

  update: (id: number, data: UpdateCursoDTO) => apiClient.put<Curso>(`/cursos/${id}`, data),

  delete: (id: number) => apiClient.delete(`/cursos/${id}`),
}

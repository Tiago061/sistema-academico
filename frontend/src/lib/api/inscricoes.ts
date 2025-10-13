import { apiClient } from "./api-client"

export interface Inscricao {
  id: number
  pessoaId: number
  cursoId: number
  ativo: boolean
  nota: number | null
  createdAt: string
  updatedAt: string
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

export interface CreateInscricaoDTO {
  pessoaId: number
  cursoId: number
}

export interface UpdateInscricaoDTO {
  ativo?: boolean
  nota?: number
}

export interface InscricoesFilters {
  ativo?: boolean
  cursoId?: number
  pessoaId?: number
}

export const inscricoesAPI = {
  getAll: (filters?: InscricoesFilters) => {
    const params = new URLSearchParams()
    if (filters?.ativo !== undefined) params.append("ativo", String(filters.ativo))
    if (filters?.cursoId) params.append("cursoId", String(filters.cursoId))
    if (filters?.pessoaId) params.append("pessoaId", String(filters.pessoaId))

    const query = params.toString()
    return apiClient.get<Inscricao[]>(`/inscricoes${query ? `?${query}` : ""}`)
  },

  getById: (id: number) => apiClient.get<Inscricao>(`/inscricoes/${id}`),

  create: (data: CreateInscricaoDTO) => apiClient.post<Inscricao>("/inscricoes", data),

  update: (id: number, data: UpdateInscricaoDTO) => apiClient.put<Inscricao>(`/inscricoes/${id}`, data),

  delete: (id: number) => apiClient.delete(`/inscricoes/${id}`),
}

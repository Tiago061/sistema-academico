import { apiClient } from "./api-client"

export interface Pessoa {
  id: number
  nome: string
  email: string
  cpf: string
  createdAt: string
  updatedAt: string
}

export interface CreatePessoaDTO {
  nome: string
  email: string
  cpf: string
}

export interface UpdatePessoaDTO {
  nome?: string
  email?: string
  cpf?: string
}

export const pessoasAPI = {
  getAll: () => apiClient.get<Pessoa[]>("/pessoas"),

  getById: (id: number) => apiClient.get<Pessoa>(`/pessoas/${id}`),

  create: (data: CreatePessoaDTO) => apiClient.post<Pessoa>("/pessoas", data),

  update: (id: number, data: UpdatePessoaDTO) => apiClient.put<Pessoa>(`/pessoas/${id}`, data),

  delete: (id: number) => apiClient.delete(`/pessoas/${id}`),
}

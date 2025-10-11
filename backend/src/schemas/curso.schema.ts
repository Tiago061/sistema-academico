import { refine, z } from "zod";

export const createCursoSchema = z.object({
  nome: z.string().min(3, "Nome do curso é obrigatório."),
  descricao: z.string().optional(),
  carga_horaria: z.number().int().positive("Carga horária deve ser um número positivo."),
  data_inicio: z.string().datetime("Data de início inválida (formato ISO 8601 esperado).").pipe(z.coerce.date()),
  data_fim: z.string().datetime("Data de fim inválida (formato ISO 8601 esperado).").pipe(z.coerce.date())
})
.refine((data) => new Date(data.data_fim) > new Date(data.data_inicio), {
  message: "A data de fim deve ser posterior à data de início.",
  path: ["data_fim"],
}); 
// Refina para garantir que a data de fim é posterior à de início


export const updateCursoSchema = createCursoSchema.partial();

export type CreateCursoDTO = z.infer<typeof createCursoSchema>;
export type UpdateCursoDTO = z.infer<typeof updateCursoSchema>;
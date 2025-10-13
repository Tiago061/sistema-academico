import { z } from "zod";

// Regex para validar o formato "YYYY-MM-DD"
const dataRegex = /^\d{4}-\d{2}-\d{2}$/;

// Função auxiliar para converter string "YYYY-MM-DD" para objeto Date
const parseData = (valor: string) => {
  const [ano, mes, dia] = valor.split("-").map(Number);
  return new Date(ano, mes - 1, dia);
};

export const createCursoSchema = z
  .object({
    nome: z.string().min(3, "Nome do curso é obrigatório."),
    descricao: z.string().optional(),
    carga_horaria: z
      .number()
      .int()
      .positive("Carga horária deve ser um número positivo."),

    data_inicio: z
      .string()
      .regex(dataRegex, "Data de início deve estar no formato YYYY-MM-DD.")
      .transform(parseData),

    data_fim: z
      .string()
      .regex(dataRegex, "Data de fim deve estar no formato YYYY-MM-DD.")
      .transform(parseData),
  })
  .refine((data) => data.data_fim > data.data_inicio, {
    message: "A data de fim deve ser posterior à data de início.",
    path: ["data_fim"],
  });

export const updateCursoSchema = createCursoSchema.partial();

export type CreateCursoDTO = z.infer<typeof createCursoSchema>;
export type UpdateCursoDTO = z.infer<typeof updateCursoSchema>;

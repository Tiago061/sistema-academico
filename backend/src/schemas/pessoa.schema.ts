import { z } from "zod";

export const createPessoaSchema = z.object({
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("Formato de e-mail inválido"),
  cpf: z.string().regex(/^\d{11}$/, "CPF deve conter 11 dígitos.").trim(), // Apenas números
});

export const updatePessoaSchema = createPessoaSchema.partial();

export type CreatePessoaDTO = z.infer<typeof createPessoaSchema>;
export type UpdatePessoaDTO = z.infer<typeof updatePessoaSchema>;
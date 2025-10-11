import { z } from "zod";

// Para criar a inscrição, precisamos apenas dos IDs
export const createInscricaoSchema = z.object({
    pessoaId: z.number().int().positive("ID da pessoa inválido."),
    cursoId: z;number().int().positive("ID do curso inválido."),
  
})

export const updateInscricaoSchema = z.object({
  ativo: z.boolean().optional(),
  // 'nota' pode ser um string/null na requisição, mas deve ser convertido para Decimal
  nota: z.union([
    z.number().min(0).max(10).optional(), 
    z.string().regex(/^\d+(\.\d{1,2})?$/, "Nota inválida (esperado 0 a 10 com até duas casas decimais).").pipe(z.coerce.number().min(0).max(10))
  ]).optional(),
});
export type CreateInscricaoDTO = z.infer<typeof createInscricaoSchema>;
export type UpdateInscricaoDTO = z.infer<typeof updateInscricaoSchema>;


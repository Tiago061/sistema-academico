import { registry } from "zod";
import { prisma } from "../database/prisma";
import { CreateInscricaoDTO, UpdateInscricaoDTO } from "../schemas/inscricao.schema";
import { ConflictError, NotFoundError } from "../config/errors";

export class InscricaoService {

    // Adiciona filtros opcionais para ativo, cursoId e pessoaId
    async getInscricoes(filtroAtivo?: boolean, cursoId?: number, pessoaId?: number){

        const ativoFilter = filtroAtivo !== undefined ? Boolean(filtroAtivo) : {};
        const cursoFilter = cursoId ? Number(cursoId) : {};
        const pessoaFilter = pessoaId ? Number(pessoaId) : {};

        return await prisma.inscricao.findMany({
            where: {
                ativo: ativoFilter,
                cursoId: cursoFilter,
                pessoaId: pessoaFilter
            },
            // Inclui os dados da Pessoa e do Curso na resposta
            include: { 
                pessoa: { select: { id: true, nome: true, email: true } },
                curso: { select: { id: true, nome: true, descricao: true } }
             },
            orderBy: { createdAt: 'asc' },
        });
        
    }

    async getInscricaoById(id: number){
        const inscricao = await prisma.inscricao.findUnique({ where: { id }});
        if(!inscricao){
            throw new NotFoundError(`Inscrição com ID ${id} não encontrada.`);
        }
        return inscricao;
    }
    

    async createInscricao({pessoaId, cursoId}: CreateInscricaoDTO){

        const pessoa = await prisma.pessoa.findUnique({
            where: { id: pessoaId }
        });
        const curso = await prisma.curso.findUnique({
            where: { id: cursoId }
        }); 

        if(!pessoa){
            throw new ConflictError('Pessoa não encontrada.');
        }
        if(!curso){
            throw new ConflictError('Curso não encontrado.');
        }

        // Verifica se já existe um inscricao com o mesmo nome
        const exitingInscricao = await prisma.inscricao.findUnique({
            where: { pessoaId_cursoId: { pessoaId, cursoId } }
        });

        if(exitingInscricao){
            throw new ConflictError('JEsta pessoa já está inscrita neste curso.');
        }

        return await prisma.inscricao.create({  data: { pessoaId, cursoId }});
    }

    async updateInscricao(id: number, data: UpdateInscricaoDTO){
        const inscricao = await prisma.inscricao.findUnique({ where: { id }});
        if(!inscricao){
            throw new ConflictError(`Inscrição com ID ${id} não encontrada.`);
        }
        return await prisma.inscricao.update({
            where: { id },
            data: {
                ativo: data.ativo,
                nota: data.nota !== undefined ? data.nota : undefined // Permite atualizar a nota se fornecida
            }
        });
    }

    async deleteInscricao(id: number){
        const inscricao = await prisma.inscricao.findUnique({ where: { id }});
        if(!inscricao){
            throw new NotFoundError(`Inscrição com ID ${id} não encontrada.`);
        }
        await prisma.inscricao.delete({ where: { id }});
    }
}
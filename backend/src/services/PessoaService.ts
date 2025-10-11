import { ConflictError, NotFoundError } from "../config/errors";
import { prisma } from "../database/prisma";
import { CreatePessoaDTO } from "../schemas/pessoa.schema";

export class PessoaService {

    async getPessoas(){
        const pessoas = await prisma.pessoa.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return pessoas;
    }

    async getPessoaById(id: number){
        const pessoa = await prisma.pessoa.findUnique({ where: { id }});
        if(!pessoa){
            throw new NotFoundError(`Pessoa com ID ${id} não encontrada.`);
        }
        return pessoa;
    }

    async createPessoa(data: CreatePessoaDTO){
        // Verifica se já existe uma pessoa com o mesmo email
        const existingPessoa = await prisma.pessoa.findFirst({
            where: { OR: [{ email: data.email }, { cpf: data.cpf }] },
        });

        if(existingPessoa){

            if(existingPessoa.email === data.email){
                throw new ConflictError('Email já cadastrado.');
            }

             if(existingPessoa.cpf === data.cpf){
                throw new ConflictError('CPF já cadastrado.');
            }
        }
        return await prisma.pessoa.create({ data });
    }

    async deletePessoa(id: number){
        await this.checkPessoaExists(id);
         // Regra de Negócio: Pode ser necessário checar se a pessoa tem inscrições ativas
        const inscricoesAtivas = await prisma.inscricao.count({
            where: { pessoaId: id, ativo: true }
        });

        if(inscricoesAtivas > 0){
            throw new ConflictError('Não é possível deletar a pessoa pois ela possui inscrições ativas.');
        }
        return await prisma.pessoa.delete({ where: { id }});
    }

    private async checkPessoaExists(id: number){
        const pessoa = await prisma.pessoa.findUnique({ where: { id }});
        if(!pessoa){
            throw new NotFoundError(`Pessoa com ID ${id} não encontrada.`);
        } 
    }
}


import { registry } from "zod";
import { prisma } from "../database/prisma";
import { CreateCursoDTO, UpdateCursoDTO } from "../schemas/curso.schema";

export class CursoService {

    
    async getCursos(){
        return await prisma.curso.findMany()
        
    }

    async getCursoById(id: number){
        const curso = await prisma.curso.findUnique({
            where: { id },
            include: {
                inscricoes: true // Inclui as inscrições relacionadas ao curso
            }
        });
        if(!curso){
            throw new Error('Curso não encontrado.');
        }
        return curso;
    }
    

    async createCurso(data: CreateCursoDTO){
        // Verifica se já existe um curso com o mesmo nome
        const exitingCurso = await prisma.curso.findUnique({
            where: { nome: data.nome }
        });

        if(exitingCurso){
            throw new Error('Já existe um curso com esse nome.');
        }

        return await prisma.curso.create({data});
    }

    async updateCurso(id: number, data: UpdateCursoDTO){
        // Verifica se o curso existe
        const existingCurso = await prisma.curso.findUnique({
            where: { id }
        });
        if(!existingCurso){
            throw new Error('Curso não encontrado.');
        }
        // Verifica se já existe outro curso com o mesmo nome
        if(data.nome && data.nome !== existingCurso.nome){
            const cursoWithSameName = await prisma.curso.findUnique({
                where: { nome: data.nome }
            });
            if(cursoWithSameName){
                throw new Error('Já existe outro curso com esse nome.');
            }
        }
        return await prisma.curso.update({
            where: { id },
            data
        });
    }

    async deleteCurso(id: number){
        // Validação de Negócio: Checar se existem inscrições ativas
        const inscricoes = await prisma.inscricao.count({
            where: { cursoId: id, ativo: true }
        });
        if(inscricoes > 0){
            throw new Error('Não é possível deletar o curso, existem inscrições ativas.');
        }
        return await prisma.curso.delete({
            where: { id }
        });
    }
}
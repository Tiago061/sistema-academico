import { Request, Response, NextFunction } from "express";
import { createInscricaoSchema, updateInscricaoSchema } from "../schemas/inscricao.schema";
import { InscricaoService } from "../services/InscricaoService.service";
import { registry } from "zod";



export class InscricaoController{

  

    private inscricaoService: InscricaoService;

    constructor(){
        this.inscricaoService = new InscricaoService()
    }

    // POST /api/inscricoes
    async create(req: Request, res: Response, next: NextFunction){
        try {
            const data = createInscricaoSchema.parse(req.body)
            const novaInscricao = await this.inscricaoService.createInscricao(data)

            return res.status(201).json(novaInscricao)
        }catch(error){
            next(error)
        }
    }

    // GET /api/inscricoes?ativo=true&cursoId=1
    async getAll(req: Request, res: Response, next: NextFunction){
        try{
            const { ativo, cursoId, pessoaId} = req.query;

            const inscricoes = await this.inscricaoService.getInscricoes(
                ativo ? ativo === 'true' : undefined,
                cursoId ? Number(cursoId): undefined,
                pessoaId ? Number(pessoaId) : undefined
            )

            return res.json(inscricoes)

        }catch(error){
            next(error);
        }
    }
    
    async getById(req: Request, res: Response, next: NextFunction){
        try{
            const id = parseInt(req.params.id)
            const inscricoes = await this.inscricaoService.getInscricaoById(id)
            return res.json(inscricoes)
        } catch(error){
            next(error)
        }
    }

    // PUT /api/inscricoes/:id
    async update(req: Request, res: Response, next: NextFunction){
        try{
            const id = parseInt(req.params.id)
            const data = updateInscricaoSchema.parse(req.body)

            const inscricaoAtualizada = await this.inscricaoService.updateInscricao(id, data)

            return res.json(inscricaoAtualizada)
        }catch (error){
            next(error)
        }
    }

    // DELETE /api/inscricoes/:id
    async delete(req: Request, res: Response, next: NextFunction){
        try{
            const id = parseInt(req.params.id)
            await this.inscricaoService.deleteInscricao(id)
            return res.status(204).send()
        }catch (error){
            next(error)
        }
    }
}
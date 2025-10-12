import { Request, Response, NextFunction } from "express";
import { createInscricaoSchema, updateInscricaoSchema } from "../schemas/inscricao.schema";
import { InscricaoService } from "../services/InscricaoService.service";




export class InscricaoController{

  

    private inscricaoService: InscricaoService;

    constructor(){
        this.inscricaoService = new InscricaoService()
    }

    // POST /inscricoes
    async create(req: Request, res: Response, next: NextFunction): Promise<Response | void>{
        try {
            const data = createInscricaoSchema.parse(req.body)
            const novaInscricao = await this.inscricaoService.createInscricao(data)

            return res.status(201).json(novaInscricao)
        }catch(error){
            next(error)
        }
    }

    // GET /inscricoes?ativo=true&cursoId=1
    async getAll(req: Request, res: Response, next: NextFunction): Promise<Response | void>{
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
    
    async getById(req: Request, res: Response, next: NextFunction): Promise<Response | void>{
        try{
            const id = parseInt(req.params.id)
            //retorna true se não for um número (ex: "abc", "", undefined, etc).
                if(isNaN(id)){
                    return res.status(400).json({error: "ID inválido"})
                }
            const inscricoes = await this.inscricaoService.getInscricaoById(id)
            return res.json(inscricoes)
        } catch(error){
            next(error)
        }
    }

    // PUT /inscricoes/:id
    async update(req: Request, res: Response, next: NextFunction): Promise<Response | void>{
        try{
            const id = parseInt(req.params.id)
            //retorna true se não for um número (ex: "abc", "", undefined, etc).
                if(isNaN(id)){
                    return res.status(400).json({error: "ID inválido"})
                }
            const data = updateInscricaoSchema.parse(req.body)

            const inscricaoAtualizada = await this.inscricaoService.updateInscricao(id, data)

            return res.json(inscricaoAtualizada)
        }catch (error){
            next(error)
        }
    }

    // DELETE /inscricoes/:id
    async delete(req: Request, res: Response, next: NextFunction): Promise<Response | void>{
        try{
            const id = parseInt(req.params.id)
            //retorna true se não for um número (ex: "abc", "", undefined, etc).
                if(isNaN(id)){
                    return res.status(400).json({error: "ID inválido"})
                }
            await this.inscricaoService.deleteInscricao(id)
            return res.status(204).send()
        }catch (error){
            next(error)
        }
    }
}
import { createPessoaSchema, updatePessoaSchema } from "../schemas/pessoa.schema";
import { PessoaService } from "../services/PessoaService.service";
import { Request, Response, NextFunction } from "express";


export class PessoaController {
    private pessoaService: PessoaService;

    constructor(){
        this.pessoaService = new PessoaService()
    }

    // POST /pessoas
        async create(req: Request, res: Response, next: NextFunction): Promise<Response | void>{
            try {
                const data = createPessoaSchema.parse(req.body)
                const novaPessoa = await this.pessoaService.createPessoa(data)
    
                return res.status(201).json(novaPessoa)
            }catch(error){
                next(error)
            }
        }
    
        // GET /pessoas?ativo=true&cursoId=1
        async getAll(req: Request, res: Response, next: NextFunction): Promise<Response | void>{
            try{
                const pessoas = await this.pessoaService.getPessoas()
                return res.json(pessoas)
    
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
                const pessoas = await this.pessoaService.getPessoaById(id)
                return res.json(pessoas)
            } catch(error){
                next(error)
            }
        }
    
        // PUT /pessoas/:id
        async update(req: Request, res: Response, next: NextFunction): Promise<Response | void>{
            try{
                const id = parseInt(req.params.id)
                //retorna true se não for um número (ex: "abc", "", undefined, etc).
                if(isNaN(id)){
                    return res.status(400).json({error: "ID inválido"})
                }
                const data = updatePessoaSchema.parse(req.body)
    
                const pessoaAtualizada = await this.pessoaService.updatePessoa(id, data)
    
                return res.json(pessoaAtualizada)
            }catch (error){
                next(error)
            }
        }
    
        // DELETE /pessoas/:id
        async delete(req: Request, res: Response, next: NextFunction): Promise<Response | void>{
            try{
                const id = parseInt(req.params.id)
                //retorna true se não for um número (ex: "abc", "", undefined, etc).
                if(isNaN(id)){
                    return res.status(400).json({error: "ID inválido"})
                }
                await this.pessoaService.deletePessoa(id)
                return res.status(204).send()
            }catch (error){
                next(error)
            }
        }
    }
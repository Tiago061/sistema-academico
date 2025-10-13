import { Request, Response, NextFunction } from "express";
import { createCursoSchema, updateCursoSchema } from "../schemas/curso.schema";
import { CursoService } from "../services/curso.service";

export class CursoController{
    private cursoService: CursoService;

    constructor(){
        this.cursoService = new CursoService()
    }
    // POST /cursos
        async create(req: Request, res: Response, next: NextFunction): Promise<Response | void>{
            try {
                const data = createCursoSchema.parse(req.body)
                const novaCurso = await this.cursoService.createCurso(data)
    
                return res.status(201).json(novaCurso)
            }catch(error){
                next(error)
            }
        }
    
        // GET /cursos?ativo=true&cursoId=1
        async getAll(req: Request, res: Response, next: NextFunction): Promise<Response | void>{
            try{
                const cursos = await this.cursoService.getCursos()
                return res.json(cursos)
    
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
                const cursos = await this.cursoService.getCursoById(id)
                return res.json(cursos)
            } catch(error){
                next(error)
            }
        }
    
        // PUT /cursos/:id
        async update(req: Request, res: Response, next: NextFunction): Promise<Response | void>{
            try{
                const id = parseInt(req.params.id)
                //retorna true se não for um número (ex: "abc", "", undefined, etc).
                if(isNaN(id)){
                    return res.status(400).json({error: "ID inválido"})
                }
                const data = updateCursoSchema.parse(req.body)
    
                const cursoAtualizada = await this.cursoService.updateCurso(id, data)
    
                return res.json(cursoAtualizada)
            }catch (error){
                next(error)
            }
        }
    
        // DELETE /cursos/:id
        async delete(req: Request, res: Response, next: NextFunction): Promise<Response | void>{
            try{
                const id = parseInt(req.params.id)
                //retorna true se não for um número (ex: "abc", "", undefined, etc).
                if(isNaN(id)){
                    return res.status(400).json({error: "ID inválido"})
                }
                await this.cursoService.deleteCurso(id)
                return res.status(204).send()
            }catch (error){
                next(error)
            }
        }

    
}
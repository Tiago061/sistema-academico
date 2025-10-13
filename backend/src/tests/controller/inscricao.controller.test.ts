
import { Request, Response, NextFunction } from "express";
import { InscricaoController } from "../../controllers/inscricao.controller";
import { InscricaoService } from "../../services/inscricao.service";

jest.mock("../../src/services/inscricao.service");


type MockInscricaoDetalhada = {
    id: number;
    pessoaId: number;
    cursoId: number;
    ativo: boolean;
    nota: any | null; 
    createdAt: Date;
    updatedAt: Date;
    pessoa: { id: number; nome: string; email: string };
    curso: { id: number; nome: string; descricao: string | null };
};


const mockPessoa = { id: 10, nome: "João", email: "joao@example.com" };
const mockCurso = { id: 20, nome: "Node.js Avançado", descricao: "Curso de backend" };


const mockInscricaoSimples = {
    id: 1,
    pessoaId: 10,
    cursoId: 20,
    ativo: true,
    nota: null,
    createdAt: new Date(),
    updatedAt: new Date(),
};


const mockInscricaoCompleta: MockInscricaoDetalhada = {
    ...mockInscricaoSimples,
    pessoa: mockPessoa,
    curso: mockCurso,
};


const MockedInscricaoService = InscricaoService as jest.MockedClass<typeof InscricaoService>;




describe("InscricaoController", () => {
    let controller: InscricaoController;
  
    let mockService: jest.Mocked<InscricaoService>;
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        
        MockedInscricaoService.mockClear();
        
        const serviceInstance = new MockedInscricaoService();
        mockService = serviceInstance as jest.Mocked<InscricaoService>;
        
        controller = new InscricaoController();
      
        (controller as any).inscricaoService = mockService; 

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
        };

        req = {};
        next = jest.fn();
    });

    
    it("deve criar uma nova inscrição (create)", async () => {
        req.body = { pessoaId: 10, cursoId: 20, ativo: true };
        mockService.createInscricao.mockResolvedValueOnce(mockInscricaoSimples as any); 

        // O payload esperado no serviço após o controller filtrar ou processar o `ativo`
        const expectedPayload = { pessoaId: 10, cursoId: 20 };

        await controller.create(req as Request, res as Response, next);

        
        expect(mockService.createInscricao).toHaveBeenCalledWith(expectedPayload); 
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(mockInscricaoSimples);
    });

    
    it("deve retornar todas as inscrições (getAll)", async () => {
        const inscricoes = [mockInscricaoCompleta]; 
      
        req.query = { ativo: "true", pessoaId: "10" }; 

        mockService.getInscricoes.mockResolvedValueOnce(inscricoes as any); 

        await controller.getAll(req as Request, res as Response, next);

      
        expect(mockService.getInscricoes).toHaveBeenCalledWith(true, undefined, 10); 
        expect(res.json).toHaveBeenCalledWith(inscricoes);
    });

    
    it("deve retornar uma inscrição por ID", async () => {
        req.params = { id: "1" };
       
        mockService.getInscricaoById.mockResolvedValueOnce(mockInscricaoCompleta as any);

        await controller.getById(req as Request, res as Response, next);

        expect(mockService.getInscricaoById).toHaveBeenCalledWith(1);
        expect(res.json).toHaveBeenCalledWith(mockInscricaoCompleta);
    });

   
    it("deve atualizar uma inscrição", async () => {
        req.params = { id: "1" };
        req.body = { ativo: false };
        const updated = { ...mockInscricaoSimples, ativo: false };
        mockService.updateInscricao.mockResolvedValueOnce(updated as any);

        await controller.update(req as Request, res as Response, next);

        expect(mockService.updateInscricao).toHaveBeenCalledWith(1, req.body);
        expect(res.json).toHaveBeenCalledWith(updated);
    });

  
    it("deve deletar uma inscrição", async () => {
        req.params = { id: "1" };
        mockService.deleteInscricao.mockResolvedValueOnce(mockInscricaoSimples as any); 

        await controller.delete(req as Request, res as Response, next);

        expect(mockService.deleteInscricao).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.send).toHaveBeenCalled();
    });
});
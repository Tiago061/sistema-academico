jest.mock('../../src/database/prisma', () => ({
  prisma: require('../__mocks__/prisma').prisma,
}));

import { InscricaoService } from '../../src/services/InscricaoService.service';
import { NotFoundError, ConflictError } from '../../src/config/errors';
import { prisma } from '../__mocks__/prisma';

describe('InscricaoService', () => {
    let service: InscricaoService;
    beforeEach(() => {
        service = new InscricaoService();
        jest.clearAllMocks();
    });

    //getInscricoes
    it('deve retornar lista de inscrições com filtros aplicados', async () => {
        const mockData = [
            { id: 1, ativo: true },
        ];
        prisma.inscricao.findMany.mockResolvedValue(mockData);

        const result = await service.getInscricoes(true, 1, 1);

        expect(prisma.inscricao.findMany).toHaveBeenCalledWith({
            where: {
                ativo: true,
                cursoId: 1,
                pessoaId: 1
            },
            include: {
                curso: { select: { id: true, nome: true, descricao: true } },
                pessoa: { select: { id: true, nome: true, email: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        expect(result).toEqual(mockData);
    });

    it('deve retornar uma inscrição por ID', async () => {
        const mockInscricao = { id: 1, pessoaId: 2, cursoId: 3};
        prisma.inscricao.findUnique.mockResolvedValue(mockInscricao);

        const result = await service.getInscricaoById(1);

        expect(result).toEqual(mockInscricao);
        expect(prisma.inscricao.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('deve lançar NotFoundError se inscrição não for encontrada', async () => {
        prisma.inscricao.findUnique.mockResolvedValue(null);

        await expect(service.getInscricaoById(999)).rejects.toThrow(NotFoundError);
     });

     //createInscricao
        it('deve criar uma nova inscrição', async () => {
            prisma.pessoa.findUnique.mockResolvedValue({ id: 1 });
            prisma.curso.findUnique.mockResolvedValue({ id: 1 });
            prisma.inscricao.findUnique.mockResolvedValue(null);
            prisma.inscricao.create.mockResolvedValue({ id: 1, pessoaId: 1, cursoId: 1 });

            const result = await service.createInscricao({ pessoaId: 1, cursoId: 1 });

            expect(result).toEqual({ id: 1, pessoaId: 1, cursoId: 1 });
            expect(prisma.inscricao.create).toHaveBeenCalledWith({ data: { pessoaId: 1, cursoId: 1 } });
        });

        it('deve lançar ConflictError se pessoa não for encontrada ao criar inscrição', async () => {
            prisma.pessoa.findUnique.mockResolvedValue(null);

            await expect(service.createInscricao({ pessoaId: 999, cursoId: 1 })).rejects.toThrow(ConflictError);
        });

        it('deve lançar ConflictError se curso não for encontrado ao criar inscrição', async () => {
            prisma.pessoa.findUnique.mockResolvedValue({ id: 1 });
            prisma.curso.findUnique.mockResolvedValue(null);

            await expect(service.createInscricao({ pessoaId: 1, cursoId: 999 })).rejects.toThrow(ConflictError);
        });

        it('deve lançar ConflictError se pessoa já estiver inscrita no curso', async () => {
            prisma.pessoa.findUnique.mockResolvedValue({ id: 1 });
            prisma.curso.findUnique.mockResolvedValue({ id: 1 });
            prisma.inscricao.findUnique.mockResolvedValue({ id: 1, pessoaId: 1, cursoId: 1 });

            await expect(service.createInscricao({ pessoaId: 1, cursoId: 1 })).rejects.toThrow(ConflictError);
        });

    //updateInscricao
    it('deve atualizar uma inscrição existente', async () => {
        prisma.inscricao.findUnique.mockResolvedValue({ id: 1 });
        prisma.inscricao.update.mockResolvedValue({ id: 1, ativo: false, nota: 9 });

        const result = await service.updateInscricao(1, { ativo: false, nota: 9 });

        expect(result).toEqual({ id: 1, ativo: false, nota: 9 });
        expect(prisma.inscricao.update).toHaveBeenCalledWith({
            where: { id: 1 },
            data: { ativo: false, nota: 9 }
        });
    });

    it('deve lançar ConflictError se inscrição não for encontrada ao atualizar', async () => {
        prisma.inscricao.findUnique.mockResolvedValue(null);

        await expect(service.updateInscricao(999, { ativo: false })).rejects.toThrow(ConflictError);
    });

    //deleteInscricao
    it('deve deletar uma inscrição existente', async () => {
        prisma.inscricao.findUnique.mockResolvedValue({ id: 1 });
        prisma.inscricao.delete.mockResolvedValue({ id: 1 });

        await service.deleteInscricao(1);
        expect(prisma.inscricao.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('deve lançar NotFoundError se inscrição não for encontrada ao deletar', async () => {
        prisma.inscricao.findUnique.mockResolvedValue(null);

        await expect(service.deleteInscricao(999)).rejects.toThrow(NotFoundError);
    });
});


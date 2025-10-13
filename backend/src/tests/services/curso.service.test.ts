jest.mock('../../src/database/prisma', () => ({
  prisma: require('../__mocks__/prisma').prisma,
}));


import { ConflictError, NotFoundError } from '../../config/errors';
import { CursoService } from '../../services/curso.service';
import { prisma } from '../__mocks__/prisma';


describe('CursoService', () => {
  let service: CursoService;

  beforeEach(() => {
    service = new CursoService();
    jest.clearAllMocks();
  });

  // getCursos
  it('deve retornar lista de cursos', async () => {
    const mockCursos = [{ id: 1, nome: 'Curso A' }];
    prisma.curso.findMany.mockResolvedValue(mockCursos);

    const result = await service.getCursos();

    expect(result).toEqual(mockCursos);
    expect(prisma.curso.findMany).toHaveBeenCalled();
  });

  // getCursoById
  it('deve retornar curso pelo ID', async () => {
    const mockCurso = { id: 1, nome: 'Curso A', inscricoes: [] };
    prisma.curso.findUnique.mockResolvedValue(mockCurso);

    const result = await service.getCursoById(1);

    expect(result).toEqual(mockCurso);
    expect(prisma.curso.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      include: { inscricoes: true },
    });
  });

  it('deve lançar NotFoundError se curso não existir', async () => {
    prisma.curso.findUnique.mockResolvedValue(null);

    await expect(service.getCursoById(999))
      .rejects
      .toThrow(new NotFoundError('Curso não encontrado.'));
  });

  // createCurso
  it('deve criar um novo curso se não existir conflito', async () => {
    prisma.curso.findUnique.mockResolvedValue(null);
    prisma.curso.create.mockResolvedValue({ id: 1, nome: 'Curso Novo' });

    const data = { nome: 'Curso Novo', descricao: 'Descrição', carga_horaria: 40, data_inicio: new Date('2025-01-01'), data_fim: new Date('2025-02-01')};
    const result = await service.createCurso(data);

    expect(result).toEqual({ id: 1, nome: 'Curso Novo' });
    expect(prisma.curso.create).toHaveBeenCalledWith({ data });
  });

  it('deve lançar ConflictError se já existir curso com mesmo nome', async () => {
    prisma.curso.findUnique.mockResolvedValue({ id: 2, nome: 'Curso Novo' });

    const data = { nome: 'Curso Novo', descricao: 'Descrição', carga_horaria: 40, data_inicio: new Date('2025-01-01'), data_fim: new Date('2025-02-01')};
    await expect(service.createCurso(data))
      .rejects
      .toThrow(new ConflictError('Já existe um curso com esse nome.'));
  });

  // updateCurso
  it('deve atualizar curso existente sem conflito de nome', async () => {
    prisma.curso.findUnique
      .mockResolvedValueOnce({ id: 1, nome: 'Curso A' }) // curso existente
      .mockResolvedValueOnce(null); // nenhum curso com mesmo nome
    prisma.curso.update.mockResolvedValue({ id: 1, nome: 'Curso B' });

    const result = await service.updateCurso(1, { nome: 'Curso B' });

    expect(result).toEqual({ id: 1, nome: 'Curso B' });
    expect(prisma.curso.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { nome: 'Curso B' },
    });
  });

  it('deve lançar ConflictError se curso não existir', async () => {
    prisma.curso.findUnique.mockResolvedValue(null);

    await expect(service.updateCurso(999, { nome: 'Teste' }))
      .rejects
      .toThrow(new ConflictError('Curso não encontrado.'));
  });

  it('deve lançar ConflictError se já existir outro curso com mesmo nome', async () => {
    prisma.curso.findUnique
      .mockResolvedValueOnce({ id: 1, nome: 'Curso A' }) // curso existente
      .mockResolvedValueOnce({ id: 2, nome: 'Curso B' }); // outro curso com mesmo nome

    await expect(service.updateCurso(1, { nome: 'Curso B' }))
      .rejects
      .toThrow(new ConflictError('Já existe outro curso com esse nome.'));
  });

  //deleteCurso
  it('deve deletar curso sem inscrições ativas', async () => {
    prisma.inscricao.count.mockResolvedValue(0);
    prisma.curso.delete.mockResolvedValue({ id: 1 });

    const result = await service.deleteCurso(1);

    expect(result).toEqual({ id: 1 });
    expect(prisma.curso.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('deve lançar ConflictError se curso tiver inscrições ativas', async () => {
    prisma.inscricao.count.mockResolvedValue(3);

    await expect(service.deleteCurso(1))
      .rejects
      .toThrow(new ConflictError('Não é possível deletar o curso, existem inscrições ativas.'));
  });
});
jest.mock('../../src/database/prisma', () => ({
  prisma: require('../__mocks__/prisma').prisma,
}))


import { prisma } from '../__mocks__/prisma'
import { ConflictError, NotFoundError } from '../../config/errors';
import { PessoaService } from '../../services/pessoa.service';

describe('PessoaService', () => {
    let service: PessoaService

    beforeEach(() => {
        service = new PessoaService()
        jest.clearAllMocks()
    })

    //getPessoas
    it('deve retornar a lista de pessoas ordenada', async () => {
      const mockPessoas = [{ id: 1, nome: 'Tiago'}]
      prisma.pessoa.findMany.mockResolvedValue(mockPessoas)

      const result = await service.getPessoas()

      expect(result).toEqual(mockPessoas)
      expect(prisma.pessoa.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc'}
      })
    })

    //getPessoaById
  it('deve retornar pessoa pelo ID', async () => {
    const mockPessoa = { id: 1, nome: 'Maria' }
    prisma.pessoa.findUnique.mockResolvedValue(mockPessoa)

    const result = await service.getPessoaById(1)

    expect(result).toEqual(mockPessoa)
    expect(prisma.pessoa.findUnique).toHaveBeenCalledWith({ where: { id: 1 } })
  })

  it('deve lançar NotFoundError se pessoa não existir', async () => {
    prisma.pessoa.findUnique.mockResolvedValue(null)

    await expect(service.getPessoaById(999))
      .rejects
      .toThrow(new NotFoundError('Pessoa com ID 999 não encontrada.'))
  })

  //createPessoa
  it('deve criar uma nova pessoa se não houver conflito', async () => {
    prisma.pessoa.findFirst.mockResolvedValue(null)
    prisma.pessoa.create.mockResolvedValue({ id: 1, nome: 'Ana' })

    const data = { nome: 'Ana', email: 'ana@test.com', cpf: '123' }
    const result = await service.createPessoa(data)

    expect(result).toEqual({ id: 1, nome: 'Ana' })
    expect(prisma.pessoa.create).toHaveBeenCalledWith({ data })
  })

  it('deve lançar erro se email já estiver cadastrado', async () => {
    prisma.pessoa.findFirst.mockResolvedValue({ id: 2, email: 'ana@test.com' })

    const data = { nome: 'Ana', email: 'ana@test.com', cpf: '123' }
    await expect(service.createPessoa(data))
      .rejects
      .toThrow(new ConflictError('Email já cadastrado.'))
  })

  it('deve lançar erro se CPF já estiver cadastrado', async () => {
    prisma.pessoa.findFirst.mockResolvedValue({ id: 2, cpf: '123' })

    const data = { nome: 'Ana', email: 'outro@test.com', cpf: '123' }
    await expect(service.createPessoa(data))
      .rejects
      .toThrow(new ConflictError('CPF já cadastrado.'));
  })

   //updatePessoa
  it('deve atualizar pessoa existente sem conflitos', async () => {
    prisma.pessoa.findUnique.mockResolvedValue({ id: 1 });
    prisma.pessoa.findFirst.mockResolvedValue(null);
    prisma.pessoa.update.mockResolvedValue({ id: 1, nome: 'Carlos' });

    const result = await service.updatePessoa(1, { nome: 'Carlos' });

    expect(result).toEqual({ id: 1, nome: 'Carlos' });
    expect(prisma.pessoa.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { nome: 'Carlos' },
    });
  });

  it('deve lançar erro se pessoa não existir ao atualizar', async () => {
    prisma.pessoa.findUnique.mockResolvedValue(null);

    await expect(service.updatePessoa(999, { nome: 'Teste' }))
      .rejects
      .toThrow(new NotFoundError('Pessoa com ID 999 não encontrada.'));
  });

  it('deve lançar erro se email já estiver em uso por outra pessoa', async () => {
    prisma.pessoa.findUnique.mockResolvedValue({ id: 1 });
    prisma.pessoa.findFirst.mockResolvedValue({ id: 2, email: 'teste@test.com' });

    await expect(service.updatePessoa(1, { email: 'teste@test.com' }))
      .rejects
      .toThrow(new ConflictError('Email já cadastrado.'));
  });

  it('deve lançar erro se CPF já estiver em uso por outra pessoa', async () => {
    prisma.pessoa.findUnique.mockResolvedValue({ id: 1 });
    prisma.pessoa.findFirst.mockResolvedValue({ id: 2, cpf: '123', email: 'outro@test.com' }); // Simula que já existe outra pessoa (id 2) com o mesmo CPF

    const cpfDuplicado = '123';

    await expect(service.updatePessoa(1, { cpf: '123' }))
      .rejects
      .toThrow(new ConflictError('CPF já cadastrado.'));

      expect(prisma.pessoa.findFirst).toHaveBeenCalledWith({
    where: {
      AND: [
        { id: { not: 1 } },
        { OR: [{ email: undefined }, { cpf: cpfDuplicado }] }
      ]
    }
  });
  });

  // deletePessoa
  it('deve deletar pessoa se não houver inscrições ativas', async () => {
    prisma.pessoa.findUnique.mockResolvedValue({ id: 1 });
    prisma.inscricao.count.mockResolvedValue(0);
    prisma.pessoa.delete.mockResolvedValue({ id: 1 });

    const result = await service.deletePessoa(1);

    expect(result).toEqual({ id: 1 });
    expect(prisma.pessoa.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('deve lançar erro se pessoa não existir ao deletar', async () => {
    prisma.pessoa.findUnique.mockResolvedValue(null);

    await expect(service.deletePessoa(999))
      .rejects
      .toThrow(new NotFoundError('Pessoa com ID 999 não encontrada.'));
  });

  it('deve lançar erro se pessoa tiver inscrições ativas', async () => {
    prisma.pessoa.findUnique.mockResolvedValue({ id: 1 });
    prisma.inscricao.count.mockResolvedValue(2);

    await expect(service.deletePessoa(1))
      .rejects
      .toThrow(new ConflictError('Não é possível deletar a pessoa pois ela possui inscrições ativas.'));
  })

})
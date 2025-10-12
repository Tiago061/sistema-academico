import { PessoaController } from "../../src/controllers/pessoa.controller";
import { createPessoaSchema, updatePessoaSchema } from "../../src/schemas/pessoa.schema";
import { PessoaService } from "../../src/services/pessoa.service";

jest.mock("../../src/services/pessoa.service");
jest.mock("../../src/schemas/pessoa.schema");

describe("PessoaController", () => {
  let pessoaController: PessoaController;
  let mockPessoaService: jest.Mocked<PessoaService>;
  let mockReq: any;
  let mockRes: any;
  let mockNext: jest.Mock;

  const pessoaMock = {
    id: 1,
    nome: "Maria",
    email: "joao@email.com",
    cpf: "01997616088",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    mockPessoaService = new PessoaService() as jest.Mocked<PessoaService>;
    pessoaController = new PessoaController();
    (pessoaController as any).pessoaService = mockPessoaService;

    mockReq = { params: {}, body: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  // ---------- CREATE ----------
  it("deve criar uma nova pessoa com sucesso", async () => {
    const mockData = { nome: "Tiago", email: "tiago@email.com", cpf: "01997616900" };
    (createPessoaSchema.parse as jest.Mock).mockReturnValue(mockData);
    mockPessoaService.createPessoa.mockResolvedValue({ id: 1, ...mockData, createdAt: new Date(), updatedAt: new Date() });

    mockReq.body = mockData;

    await pessoaController.create(mockReq, mockRes, mockNext);

    expect(createPessoaSchema.parse).toHaveBeenCalledWith(mockData);
    expect(mockPessoaService.createPessoa).toHaveBeenCalledWith(mockData);
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining(mockData));
  });

  it("deve chamar next(error) se ocorrer erro no create", async () => {
    const error = new Error("Erro");
    (createPessoaSchema.parse as jest.Mock).mockImplementation(() => { throw error; });
    mockReq.body = {};

    await pessoaController.create(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalledWith(error);
  });

  // ---------- GET ALL ----------
  it("deve retornar todas as pessoas", async () => {
    mockPessoaService.getPessoas.mockResolvedValue([pessoaMock]);

    await pessoaController.getAll(mockReq, mockRes, mockNext);

    expect(mockPessoaService.getPessoas).toHaveBeenCalled();
    expect(mockRes.json).toHaveBeenCalledWith([pessoaMock]);
  });

  it("deve chamar next(error) se getAll falhar", async () => {
    const error = new Error("DB error");
    mockPessoaService.getPessoas.mockRejectedValue(error);

    await pessoaController.getAll(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalledWith(error);
  });

  // ---------- GET BY ID ----------
  it("deve retornar erro 400 se ID for inválido em getById", async () => {
    mockReq.params = { id: "abc" };

    await pessoaController.getById(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "ID inválido" });
  });

  it("deve retornar pessoa ao buscar por ID válido", async () => {
    mockReq.params = { id: "1" };
    mockPessoaService.getPessoaById.mockResolvedValue(pessoaMock);

    await pessoaController.getById(mockReq, mockRes, mockNext);
    expect(mockPessoaService.getPessoaById).toHaveBeenCalledWith(1);
    expect(mockRes.json).toHaveBeenCalledWith(pessoaMock);
  });

  // ---------- UPDATE ----------
  it("deve atualizar uma pessoa com sucesso", async () => {
    const updatedData = { nome: "Carlos Atualizado", email: "carlos@email.com", cpf: "019976169000" };
    mockReq.params = { id: "1" };
    mockReq.body = updatedData;

    (updatePessoaSchema.parse as jest.Mock).mockReturnValue(updatedData);
    mockPessoaService.updatePessoa.mockResolvedValue({ ...pessoaMock, ...updatedData, updatedAt: new Date() });

    await pessoaController.update(mockReq, mockRes, mockNext);

    expect(updatePessoaSchema.parse).toHaveBeenCalledWith(updatedData);
    expect(mockPessoaService.updatePessoa).toHaveBeenCalledWith(1, updatedData);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining(updatedData));
  });

  it("deve retornar erro 400 se ID for inválido no update", async () => {
    mockReq.params = { id: "abc" };

    await pessoaController.update(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "ID inválido" });
  });
})

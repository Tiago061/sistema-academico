export type DataInscricao = {
    id: number;
    pessoaId: number;
    cursoId: number;
    ativo: boolean;
    nota: number | null;
    createdAt: string
    updatedAt: string
}

export type Pessoa = {
    id: number;
    nome: string;
    email: string;
    cpf: string;
}

export type PessoaForm = Omit<Pessoa, 'id'>;

export type Curso = {
    id: number;
    nome: string;
    descricao?: string;
    carga_horaria: number;
    data_inicio: string;
    data_fim: string;
}

export type CursoForm = Omit<Curso, 'id'>

export type Inscricao = DataInscricao & {
    pessoa: Pick<Pessoa, 'id' | 'nome'>;
    curso: Pick<Curso, 'id' | 'nome'>;
}

export type InscricaoForm = {
    pessoaId: number;
    cursoId: number;
}

export type InscricaoUpdateForm = {
    ativo: boolean;
    nota?: number;
}
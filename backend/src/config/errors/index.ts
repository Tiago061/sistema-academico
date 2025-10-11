export class HTTPError extends Error {
    constructor(message: string, public statusCode: number = 500) {
        super(message);
        this.name = 'HTTPError';
    }
}

export class NotFoundError extends HTTPError {
    constructor(message: string = 'Recurso não encontrado.') {
        super(message, 404);
        this.name = 'NotFoundError';
    }
}

export class BadRequestError extends HTTPError {
    constructor(message: string = 'Requisição inválida.') {
        super(message, 400);
        this.name = 'BadRequestError';
    }
}

export class ConflictError extends HTTPError {
    constructor(message: string = 'Conflito de dados.') {
        super(message, 409);
        this.name = 'ConflictError';
    }   
}


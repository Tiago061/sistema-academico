
# 🎓 Sistema Acadêmico

Um sistema completo para gerenciamento de alunos, cursos e inscrições acadêmicas.  
Desenvolvido com **Node.js**, **TypeScript**, **Prisma ORM**, **PostgreSQL** e **Next.js**.

---

## 📋 Sumário

1. [Visão Geral](#-visão-geral)  
2. [Funcionalidades](#-funcionalidades)  
3. [Arquitetura do Projeto](#-arquitetura-do-projeto)  
4. [Tecnologias Utilizadas](#-tecnologias-utilizadas)  
5. [Instalação e Execução](#-instalação-e-execução)  
6. [Configuração do Banco de Dados](#-configuração-do-banco-de-dados)  
7. [Estrutura de Pastas](#-estrutura-de-pastas)  
8. [Endpoints da API](#-endpoints-da-api)  
9. [Testes Automatizados](#-testes-automatizados)  
10. [Docker Compose](#-docker-compose)  
11. [Contribuição](#-contribuição)  
12. [Licença](#-licença)

---

## 🧠 Visão Geral

O **Sistema Acadêmico** tem como objetivo gerenciar de forma simples e eficiente os dados de **pessoas (alunos e professores)**, **cursos** e **inscrições**, permitindo operações CRUD e consultas integradas entre as entidades.

O sistema é dividido em dois módulos principais:

- **Backend (API RESTful)** — Desenvolvido com Node.js, Express, TypeScript, Prisma e PostgreSQL.  
- **Frontend (Interface Web)** — Desenvolvido com Next.js e TailwindCSS.

---

## 🚀 Funcionalidades

### 🗂️ Backend
- CRUD de **Pessoas**
- CRUD de **Cursos**
- CRUD de **Inscrições**
- Validações com **Zod**
- Tratamento de erros personalizado
- Testes automatizados com **Jest**
- Integração com banco de dados via **Prisma ORM**

### 💻 Frontend
- Listagem e cadastro de pessoas e cursos
- Visualização e gerenciamento de inscrições
- Interface moderna com **TailwindCSS**
- Comunicação direta com a API

---

## 🧱 Arquitetura do Projeto

```
frontend/
 ├── src/
 │   ├── app/
 │   │   ├── pessoas/
 │   │   ├── cursos/
 │   │   └── inscricoes/
 │   ├── components/
 │   └── lib/
 │
 ├── package.json
 └── Dockerfile

backend/
 ├── src/
 │   ├── controllers/
 │   ├── services/
 │   ├── routes/
 │   ├── schemas/
 │   ├── database/
 │   │   └── prisma.ts
 │   ├── config/
 │   ├── app.ts
 │   └── server.ts
 │
 ├── prisma/
 │   └── schema.prisma
 ├── package.json
 └── Dockerfile
```

---

## 🧰 Tecnologias Utilizadas

### **Backend**
- Node.js + Express  
- TypeScript  
- Prisma ORM  
- PostgreSQL  
- Jest (testes unitários)  
- Zod (validação de dados)  
- Dotenv (variáveis de ambiente)  
- Docker  

### **Frontend**
- Next.js (React + TypeScript)  
- TailwindCSS  
- Axios  
- ShadCN UI (componentes)  
- Docker  

---

## ⚙️ Instalação e Execução

### 🔧 Pré-requisitos
Certifique-se de ter instalado:
- [Node.js](https://nodejs.org/) (>= 18)  
- [Docker](https://www.docker.com/)  
- [PostgreSQL](https://www.postgresql.org/)

### 🧩 Clonar o repositório

```bash
git clone https://github.com/seu-usuario/sistema-academico.git
cd sistema-academico
```

### ▶️ Executar com Docker

```bash
docker-compose up --build
```

Isso iniciará:
- `backend` na porta `3000`  
- `frontend` na porta `3001`  
- `postgres` na porta `5432`

### 🖥️ Acessos
- Frontend: [http://localhost:3001](http://localhost:3001)  
- Backend (API): [http://localhost:3000](http://localhost:3000)

---

## 🗄️ Configuração do Banco de Dados

O Prisma gerencia o schema do banco de dados.  
O arquivo `.env` deve conter:

```env
DATABASE_URL="postgresql://postgres:postgres@db:5432/sistemaacademico?schema=public"
PORT=3000
```

Para criar as tabelas:

```bash
cd backend
npx prisma migrate dev
```

Para visualizar o banco:

```bash
npx prisma studio
```

---

## 🧩 Estrutura de Pastas (Backend)

```
src/
 ├── app.ts               # Configuração do Express
 ├── server.ts            # Inicialização do servidor
 ├── config/
 │   ├── errors.ts        # Classes de erro personalizadas
 │   └── env.ts           # Configuração de variáveis de ambiente
 ├── controllers/         # Controladores das rotas
 ├── services/            # Lógica de negócio
 ├── routes/              # Definição das rotas
 ├── schemas/             # Schemas Zod para validação
 ├── database/
 │   └── prisma.ts        # Instância do Prisma Client
 └── tests/               # Testes unitários com Jest
```

---

## 🔗 Endpoints da API

### 👤 Pessoas
| Método | Rota               | Descrição                |
|--------|--------------------|--------------------------|
| GET    | `/pessoas`         | Lista todas as pessoas   |
| GET    | `/pessoas/:id`     | Busca pessoa por ID      |
| POST   | `/pessoas`         | Cria uma nova pessoa     |
| PUT    | `/pessoas/:id`     | Atualiza uma pessoa      |
| DELETE | `/pessoas/:id`     | Remove uma pessoa        |

### 📘 Cursos
| Método | Rota               | Descrição                |
|--------|--------------------|--------------------------|
| GET    | `/cursos`          | Lista todos os cursos    |
| POST   | `/cursos`          | Cria um novo curso       |
| PUT    | `/cursos/:id`      | Atualiza um curso        |
| DELETE | `/cursos/:id`      | Remove um curso          |

### 📝 Inscrições
| Método | Rota                   | Descrição                    |
|--------|------------------------|------------------------------|
| GET    | `/inscricoes`          | Lista todas as inscrições    |
| POST   | `/inscricoes`          | Cria uma nova inscrição      |
| PUT    | `/inscricoes/:id`      | Atualiza uma inscrição       |
| DELETE | `/inscricoes/:id`      | Remove uma inscrição         |

---

## 🧪 Testes Automatizados

Para rodar os testes unitários:

```bash
cd backend
npm run test
```

Os testes validam:
- Regras de negócio nos serviços  
- Retornos esperados dos controladores  
- Tratamento de erros personalizados  

---

## 🐳 Docker Compose

Exemplo de configuração (`docker-compose.yml`):

```yaml
version: "3.8"

services:
  db:
    image: postgres:15
    container_name: sistemaacademico_db
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: sistemaacademico
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build:
      context: ./backend
    container_name: sistemaacademico_backend
    ports:
      - "3000:3000"
    depends_on:
      - db
    environment:
      DATABASE_URL: postgresql://postgres:postgres@db:5432/sistemaacademico?schema=public
    volumes:
      - ./backend:/usr/src/app
    command: npm run dev

  frontend:
    build:
      context: ./frontend
    container_name: sistemaacademico_frontend
    ports:
      - "3001:3000"
    depends_on:
      - backend
    volumes:
      - ./frontend:/usr/src/app
    command: npm run dev

volumes:
  postgres_data:
```

---

## 🤝 Contribuição

Contribuições são bem-vindas!  
Siga os passos abaixo:

1. Faça um fork do projeto  
2. Crie uma branch: `git checkout -b minha-feature`  
3. Commit suas alterações: `git commit -m 'Adiciona nova funcionalidade'`  
4. Envie: `git push origin minha-feature`  
5. Abra um Pull Request  

---

## 📄 Licença

Este projeto está sob a licença **MIT**.  
Sinta-se livre para usar e modificar.

---

### 💡 Autor

**Tiago Henrique**  
💼 Desenvolvedor FullStack  


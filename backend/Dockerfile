FROM node:20-alpine

# Diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copiar apenas package.json e package-lock.json primeiro (cache)
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar o restante do código
COPY . .

# Gerar o Prisma Client
RUN npx prisma generate

# Compilar TypeScript
RUN npm run build

# Expor a porta da API
EXPOSE 3000

# Comando para iniciar
CMD ["node", "dist/server.js"]

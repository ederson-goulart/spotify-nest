# 🎧 Spotify Clone Ecosystem — Monorepo

Este repositório contém a arquitetura completa do **Spotify Clone**, um ecossistema completo composto por aplicações frontend (Next.js), APIs REST (NestJS) de alto desempenho, banco de dados relacional (PostgreSQL), armazenamento de objetos (MinIO) e integrações avançadas de inteligência artificial (Google Gemini).

---

## 🏗️ Arquitetura do Ecossistema

O sistema é estruturado como um monorepo dividido em múltiplos serviços de infraestrutura e aplicação:

```mermaid
graph TD
    %% Frontend e Clientes
    subgraph Clientes [Camada de Apresentação]
        A["Spotify Clone Public (Next.js) <br> :3000"]
        B["Spotify Backoffice Admin (Next.js) <br> :3001"]
    end

    %% Servidor de Aplicação
    subgraph Servidor [Camada de Aplicação]
        C["NestJS API Gateway & Backend <br> :3002 (interno :3000)"]
    end

    %% Serviços e Banco de Dados
    subgraph Infraestrutura [Camada de Infraestrutura]
        D[("PostgreSQL DB <br> :5432")]
        E["MinIO Object Storage <br> :9000 & :9001"]
        F["Google Gemini AI"]
    end

    %% Conexões
    A -->|Consome API| C
    B -->|Consome API & Uploads| C
    C -->|ORM Prisma| D
    C -->|SDK S3 / Armazena Covers| E
    C -->|SDK GenAI / Enriquecimento| F
```

### Serviços do Monorepo

1.  **[spotify-clone-prof](./spotify-clone-prof)**: A interface pública voltada para o usuário final, reproduzindo a experiência clássica do Spotify (player de música, playlists, visualização de artistas e álbuns). Desenvolvida em **Next.js (App Router)**.
2.  **[spotify-backoffice-front](./spotify-backoffice-front)**: Painel de controle do administrador (Backoffice) utilizado para gerenciar o catálogo (músicas, bandas/artistas, álbuns), visualizar análises de erros e disparar automações de inteligência artificial. Desenvolvido com **Next.js**, **shadcn/ui** e **TailwindCSS**.
3.  **[spotify-backoffice-back](./spotify-backoffice-back)**: API REST central estruturada. Responsável por expor as rotas de gerenciamento, integrar-se com o banco de dados e coordenar os serviços externos. Desenvolvida em **NestJS** com **Prisma ORM**.
4.  **[spotify-db-prof](./spotify-db-prof)**: Módulo de configuração de banco de dados PostgreSQL executado via Docker.
5.  **[spotify-minio-prof](./spotify-minio-prof)**: Configurações de armazenamento de mídia com MinIO compatível com a API S3 da AWS.

---

## ⚙️ Configuração das Variáveis de Ambiente

Para o ecossistema funcionar corretamente, é necessário configurar os arquivos `.env` individuais em cada serviço. 

Copie o arquivo `.env.example` para `.env` tanto no frontend quanto no backend:
```bash
cp ./spotify-backoffice-back/.env.example ./spotify-backoffice-back/.env
cp ./spotify-backoffice-front/.env.example ./spotify-backoffice-front/.env
```

### Modelo de Configuração (`.env`)

```ini
# --- Banco de Dados e Prisma ---
DATABASE_URL="postgresql://postgres:abcd1234@localhost:5432/spotify?schema=public"

# --- Storage (MinIO) ---
MINIO_ENDPOINT_INTERNAL="http://localhost:9000"
MINIO_ACCESS_KEY="minioadmin"
MINIO_SECRET_KEY="minioadmin"
MINIO_BUCKET="uploads"
NEXT_PUBLIC_MINIO_PUBLIC_BASE_URL="http://localhost:9000"

# --- Configurações do Backend (NestJS) ---
PORT=3000
NEXT_PUBLIC_BACKEND_API_URL="http://localhost:3000"

# --- Segurança do Endpoint de Migrations ---
MIGRATION_SECRET="minhasenhasecretaparaexecutarmigrations123!"

# --- Inteligência Artificial (Google Gemini) ---
GEMINI_API_KEY="AIzaSyYourGeminiApiKeyHere"
```

---

## 🚀 Como Executar o Projeto

Você pode optar por rodar todo o ambiente via **Docker Compose** (recomendado para desenvolvimento unificado) ou iniciar cada serviço individualmente de forma local.

### Opção 1: Execução Unificada via Docker (Modo Desenvolvimento)

O projeto possui um setup de Docker Compose que espelha os arquivos locais como volumes nas imagens de desenvolvimento, garantindo hot-reload tanto no NestJS quanto no Next.js.

Na raiz do monorepo, execute:
```bash
docker compose -f docker-compose.dev.yml up --build -d
```

Este comando irá subir:
*   **PostgreSQL**: porta `5432`
*   **MinIO (S3)**: porta `9000` (API) e `9001` (painel de administração do console)
*   **MinIO Provisioning**: Cria o bucket `uploads` e o configura como público de forma automatizada
*   **NestJS Backend**: porta `3002` (mapeada para `3000` interna do container)
*   **Backoffice Frontend**: porta `3001`
*   **Spotify Clone Public**: porta `3000`

### Opção 2: Execução Unificada via Docker (Modo Produção)

Para rodar builds otimizados das aplicações:
```bash
docker compose up --build -d
```

### Opção 3: Execução Manual / Local

#### Passo 1: Iniciar os serviços de Infraestrutura (DB & Storage)
Você pode subir apenas o PostgreSQL e o MinIO usando o Docker:
```bash
docker compose up -d spotify-dbp minio minio-s3
```

#### Passo 2: Configurar e rodar o Backend (NestJS)
```bash
cd spotify-backoffice-back
npm install --legacy-peer-deps
npx prisma generate
npx prisma db push # ou execute as migrations
npm run start:dev
```

#### Passo 3: Configurar e rodar o Backoffice Frontend (Next.js)
```bash
cd ../spotify-backoffice-front
npm install --legacy-peer-deps
npm run dev
```

#### Passo 4: Configurar e rodar o Spotify Clone Público (Next.js)
```bash
cd ../spotify-clone-prof
npm install
npm run dev
```

---

## 🧠 Recursos Avançados do Sistema

### 1. Integração com Inteligência Artificial (Google Gemini)

O backend possui o módulo `AiModule`, que utiliza o SDK oficial `@google/genai` (modelo `gemini-2.5-flash`) para fornecer recursos inteligentes integrados:
*   **Geração Automática de Biografia**: Gera biografias profissionais para as bandas/artistas criadas no backoffice com base nos gêneros atribuídos.
*   **Autotagging de Faixas**: Sugere tags de humor (ex: *"energético", "foco", "relaxante"*) e subgêneros dinamicamente a partir do título da música e descrição da banda.
*   **Analytics Error Insights**: Analisa os logs e incidentes gravados em banco na tabela `AnalyticsEvent` e sintetiza relatórios consolidados sobre causas e soluções de bugs para os administradores no dashboard.

### 2. Execução Remota de Migrations (CI/CD / Coolify)

Para simplificar implantações em ambientes de VPS (como o Coolify) sem a necessidade de expor a porta do banco ou rodar comandos SSH complexos, o NestJS disponibiliza um endpoint seguro para execução de migrations de forma remota via HTTP:

*   **Endpoint**: `POST /api/system/migrate`
*   **Header Requerido**: `X-Migration-Secret: <MIGRATION_SECRET>`

#### Requisição via cURL:
```bash
curl -X POST http://localhost:3002/api/system/migrate \
  -H "X-Migration-Secret: minhasenhasecretaparaexecutarmigrations123!" \
  -H "Content-Type: application/json"
```

### 3. Arquitetura Interna do NestJS Backend

A API adota padrões corporativos rigorosos para consistência e confiabilidade:
*   **Logs com Correlation ID**: Cada requisição HTTP recebe um identificador único injetado por middleware, facilitando a depuração entre microsserviços e logs unificados.
*   **Validação Estrita**: Utilização de `ValidationPipe` do `class-validator` com conversão implícita para DTOs tipados.
*   **Interceptor de Formatação**: Respostas de sucesso são padronizadas automaticamente pelo `TransformInterceptor` na estrutura:
    ```json
    {
      "success": true,
      "statusCode": 200,
      "data": {}
    }
    ```
*   **Exception Filters**: Captura centralizada de erros de requisição (`HttpExceptionFilter`) e erros internos de banco de dados (`PrismaExceptionFilter` para tratar violações de restrições de chaves primárias e estrangeiras), gerando respostas amigáveis.

### 4. Armazenamento com MinIO S3

Todas as mídias e imagens de capas são enviadas para o bucket `uploads` gerenciado pelo MinIO.
*   **Migração de Mídia Local**: Para importar arquivos salvos no disco local (`public/uploads`) para o Object Storage, execute no diretório do frontend:
    ```bash
    npm run migrate:uploads
    ```

---

## 🛠️ Tecnologias Utilizadas

*   **Linguagens**: TypeScript & SQL
*   **Backend**: Node.js & NestJS (v11+)
*   **Frontend**: Next.js (v15+) & React (v19+)
*   **CSS & UI**: TailwindCSS, SASS (CSS Modules) & shadcn/ui
*   **ORM / Banco de Dados**: Prisma ORM & PostgreSQL
*   **Storage**: MinIO (compatível com AWS S3)
*   **IA**: SDK Google GenAI (Gemini 2.5 Flash)
*   **Containers**: Docker & Docker Compose

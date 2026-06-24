# Spotify Backoffice — Next.js & NestJS

Este projeto consiste no painel administrativo (Backoffice) do ecossistema Spotify Clone. Originalmente construído inteiramente em Next.js, o sistema foi refatorado para utilizar uma arquitetura híbrida de alto desempenho:
1.  **Frontend**: Next.js (App Router, TailwindCSS, Server Actions para proxying e componentes SSR/Client).
2.  **Backend**: NestJS (REST API estruturada com injeção de dependências, DTOs, Pipes, Guards, Interceptors, Filters e integração com Inteligência Artificial).

---

## Estrutura do Projeto

*   **Frontend (Next.js)**: Porta `3001`
*   **Backend (NestJS)**: Porta `3000` (ou porta configurada em `PORT`)

---

## Dependências do Projeto

- Node.js v18 ou superior
- Docker & Docker Compose
- Banco de dados PostgreSQL (iniciado via docker-compose)
- MinIO (Object Storage S3-compatible)

---

## Iniciando Localmente

### 1. Configurando as Variáveis de Ambiente
Copie o arquivo `.env.example` para `.env` tanto no frontend quanto no backend:
```bash
cp .env.example .env
```

Garanta que as seguintes variáveis estejam configuradas para o funcionamento do ecossistema:

```ini
# --- Banco de Dados e Prisma ---
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/spotify?schema=public"

# --- Storage (MinIO) ---
MINIO_ENDPOINT_INTERNAL="http://localhost:9000"
MINIO_ACCESS_KEY="minioadmin"
MINIO_SECRET_KEY="minioadmin"
MINIO_BUCKET="uploads"
NEXT_PUBLIC_MINIO_PUBLIC_BASE_URL="http://localhost:9000"

# --- NestJS Backend Config ---
PORT=3000
NEXT_PUBLIC_BACKEND_API_URL="http://localhost:3000"

# --- Segurança do Endpoint de Migrations ---
MIGRATION_SECRET="minhasenhasecretaparaexecutarmigrations123!"

# --- Inteligência Artificial (Google Gemini) ---
GEMINI_API_KEY="AIzaSyYourGeminiApiKeyHere"
```

### 2. Subindo a Infraestrutura com Docker
Suba o banco de dados e o MinIO executando o docker compose nas pastas correspondentes (ou no repositório raiz de infraestrutura):
```bash
docker compose up -d
```

### 3. Rodando o Backend (NestJS)
Navegue até a pasta do backend, instale as dependências e inicie o servidor:
```bash
npm install
npm run start:dev
```

### 4. Rodando o Frontend (Next.js)
Navegue até a pasta do frontend, instale as dependências e inicie o dev server:
```bash
npm install
npm run dev
```
Acesse a interface administrativa em `http://localhost:3001`.

---

## Execução Remota de Migrations (CI/CD & Coolify)

Para facilitar o deploy contínuo em ambientes cloud, criamos um endpoint de controle no NestJS que executa as migrations do banco de dados remotamente via requisição HTTP, eliminando a necessidade de expor portas de banco ou criar sessões SSH no servidor.

*   **Endpoint**: `POST /api/system/migrate`
*   **Cabeçalho Requerido**: `X-Migration-Secret: <valor_da_env_MIGRATION_SECRET>`

### Como Executar via cURL:
```bash
curl -X POST http://localhost:3000/api/system/migrate \
  -H "X-Migration-Secret: minhasenhasecretaparaexecutarmigrations123!" \
  -H "Content-Type: application/json"
```

### Resposta de Sucesso:
```json
{
  "success": true,
  "message": "Migrations executadas com sucesso.",
  "output": "Applying migration '20260624000000_add_analytics_event'..."
}
```

---

## Funcionalidades de Inteligência Artificial (Google Gemini)

O backoffice conta com o módulo `AiModule` que consome os modelos do Google Gemini (`gemini-2.5-flash`) para automatizar e enriquecer os metadados do catálogo musical:

1.  **Geração de Biografia de Bandas**: Gera biografias otimizadas baseadas no nome da banda e nos gêneros de referência.
2.  **Sugestão Automática de Tags**: Sugere tags de humor (ex: "calmo", "melancólico", "foco") e subgêneros com base no título da música e na descrição da banda.
3.  **Insight Automático de Erros de Analytics**: Analisa periodicamente erros do sistema gravados em `AnalyticsEvent`, fornecendo resumos estruturados no painel de administração sobre as causas prováveis e correções.

---

## Arquitetura Interna do Backend NestJS

A API foi projetada seguindo as melhores práticas do ecossistema NestJS:

*   **Pipes & DTOs**: Toda entrada é tipada e validada em runtime com `class-validator` e `class-transformer`.
*   **Middleware**: Um middleware de log global injeta um `Correlation ID` nos cabeçalhos para rastreabilidade de requisições.
*   **Interceptors**: O `TransformInterceptor` formata automaticamente respostas de sucesso no padrão `{ success: true, statusCode: X, data: [...] }`.
*   **Exception Filters**: Os filtros `HttpExceptionFilter` e `PrismaExceptionFilter` capturam exceções HTTP e erros de banco (ex: chaves duplicadas no Prisma) e formatam respostas JSON limpas e amigáveis para a UI do cliente.
*   **Guards & Decorators**: Proteção de rotas utilizando Guards para perfis administrativos e decorators customizados como `@CurrentUser()` para acesso a sessões do usuário.

---

## Imagens no MinIO (covers)

Este projeto armazena as imagens (capas) no **MinIO** no bucket público `uploads`.

### Migração de arquivos antigos do disco
Se você possui capas antigas salvas localmente em `public/uploads`, execute o script de migração para enviá-las ao MinIO mantendo a compatibilidade de nomes:
```bash
npm run migrate:uploads
```

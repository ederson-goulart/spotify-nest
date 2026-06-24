## Dependências do projeto

- Docker
- Docker Compose

## Iniciando localmente

1. Copie `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```
2. Atualize as variáveis de ambiente com as credenciais desejadas.
3. Construa e execute o serviço:
   ```bash
   docker compose up -d
   ```
4. O PostgreSQL ficará disponível em `localhost:5432`.

## Deploy no Coolify

1. Crie um novo app no Coolify e selecione o repositório `spotify-db-prof`.
2. Escolha a opção Docker Compose e aponte para `docker-compose.yaml`.
3. Configure as variáveis de ambiente no Coolify:
   - `POSTGRES_USER`
   - `POSTGRES_PASSWORD`
   - `POSTGRES_DB`
4. Execute o deploy.

## Observações

- Para uso local, o banco de dados expõe a porta `5432` para que outros serviços possam se conectar via `localhost`.
- O arquivo `.env` é usado somente no desenvolvimento local e não deve ser comitado.

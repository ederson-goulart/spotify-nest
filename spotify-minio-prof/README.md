## MinIO (armazenamento de imagens)

Este serviço fornece o **MinIO** para armazenar e servir as imagens (capas) do projeto, usando o bucket público `uploads`.

## Dependências do projeto

- Docker
- Docker Compose

## Configuração (.env)

Crie/ajuste o arquivo `.env` na pasta `spotify-minio-prof`:

- **`MINIO_ROOT_USER`**: usuário admin do MinIO
- **`MINIO_ROOT_PASSWORD`**: senha admin do MinIO

Exemplo:

```env
MINIO_ROOT_USER=admin
MINIO_ROOT_PASSWORD=admin123
```

## Rede Docker (mesma rede dos serviços)

O `docker-compose.yaml` usa a rede **externa** `spotify-network`. Isso significa que a rede deve existir antes de subir o MinIO.

Para criar a rede manualmente (se necessário):

```bash
docker network create spotify-network
```

## Subindo localmente

Na pasta `spotify-minio-prof`:

```bash
docker compose up -d
```

URLs locais:

- **API (S3 compatível)**: `http://localhost:9000`
- **Console**: `http://localhost:9001`

## Bucket e permissões (uploads público)

O serviço `minio-init` faz automaticamente:

- cria o bucket `uploads` (se não existir)
- aplica `mc anonymous set download local/uploads` (download público)

Assim, um arquivo `cover.png` no bucket fica acessível em:

- `http(s)://<seu-dominio-ou-host>/uploads/cover.png`

## Deploy no Coolify (API 9000 + Console 9001)

1. Crie um novo app/stack no Coolify apontando para `spotify-minio-prof/docker-compose.yaml`.
2. Configure as variáveis do `.env` no Coolify:
   - `MINIO_ROOT_USER`
   - `MINIO_ROOT_PASSWORD`
3. Publique duas portas/serviços no proxy do Coolify:
   - **9000** (API) em um domínio (ex.: `minio.seudominio.com`)
   - **9001** (Console) em um domínio (ex.: `minio-console.seudominio.com`)

> Observação: mantenha o Console exposto apenas se você realmente precisa de acesso público. Se preferir, publique somente a API (9000) e mantenha o Console restrito.

## Integração com o backoffice

No backoffice (`spotify-backoffice-prof`), configure:

- `MINIO_ENDPOINT_INTERNAL=http://minio:9000` (comunicação interna na rede Docker)
- `MINIO_ACCESS_KEY=$MINIO_ROOT_USER`
- `MINIO_SECRET_KEY=$MINIO_ROOT_PASSWORD`
- `MINIO_BUCKET=uploads`
- `NEXT_PUBLIC_MINIO_PUBLIC_BASE_URL=https://<dominio-publico-da-api-9000>`


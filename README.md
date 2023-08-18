![Imersão Full Stack && Full Cycle](https://events-fullcycle.s3.amazonaws.com/events-fullcycle/static/site/img/grupo_4417.png)

Participe gratuitamente: https://imersao.fullcycle.com.br/

## Sobre o repositório

Esse repositório contém o código-fonte ministrado na aula: Nest.js, Next.js e Google Maps: Criando Apps Geográficos [https://www.youtube.com/watch?v=wzA3bfqxbbY](https://www.youtube.com/watch?v=wzA3bfqxbbY)

## Rodar a aplicação

A aplicação está dividida em:

- Nest.js (backend - API)
- Next.js (frontend - Web)
- MongoDB (banco de dados)

É necessário gerar um projeto no Google Cloud Platform e habilitar a API do Google Maps. Após isso, crie uma credencial para a API e adicione no arquivo `.env` na raiz do projeto Next.js e no Nest.js.

Rode o projeto:

```bash
docker compose up
```

### Nest.js

Acesse o container:

```bash
docker compose exec nestjs bash
```

Instale as dependências e configure o prisma:

```bash
npm install
npx prisma generate
```

Rode o projeto:

```bash
npm run start:dev
```

### Next.js

Acesse o container:

```bash
docker compose exec nextjs bash
```

Instale as dependências:

```bash
npm install
```

Rode o projeto:

```bash
npm run dev
```

Existe um arquivo na raiz do projeto Nest.js, o `api.http` que você pode usar para testar a aplicação com o plugin do VSCode [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client). Quando enviar dados na requisição, o Nest.js consumirá a mensagem e mostrará no console.

Acesse os endereços `http://localhost:3001/new-route` (criar rotas) e `http://localhost:3001/admin` (receber as posições dos motoristas) para testar a aplicação.

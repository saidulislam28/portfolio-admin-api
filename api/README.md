# API

- NestJS
- Postgresql
- Prisma

[Docs](http://localhost:8000/docs)

## Install locally

1. `cp .env.example .env`
2. `docker-compose up -d`

## Prisma

- run migration locally: `npx prisma migrate dev --name init`
- generate prisma client: `prisma generate`


## Drop all tables

```sql
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
```
# Build command for render.com

build command: `npm install && npx prisma generate && npx @nestjs/cli build`

add this env on render: `NODE_VERSION` and set the value to `18`

start command: `npm run start:migrate:prod`


# Test

npm run test invoice-pdf-generator.service.spec.ts

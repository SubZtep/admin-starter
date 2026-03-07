# Admin Starter

TypeScript monorepo, a Better Auth implementation with [API](./apps/api/) and [web](./apps/web/) apps.

## Features

- Registration / login
- Admin list users

## Run

```sh
docker compose up -d
cd apps/api
bunx auth@latest migrate
```

Open http://localhost:3000.

## Stack

- Better Auth
- Bun
- Hono
- PostgreSQL
- React
- Tailwind
- TanStack Start
- Vite
- Zod

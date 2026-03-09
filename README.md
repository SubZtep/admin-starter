# Admin Starter

TypeScript monorepo implementing Better Auth with [API](./apps/api/) and [web](./apps/web/) apps. It’s a starter project, so grab the files and use them as a foundation for your own app.

> [!CAUTION]
> Work in progress.

## Features

- User registration and login
- Admin can list users

## Demo

You can access a playground instance at [https://kind-catmint-56983.ondis.co/](https://kind-catmint-56983.ondis.co/). It is configured using `disco.*.json` files with the `DISCO_JSON_PATH` environment variable on a [Disco](https://disco.cloud/) instance running on a [Hetzner](https://www.hetzner.com/) server.

Feel free to register, or use one of the test accounts below:

| Role  | Email          | Password   |
| ----- | -------------- | ---------- |
| Admin | admin@test.com | `P4$sword` |
| User  | user@test.com  | `P4$sword` |

## Quick Start

```sh
docker compose up -d
```

Docker Compose mounts the PostgreSQL data in the `./data` folder. Open [http://localhost:3000](http://localhost:3000) to access the UI.

## Stack

- Better Auth
- Biome
- Bun
- Hono
- Lucide
- PostgreSQL
- React
- Tailwind
- TanStack Form
- TanStack Query
- TanStack Start
- TanStack Table
- Vite
- Zod

# Admin Starter

TypeScript monorepo implementing Better Auth with [API](./apps/api/) and [web](./apps/web/) apps. It’s a starter template project, so grab the files and use them as a foundation for your own app.

> [!CAUTION]
> Work In Progress

## Features

- User registration and login
- Admin can list users

## Demo

A **demo page** with default settings is available at [**https://kind-catmint-56983.ondis.co/**](https://kind-catmint-56983.ondis.co/) for a quick overview. The database is disposable, but you can find [test user credentials](https://subztep.github.io/admin-starter/demo.html) in the [documentation](https://subztep.github.io/admin-starter/) .

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

# 가자⛲

> [!NOTE]
> Kaja is still evolving, but the current focus is authentication, admin workflows, and local orchestration.

![Continuous integration](https://github.com/SubZtep/kaja/actions/workflows/ci.yaml/badge.svg)
![Build CLI](https://github.com/SubZtep/kaja/actions/workflows/build-cli.yaml/badge.svg)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/SubZtep/kaja)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=SubZtep_kaja&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=SubZtep_kaja)

Kaja is a Bun TypeScript monorepo implementing pieces of **Better Auth** in a **Hono API**, a **TanStack Start** web app, and a local CLI.

## What is in here?

- [`apps/api`](./apps/api/) - Hono API, Better Auth, PostgreSQL, and email delivery.
- [`apps/web`](./apps/web/) - TanStack Start admin portal for authentication and user management.
- [`apps/cli`](./apps/cli/) - Local CLI for orchestration tasks.
- [`packages/*`](./packages/) - Shared schemas and utilities.

## Quick Start

Working defaults are provided in the [Docker Compose config](compose.yaml) and app `.env.example` files.

```sh
docker compose up -d
```

This starts:

- PostgreSQL
- MailDev SMTP
- API
- Web

## Local Development

Copy the committed env templates into local `.env` files:

```sh
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
cp apps/cli/.env.example apps/cli/.env
```

Generate a local Better Auth secret:

```sh
./scripts/create_local_secrets.sh
```

Start PostgreSQL and MailDev:

```sh
docker compose up -d db mail
```

> Mounts the persistent PostgreSQL data in the `./pgdata` folder. The migration files run automatically on first boot.

## Terminal Commands

Run these from the project root:

```sh
bun dev          # Run the API and web app
bun dev:cli      # Run the CLI app
bun lint         # Check formatting and lint rules
bun lint:fix     # Apply formatter and unsafe lint fixes
```

## Local URLs

- Web Admin: [http://localhost:3000](http://localhost:3000)
- API: [http://localhost:3001](http://localhost:3001)
- MailDev UI: [http://localhost:1080](http://localhost:1080)
- Better Auth reference: [http://localhost:3001/auth/reference](http://localhost:3001/auth/reference)

## Documentation

- [Development](./docs/dev.md)
- [Configuration](./docs/config.md)
- [Deployment](./docs/deploy.md)
- [GitHub Pages](https://subztep.github.io/kaja/)

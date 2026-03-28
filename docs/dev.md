---
layout: page
title: Development
nav_order: 4
---

# Development

## Setup

Generate local environment secrets (into `apps/api/.env.local`):

```sh
./create_local_secrets.sh
```

Start PostgreSQL and SMTP services:

```sh
docker compose up -d db mail
```

## Available commands

Run from your project root in a ***nix** system:

```sh
# Run API and Web
bun dev

# Run linter and code formatter
bun lint
bun lint:fix

# Run test
bun run test

# Post multiple random jobs locally (10 or given)
./scripts/mass_post_jobs.ts [number]

# Create multiple random users locally (10 or given)
./scripts/mass_user_create.ts [number]
```

App: [http://localhost:3000](http://localhost:3000)\
Webmail for the SMTP: [http://localhost:1080](http://localhost:1080)\
Better-Auth OpenAPI in dev mode: [http://localhost:3001/auth/reference](http://localhost:3001/auth/reference)

## Environment Variables

There are .env files at `/apps/*/`. Just clone and run! Split Configuration between shared defaults and local overrides.

1. `.env` (Committed) -> Loads defaults
2. `.env.local` (Ignored) -> Loads your secrets/overrides
3. `.env.development` (Committed) -> Loads dev-specific defaults
4. `.env.development.local` (Ignored) -> Loads dev-specific secrets

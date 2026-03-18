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

```sh
# Run API and Web
bun dev

# Run linter and code formatter
bun lint
bun lint:fix

# Run test
bun run test
```

App: [http://localhost:3000](http://localhost:3000)\
Webmail for the SMTP: [http://localhost:1080](http://localhost:1080)\
Better-Auth OpenAPI in dev mode: [http://localhost:3001/auth/reference](http://localhost:3001/auth/reference)

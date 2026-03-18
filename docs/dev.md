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

Start Required Services:

```sh
docker compose up -d db mail
```

## Run

```sh
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

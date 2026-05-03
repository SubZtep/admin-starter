# 가자💦

> [!NOTE]
> This isn’t even the final form. Its exact purpose is still evolving.

![Continuous integration](https://github.com/SubZtep/kaja/actions/workflows/ci.yaml/badge.svg)
![Build CLI](https://github.com/SubZtep/kaja/actions/workflows/build-cli.yaml/badge.svg)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/SubZtep/kaja)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=SubZtep_kaja&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=SubZtep_kaja)

A Bun TypeScript monorepo implementing pieces of **Better Auth** in a **Hono** [API](./apps/api/) and a **TanStack Start** [web app](./apps/web/).

## Apps

### Web

Admin portal for authentication and managing user details.

### CLI

Local CLI to orchestrate things.

### API

Backend that serves the web and CLI apps from the PostgreSQL database.

## Setup

Copy the contents of each `.env.example` file in the `apps` folder into a matching `.env` file, then update the appropriate values.

## Quick Start

Working defaults are provided in the [Docker Compose config](compose.yaml) and in `.env` files.

Just run:

```sh
docker compose up -d
```

Docker Compose mounts the **PostgreSQL** data in the `./pgdata` folder.\
Open [http://localhost:3000](http://localhost:3000) to access the UI.

More details are on the [dev page](https://subztep.github.io/kaja/dev/).

## Documentation

_A wise man once told me the source code is the best documentation._ Share it with your favourite AI agent and ask for the details. :trollface:

More documentation is available on [GitHub Pages](https://subztep.github.io/kaja/).

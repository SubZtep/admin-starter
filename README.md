# Admin Starter

![Bun](https://img.shields.io/badge/Runtime-Bun-black?style=flat-square)
![Docker Compose](https://img.shields.io/badge/Docker-Compose-blue?style=flat-square)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/SubZtep/admin-starter/dockerhub.yaml?style=flat-square)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/SubZtep/admin-starter?style=flat-square)
![License](https://img.shields.io/github/license/SubZtep/admin-starter?style=flat-square)

A TypeScript monorepo implementing pieces of **Better Auth** in a **Hono** [API](./apps/api/), with a **TanStack Start** [web app](./apps/web/) consuming it to demonstrate how they work together. 🎓 It’s a starter template with no business logic, so you could even grab the files and use them to kick-start your own project.

## Architecture

```mermaid
flowchart LR
  subgraph "monorepo"
    A["📁 apps/api<br/>Hono API<br/>Better Auth"]
    W["📁 apps/web<br/>TanStack Start<br/>React + SSR"]
    S["📁 packages/*<br/>Zod schemas<br/>shared utilities"]
  end

  U((User))
  D[(PostgreSQL)]
  E{{Emails}}

  S -.-> A
  S -.-> W

  U <-->|Web| W
  U <-->|Mobile| A

  W <-->|HTTP| A
  A <--> D
  A -->|SMTP| E
```

## Features

| User                                                                                                        | Admin                            | Docker Compose                               |
| ----------------------------------------------------------------------------------------------------------- | -------------------------------- | -------------------------------------------- |
| 🔹 Register and verify your email <br>🔹 Update your profile<br>🔹 Log in with cookies<br>or bearer tokens<br> | 🔹 View user list<br><br><br><br> | ▪️ `db`<br>▪️ `mail`<br>▪️ `api`<br>▪️ `web`<br> |

## Demo

A [**Disco**](https://disco.cloud/) deployment is running on a tiny **Hetzner** instance at [https://kind-catmint-56983.ondis.co/](https://kind-catmint-56983.ondis.co/).

> It’s an ephemeral database. You can register, or use [test credentials](https://subztep.github.io/admin-starter/demo.html) to sign in.

## Quick Start

Test secrets are already configured in the [compose config](compose.yaml).

Just run:

```sh
docker compose up -d
```

Docker Compose mounts the **PostgreSQL** data in the `./data` folder. Open [http://localhost:3000](http://localhost:3000) to access the UI.

## Documentation

A wise man once told me the source code is the best documentation. Share it with your favourite _AI agent_ and ask for the details. :trollface: [That **Jekyll** page](https://subztep.github.io/admin-starter/) is anything but _RTFM_.

## Stack

**Runtime / Language**  
Bun, TypeScript, Biome

**Frontend**  
React, TanStack Start, TanStack Form, TanStack Table, Tailwind, Vite, Lucide

**Backend / API**  
Hono, Better Auth, PostgreSQL, Nodemailer

**Dev / Infrastructure**  
Docker Compose, Bun, GitHub Actions

**Validation / Schema**  
Zod

---

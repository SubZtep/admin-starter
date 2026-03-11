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
  subgraph "Monorepo👋"
  A("`<big><tt>apps/api</tt></big>
  Hono API
  <strong>Better Auth</strong>
    <small>🫥 _any backend_ 🫥</small>
  `")
  W("`<big><tt>apps/web</tt></big>
  React👁
  TanStack Start
  <small>Better Auth Client</small>`")
  S("`<big><tt>packages/*</tt></big>
  **Zod** schemas
  Shared functions
  <small>buildtime only 👻</small>`")
  end
  U@{ shape: circ, label: "User\n•͡˘㇁•͡˘" }
  D@{ shape: cyl, label: "PostgreSQL" }
  E@{ shape: braces, label: "Emails" }
  U <-->|Web| W
  S -.-> W
  S -.-> A
  A <==> D
  A <-->|HTTP| W
  A -- SMTP ---> E
  style U fill:rebeccapurple,stroke:darkred,stroke-width:1px
  style E fill:black,stroke:darkred,stroke-style:dashed,stroke-width:1px
```

## Features

| User                                                                                      | Admin                        | Misc.                                             |
| ----------------------------------------------------------------------------------------- | ---------------------------- | ------------------------------------------------- |
| 🔹 Registration<br>🔹 Email verification <br>🔹 Login with cookies<br>🔹 Update user data<br> | 🔹 List users<br><br><br><br> | 🔹 Docker Compose with DB and SMTP<br><br><br><br> |

## Demo

A [**Disco**](https://disco.cloud/) deployment is running on a tiny **Hetzner** instance at [**<big>https://kind-catmint-56983.ondis.co/**</big>](https://kind-catmint-56983.ondis.co/).

> It’s an ephemeral database. You can register, or use [test credentials](https://subztep.github.io/admin-starter/demo.html) to sign in.

## Quick Start

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

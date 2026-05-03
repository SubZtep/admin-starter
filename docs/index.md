---
layout: home
title: Home
nav_order: 1
---

# Welcome to our documentation 🦋

_Work In Progress_ 🚧

## Architecture

```mermaid
flowchart LR
  subgraph "`**User PC**`"
    U((Browser))
    UW((Terminal))
    O@{ shape: processes, label: "OpenClaw"}
  end

  subgraph "`**Server**`"
    D[(PostgreSQL)]
    E{{Emails}}
  end

  subgraph "`**This monorepo**`"
    A["📁 apps/api<br/>Hono API<br/>Better Auth"]
    W["📁 apps/web<br/>TanStack Start<br/>React + SSR"]
    P["📁 packages/*<br/>Zod schemas<br/>shared utilities"]
    WW["📁 apps/cli<br/>CLI to drive OpenClaw"]
  end

  P -.-> A
  P -.-> W
  P -.-> WW

  U <-->|Web| W
  UW <-->|HTTP| A
  UW <==> O
  WW -.-> UW

  W <-->|HTTP| A
  A <==> D
  A -->|SMTP| E
```

## Start Your Project

1. [Config](./config/)
2. ???
3. Profit

## Legal

- [Privacy Policy](./privacy/)
- [Terms of Service](./terms/)

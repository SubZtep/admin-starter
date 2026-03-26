---
layout: page
title: Useful CLI Commands
parent: Development
nav_order: 3
---

# Useful CLI Commands

Check for dependency updates:

```sh
bun outdated -r
```

Print full output with errors into a file:

```sh
bun dev > output.txt 2>&1
```

Generate Better-Auth secret:

```sh
openssl rand -base64 32
```

## Docker

Start database only:

```sh
docker compose up -d db
```

Connect with any PostgreSQL client to port 5433.

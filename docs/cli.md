---
layout: page
title: Useful CLI Commands
parent: Development
nav_order: 1
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

## Docker

Start database only:

```sh
docker compose up -d db
```

Connect with any PostgreSQL client to port 5433.

---
layout: page
title: Useful CLI Commands
parent: Development
nav_order: 4
---

```
Usage:
# Install (latest release)
curl -sL https://raw.githubusercontent.com/subztep/admin-starter/main/install.sh | bash
# Install specific version
REPO=subztep/admin-starter VERSION=v0.0.1 curl -sL https://raw.githubusercontent.com/subztep/admin-starter/main/install.sh | bash
```

# Useful CLI Commands

Check for dependency updates:

```sh
bun outdated -r
```

Update depdendencies for all packages:

```sh
bunx npm-check-updates -w -u
```

Print full output with errors into a file:

```sh
bun dev > output.txt 2>&1
```

Generate Better-Auth secret:

```sh
openssl rand -base64 32
```

Find unused dependencies:

```sh
bunx knip
```

## Docker

Start database only:

```sh
docker compose up -d db
```

Connect with any PostgreSQL client to port 5433.

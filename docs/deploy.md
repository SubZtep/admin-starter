---
layout: page
title: Deploy
nav_order: 5
---

# Deploy

All you need is:
- 2 containers (api+web)
- PostgreSQL
- SMTP

> [Gmail’s SMTP](/admin-starter/deploy/) works, free, but for no/minimal traffic.

## [Disco](https://disco.cloud/docs/) Deploy

Create two **Projects** and add additional **environment variables**:

| Project | Variable          | Value            |
| ------- | ----------------- | ---------------- |
| API     | `DISCO_JSON_PATH` | `disco.api.json` |
| Web     | `DISCO_JSON_PATH` | `disco.web.json` |

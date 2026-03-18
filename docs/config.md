---
layout: page
title: Configuration
nav_order: 3
---

## Secrets and endpoints (for each app in the monorepo)

Default developer values.

### `/apps/web/.env`

| Variable Name | Value                 | Description                                                                                                                                       |
| ------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| API_URL       | http://localhost:3001 | **Optional**, server only value (for [Docker Compose]([../compose.yaml#68](https://github.com/SubZtep/admin-starter/blob/main/compose.yaml#L68))) |
| VITE_API_URL  | http://localhost:3001 | Client side                                                                                                                                       |
| VITE_APP_URL  | http://localhost:3000 |                                                                                                                                                   |


### `/apps/api/.env`

| Variable Name       | Value                                              | Description                                                                                               |
| ------------------- | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| PORT                | 3001                                               |                                                                                                           |
| CORS_ORIGIN         | http://localhost:3000                              | Website URL                                                                                               |
| CROSS_PARENT_DOMAIN | ondis.co                                           | **Optional**, set the base domain if apps are in subdomains                                               |
| DATABASE_URL        | postgresql://testuser:testpass@localhost:5433/test |                                                                                                           |
| BETTER_AUTH_URL     | http://localhost:3001                              | API URL                                                                                                   |
| EMAIL_FROM          | `"Admin Starter <noreply@test.com>"`               |                                                                                                           |
| SMTP_HOST           | localhost                                          |                                                                                                           |
| SMTP_PORT           | 1025                                               |                                                                                                           |
| SMTP_SECURE         |                                                    | _Usually empty_                                                                                           |
| SMTP_USER           |                                                    |                                                                                                           |
| SMTP_PASS           |                                                    |                                                                                                           |
| BETTER_AUTH_SECRET  |                                                    | Generate: `openssl rand -base64 32`                                                                       |
| JWT_SECRET          |                                                    | Generate: `bun -e "console.log(Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString('hex'))"` |

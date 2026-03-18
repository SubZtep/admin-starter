---
layout: page
title: Configuration
nav_order: 3
---

## Secrets and endpoints (for each app in the monorepo)

Default developer values.

### `/apps/web/.env`

| Variable Name | Value                 | Description                                                            |
| ------------- | --------------------- | ---------------------------------------------------------------------- |
| API_URL       | http://localhost:3001 | Optional, server side value (for [Docker Compose](../compose.yaml#68)) |
| VITE_API_URL  | http://localhost:3001 | Client side                                                            |
| VITE_APP_URL  | http://localhost:3000 |                                                                        |


### `/apps/api/.env`

| Variable Name      | Value | Description |
| ------------------ | ----- | ----------- |
| BETTER_AUTH_SECRET |
| JWT_SECRET         |

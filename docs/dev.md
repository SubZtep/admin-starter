---
layout: page
title: Development
nav_order: 4
---

# Development

## Start Required Services

```sh
docker compose up -d db mail
```

---

Only in production:
- CORS
- Origin check
- CSRF check

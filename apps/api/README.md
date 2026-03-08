## Installation

Create database tables:

```sh
bun x auth@latest migrate
```

Create `.env` file:

```ini
BETTER_AUTH_SECRET=uECOarRCMYJfTylXt2jo92JVTV6GbPjP
BETTER_AUTH_URL=http://localhost:3001
CORS_ORIGIN=http://localhost:3000
DATABASE_URL=postgresql://testuser:testpass@localhost:5433/test
```

## OpenAPI

Better Auth endpoint reference: http://localhost:3001/api/auth/reference

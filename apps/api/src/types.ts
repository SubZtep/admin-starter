declare module "bun" {
  interface Env {
    PORT: string
    CORS_ORIGIN: string
    DATABASE_URL: string
    BETTER_AUTH_URL: string
    BETTER_AUTH_SECRET: string
    JWT_SECRET: string
    EMAIL_FROM: string
    SMTP_HOST: string
    SMTP_PORT: string
    /** **Truthy** value please */
    SMTP_SECURE: string
    SMTP_USER: string
    SMTP_PASS: string
  }
}

// user type from better-auth session
export type AuthSessionUser = {
  id: string
  email: string
  name?: string
}

// context variables for Hono
export type RouteVariables = {
  user: AuthSessionUser | null
}

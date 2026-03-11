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

import { z } from "zod"

export const loginSchema = z.object({
  email: z.email("Invalid email address").trim().toLowerCase(),
  password: z.string()
})

export type LoginInput = z.infer<typeof loginSchema>

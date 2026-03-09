import { z } from "zod"

/**
 * Password rules:
 * - 8–72 chars (bcrypt safe range)
 * - at least 1 lowercase
 * - at least 1 uppercase
 * - at least 1 number
 * - at least 1 special char
 */
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password too long")
  .regex(/[a-z]/, "Must include a lowercase letter")
  .regex(/[A-Z]/, "Must include an uppercase letter")
  .regex(/[0-9]/, "Must include a number")
  .regex(/[^a-zA-Z0-9]/, "Must include a special character")

export const loginSchema = z.object({
  email: z.email("Invalid email address").trim().toLowerCase(),
  password: z.string()
})

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.email("Invalid email address").trim().toLowerCase(),
  password: passwordSchema,
  image: z.string()
})

export const editSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  image: z.string()
})

export const editEmailSchema = z.object({
  newEmail: z.email("Invalid email address").trim().toLowerCase()
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type EditInput = z.infer<typeof editSchema>
export type EditEmailInput = z.infer<typeof editEmailSchema>

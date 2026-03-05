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

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.email("Invalid email address").trim().toLowerCase(),
  password: passwordSchema,
  image: z.string()
  // confirmPassword: z.string()
})
// .superRefine((data, ctx) => {
//   if (data.password !== data.confirmPassword) {
//     ctx.addIssue({
//       path: ["confirmPassword"],
//       code: z.ZodIssueCode.custom,
//       message: "Passwords do not match"
//     })
//   }
// })

export type RegisterInput = z.infer<typeof registerSchema>

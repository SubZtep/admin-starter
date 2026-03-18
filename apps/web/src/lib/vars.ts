import { createServerFn } from "@tanstack/react-start"

export const getApiUrl = createServerFn().handler(() => {
  return process.env.API_URL || process.env.VITE_API_URL
})

import { createServerFn } from "@tanstack/react-start"

export const getApiUrl = createServerFn().handler(() => {
  return process.env.API_URL
})

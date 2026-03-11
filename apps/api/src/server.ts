import { app } from "./app"

const port = Number(process.env.PORT)

console.log(`API running on http://localhost:${port}`)

export default {
  port: Number(process.env.PORT),
  fetch: app.fetch
}

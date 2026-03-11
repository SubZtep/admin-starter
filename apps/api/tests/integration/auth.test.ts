import { describe, expect, test } from "bun:test"
import { app } from "../../src/app"

describe("authentication flow", () => {
  describe("bearer token", () => {
    let token: string

    test("sign in", async () => {
      const res = await app.request("/auth/sign-in/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: process.env.TEST_EMAIL, password: process.env.TEST_PASSWORD })
      })
      expect(res.ok).toBeTrue()
      expect(res.status).toBe(200)
      token = (await res.json()).token
      expect(token).not.toBeEmpty()
    })

    test("request profile", async () => {
      const res = await app.request("/users/me", {
        headers: { Authorization: `Bearer ${token}` }
      })
      expect(res.status).toBe(200)
    })

    test("sign out", async () => {
      const res = await app.request("/auth/sign-out", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      })
      expect(res.status).toBe(200)
    })
  })
})

import { describe, expect, test } from "bun:test"
import { faker } from "@faker-js/faker"
import { app } from "../../src/app"

describe("authentication flow", () => {
  console.log("ENV", process.env)

  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  const email = faker.internet.email({ firstName, lastName })
  const password = faker.internet.password({ length: 8, prefix: "P4$s" })

  describe("registration", () => {
    test("with email", async () => {
      const res = await app.request("/auth/sign-up/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name: `${firstName} ${lastName}` })
      })
      expect(res.ok).toBeTrue()
      expect(res.status).toBe(200)
    })
  })

  describe("bearer token", () => {
    let token: string

    test("sign in", async () => {
      const res = await app.request("/auth/sign-in/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
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

import { describe, expect, test } from "bun:test"
import { app } from "../../src/app"

describe("kaja worker client flow", () => {
  let nodeId: string
  let jobId: string

  test("register node", async () => {
    const res = await app.request("/kaja/register-node", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "test-node" })
    })
    expect(res.ok).toBeTrue()
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.nodeId).toBeTruthy()
    nodeId = data.nodeId
  })

  test("send heartbeat", async () => {
    const res = await app.request("/kaja/heartbeat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nodeId, status: "idle" })
    })
    expect(res.ok).toBeTrue()
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.ok).toBeTrue()
  })

  test("create a job", async () => {
    const res = await app.request("/kaja/create-job", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "ollama.generate",
        payload: { model: "llama3", prompt: "Explain event loop simply" }
      })
    })
    expect(res.ok).toBeTrue()
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.jobId).toBeTruthy()
    jobId = data.jobId
  })

  test("get a job", async () => {
    const res = await app.request("/kaja/get-job", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId })
    })
    expect(res.ok).toBeTrue()
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.jobId).toBe(jobId)
  })
})

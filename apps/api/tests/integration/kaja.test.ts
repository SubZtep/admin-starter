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

  test("claim a job with node", async () => {
    const res = await app.request("/kaja/get-job", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nodeId })
    })
    expect(res.ok).toBeTrue()
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.id).toBeTruthy()
    expect(data.type).toBe("ollama.generate")
  })

  test("submit job result", async () => {
    const res = await app.request("/kaja/submit-result", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nodeId,
        jobId,
        status: "success",
        result: { text: "The event loop is..." }
      })
    })
    expect(res.ok).toBeTrue()
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.ok).toBeTrue()
  })

  test("no more jobs available", async () => {
    const res = await app.request("/kaja/get-job", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nodeId })
    })
    expect(res.status).toBe(204)
  })
})

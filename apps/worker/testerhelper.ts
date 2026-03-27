import { KajaWorkerClient } from "./sdk"

const client = new KajaWorkerClient()

const res = await client.createJob({
  type: "ollama.generate",
  payload: {
    model: "llama3",
    prompt: "Explain event loop simply"
  }
})

console.log("JOB CREATED", res.jobId)

process.exit()

/*
TODO:
✔ Connected to kaja.io
✔ Ollama detected
✔ Model llama3 ready

Waiting for jobs...
*/
import { KajaWorkerClient } from "sdk"
import { workerLoop } from "./worker"

const client = new KajaWorkerClient()
console.log("\n\tCLI is working!\n\n\t\\ (^_^) /\n\n", client.baseURL)

// await client.createJob({
//   type: "ollama.generate",
//   payload: {
//     model: "llama3",
//     prompt: "Explain event loop simply"
//   }
// })

const { nodeId } = await client.registerNode({ name: "test-node" })

if (!(await client.heartbeat({ nodeId, status: "idle" }))) {
  console.error("Failed to send heartbeat")
  process.exit(1)
}

await workerLoop(client, nodeId)

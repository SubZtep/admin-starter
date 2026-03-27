import type { JobData } from "@app/schemas"
import { intro, outro } from "@clack/prompts"
import * as cli from "lib/cli-flow"
import { green, kaja, lime } from "./lib/var"

intro(`${lime}Welcome Aboard! 🏴‍☠️`)
Bun.sleepSync(1200)

await cli.validateConnections()
await kaja.registerNode()
if (!kaja.nodeId) {
  console.error("Node ID is required to submit results")
  process.exit(1)
}

await cli.beatingHeart()
let job: JobData | undefined

do {
  job = await cli.waitingForJobs()
  if (job) {
    let output: string
    let status: "success" | "error"
    try {
      output = await cli.workingOnJob(job)
      status = "success"
    } catch (error: any) {
      console.error(`Error working on job: ${error.message}`)
      output = error.message
      status = "error"
    }
    await kaja.submitResult({
      nodeId: kaja.nodeId,
      jobId: job.jobId,
      status,
      result: { text: output }
    })
  }
} while (job)

outro(`${green}Farewell`)
process.exit(0)

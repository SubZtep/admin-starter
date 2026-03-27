import type { JobData, SubmitResultRequest } from "@app/schemas"
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
    const result: Partial<SubmitResultRequest> = {
      nodeId: kaja.nodeId,
      jobId: job.jobId
    }

    try {
      const text = await cli.workingOnJob(job)
      result.status = "success"
      result.result = { text }
    } catch (error: any) {
      console.error(`Error working on job: ${error.message}`)
      result.status = "error"
      result.error = error.message
    }

    await kaja.submitResult(result as SubmitResultRequest)
  }
} while (job)

outro(`${green}Farewell`)
process.exit(0)

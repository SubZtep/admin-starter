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
    const isJobDone = await cli.workingOnJob(job)
    await kaja.submitResult({
      nodeId: kaja.nodeId,
      jobId: job.jobId,
      status: isJobDone ? "success" : "error",
      result: { text: "Lolem lorem ipsum dolor, sit amet!" }
    })
  }
} while (job)

outro(`${green}Farewell`)
process.exit(0)

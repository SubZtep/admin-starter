import { intro, outro } from "@clack/prompts"
import * as auth from "./lib/auth"
import { lime, purple } from "./lib/vars"

if (process.argv[2]?.toLowerCase()?.includes("help")) {
  console.log(`Usage:  kaja <command>

Commands:
  logout   Logout from Kaja
  help     Show help
`)
  process.exit()
}

intro(`${lime}Welcome to Kaja CLI 🚀`)

await auth.authFlow()

// await cli.validateConnections()
// await kaja.registerNode({ name: "no-name" })
// if (!kaja.nodeId) {
//   console.error("Node ID is required to submit results")
//   process.exit(1)
// }

// await cli.beatingHeart()
// let job: JobData | undefined

// do {
//   job = await cli.waitingForJobs()
//   if (job) {
//     // @ts-expect-error status is required
//     const result: SubmitResultRequest = {
//       nodeId: kaja.nodeId,
//       jobId: job.id
//     }

//     try {
//       const text = await cli.workingOnJob(job)
//       result.status = "success"
//       result.result = { text }
//     } catch (error: any) {
//       console.error(`Error working on job: ${error.message}`)
//       result.status = "error"
//       result.error = error.message
//     }

//     await kaja.submitResult(result)
//   }
// } while (job)

outro(`${purple}Farewell 🫠`)
process.exit()

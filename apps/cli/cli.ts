import { intro, outro } from "@clack/prompts"
import type { JobData, SubmitResultRequest } from "@kaja/schemas"
import * as auth from "./lib/auth"
import * as cli from "./lib/cli-flow"
import * as ollama from "./lib/ollama"
import { kaja, lime, purple } from "./lib/vars"
import { version } from "./package.json"

declare const CLI_VERSION: string

const command = process.argv[2]?.toLowerCase()

if (command?.includes("help")) {
  console.log(`Usage:  kaja <command>

Commands:
  version  Show version
  logout   Logout from Kaja
  help     Show help
`)
  process.exit()
}

if (command === "version" || command === "--version" || command === "-v") {
  console.log(CLI_VERSION)
  process.exit()
}

void (async () => {
  console.log(lime + ["▖▖   ▘  ▄▖▄▖", "▙▘▀▌ ▌▀▌▐ ▌▌", `▌▌█▌ ▌█▌▟▖▙▌ v${version}`, "    ▙▌"].join("\n"))

  intro()

  await auth.authFlow()
  await ollama.configFlow()

  // await cli.validateConnections()
  await kaja.registerNode({ name: "no-name" })
  if (!kaja.nodeId) {
    console.error("Node ID is required to submit results")
    process.exit(1)
  }

  await cli.beatingHeart()
  let job: JobData | undefined

  do {
    job = await cli.waitingForJobs()
    if (job) {
      // @ts-expect-error status is required
      const result: SubmitResultRequest = {
        nodeId: kaja.nodeId,
        jobId: job.id
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

      await kaja.submitResult(result)
    }
  } while (job)

  outro(`${purple}Farewell 🫠`)
  process.exit()
})()

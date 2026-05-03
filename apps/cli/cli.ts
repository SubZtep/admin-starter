import { intro, outro } from "@clack/prompts"
import type { JobData, SubmitResultRequest } from "@kaja/schemas"
import * as auth from "./lib/auth"
import * as cli from "./lib/cli-flow"
import * as ollama from "./lib/ollama"
import { dimgrey, green, kaja, lime, purple } from "./lib/vars"
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
  try {
    console.log(`v${CLI_VERSION}`)
  } catch {
    console.log(`v${version}`)
  }
  process.exit()
}

void (async () => {
  console.log(
    [`\n${lime}▖▖   ▘  ▄▖▄▖`, "▙▘▀▌ ▌▀▌▐ ▌▌", `▌▌█▌ ▌█▌▟▖▙▌ ${dimgrey}v${version}`, `${lime}    ▙▌\n`].join("\n")
  )

  intro("Authentication")
  await auth.authFlow()
  outro(`${green}Authentication successful`)

  // intro("Configuring Ollama... 🐒")
  // await ollama.configFlow()
  // outro("Ollama configured 🐒")

  // // await cli.validateConnections()
  // intro("Registering node... 🔗")
  // await kaja.registerNode({ name: "no-name" })
  // outro("Node registered 🔗")
  // if (!kaja.nodeId) {
  //   console.error("Node ID is required to submit results")
  //   process.exit(1)
  // }

  // intro("Beating heart... 💓")
  // await cli.beatingHeart()
  // outro("Heart beat successful 💓")
  // let job: JobData | undefined

  // do {
  //   intro("Waiting for jobs... 🕒")
  //   job = await cli.waitingForJobs()
  //   outro("Jobs found 🕒")
  //   if (job) {
  //     // @ts-expect-error status is required
  //     const result: SubmitResultRequest = {
  //       nodeId: kaja.nodeId,
  //       jobId: job.id
  //     }

  //     try {
  //       intro("Working on job... 💻")
  //       const text = await cli.workingOnJob(job)
  //       outro("Job completed 💻")
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

  // outro(`${purple}Farewell 🫠`)
  process.exit()
})()

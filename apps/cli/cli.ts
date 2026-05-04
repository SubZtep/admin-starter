import * as auth from "./ui/auth"
import * as init from "./ui/init"

init.helperCommands()
init.printLogo()

void (async () => {
  await auth.authFlow()

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

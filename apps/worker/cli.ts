import { intro, note, outro } from "@clack/prompts"
import { validateConnections, waitingForJobs } from "lib/cli-flow"
import { green, lime } from "./lib/var"

intro(`${lime}Welcome Aboard! 🏴‍☠️`)
await Bun.sleep(1200)
await validateConnections()

while (true) {
  if (await waitingForJobs()) {
    note("TODO: do something")
    await Bun.sleep(1000)
  } else {
    break
  }
}

outro(`${green}Farewell`)
process.exit(0)

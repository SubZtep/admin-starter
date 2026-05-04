import { log } from "@clack/prompts"
import { deleteAccessToken } from "lib/token"
import { dimgrey, lime } from "../lib/vars"
import { version } from "../package.json"

declare const CLI_VERSION: string

export async function helperCommands() {
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

  if (command === "logout") {
    await deleteAccessToken()
    console.log("Logged out successfully")
    process.exit()
  }
}

export async function printLogo() {
  log.message(
    [`${lime}▖▖   ▘  ▄▖▄▖`, `${lime}▙▘▀▌ ▌▀▌▐ ▌▌`, `${lime}▌▌█▌ ▌█▌▟▖▙▌`, `${lime}    ▙▌${dimgrey}v${version}\n`].join(
      "\n"
    ),
    {
      withGuide: false
    }
  )
}

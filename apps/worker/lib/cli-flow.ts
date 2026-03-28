import type { JobData } from "@app/schemas"
import { box, spinner, tasks } from "@clack/prompts"
import { cyan, kaja, ollama, pink, red } from "./var"

export async function validateConnections() {
  await tasks([
    {
      title: "Phone home",
      task: async () => {
        await Bun.sleep(500)
        if (!(await kaja.ping())) {
          console.log(`\n${red}No Home 🧟`)
          process.exit(1)
        }
        return `Connected to ${kaja.host()}`
      }
    },
    {
      title: "Signal Ollama",
      task: async () => {
        await Bun.sleep(500)
        if (!(await ollama.ping())) {
          console.log(`\n${red}No Llama 🐒`)
          process.exit(1)
        }
        return "Ollama detected"
      }
    },
    {
      title: "Check available models",
      task: async () => {
        await Bun.sleep(500)
        const models = await ollama.listModels()
        if (models.length === 0) {
          console.log(`\n${red}No models found 🪹`)
          process.exit(1)
        }
        if (models.length > 1) {
          return `Multiple models found: | -  ${models.join("\n| - ")}`
        } else {
          return `Model ${models[0]} ready`
        }
      }
    }
  ])

  box(`${pink}Looking all pretty‼ 💋`, undefined, {
    width: "auto",
    contentPadding: 1,
    rounded: true
  })
}

/** Idle state */
export async function waitingForJobs() {
  const spin = spinner()
  spin.start("Waiting for jobs")
  await Bun.sleep(1500)
  const job = await kaja.getJob()

  if (job) {
    spin.stop("Job found")
  } else {
    spin.cancel("No jobs found 🪹")
  }

  return job
}

export async function beatingHeart() {
  if (!kaja.nodeId) {
    console.log(`\n${red}Heartbeat for nodes only`)
    process.exit(1)
  }
  if (!(await kaja.heartbeat({ nodeId: kaja.nodeId, status: "idle" }))) {
    console.log(`\n${red}Heartbeat failed 🪹`)
    process.exit(1)
  }
}

/** @returns `true` if the job was completed successfully */
export async function workingOnJob(job: JobData) {
  box(`${cyan}${job.payload.prompt}`, "Prompt", {
    width: "auto",
    contentPadding: 1,
    rounded: true
  })

  const spin = spinner({ indicator: "timer" })
  spin.start("Working")
  const output = await ollama.runJob(job)
  spin.stop("Job done")

  box(output, "Output", {
    width: "auto",
    contentPadding: 1,
    rounded: true
  })
  return output
}

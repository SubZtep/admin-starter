import { KajaWorkerClient } from "kaja-sdk"

const kajaClient = new KajaWorkerClient(process.env.API_URL!, process.env.NODE_ID!)

async function runJob(_job: any) {
  // // call ollama locally
  // const res = await fetch("http://localhost:11434/api/generate", {
  //   method: "POST",
  //   body: JSON.stringify({
  //     model: job.model,
  //     prompt: job.prompt
  //   })
  // })

  // return res.json()
  console.log("Working.... 👩‍🏭")
  await Bun.sleep(3000)
  return { good: 1 }
}

async function submitResult(result: any) {
  await fetch(`${API_URL}/kaja/submit-result`, {
    method: "POST",
    body: JSON.stringify({
      nodeId: NODE_ID,
      result
    })
  })
}

async function main() {
  while (true) {
    console.log(" SLEEEEEP")
    await Bun.sleep(2000)

    try {
      const job = await getJob()

      if (!job) {
        console.log("no job -> no work 😪")
        await Bun.sleep(2000)
        continue
      }

      const result = await runJob(job)
      await submitResult(result)
    } catch (error: any) {
      console.error("worker error", error.message)
      await Bun.sleep(5000)
    }
  }
}

main()

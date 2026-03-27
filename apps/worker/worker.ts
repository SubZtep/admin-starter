// while (true) {
//   const job = await fetch("/get-job")
//   const result = await runOllama(job)
//   await fetch("/submit-result", result)
// }

import type { KajaWorkerClient } from "sdk"

// const API_URL = process.env.API_URL || "https://kaja.io"
// const NODE_ID = process.env.NODE_ID || crypto.randomUUID()

// async function getJob() {
//   const res = await fetch(`${API_URL}/kaja/get-job?nodeId=${NODE_ID}`)
//   if (res.status === 204) return null
//   return await res.json()
// }

// async function runJob(_job: any) {
//   // // call ollama locally
//   // const res = await fetch("http://localhost:11434/api/generate", {
//   //   method: "POST",
//   //   body: JSON.stringify({
//   //     model: job.model,
//   //     prompt: job.prompt
//   //   })
//   // })

//   // return res.json()
//   console.log("Working.... 👩‍🏭")
//   await Bun.sleep(3000)
//   return { good: 1 }
// }

// async function submitResult(result: any) {
//   await fetch(`${API_URL}/kaja/submit-result`, {
//     method: "POST",
//     body: JSON.stringify({
//       nodeId: NODE_ID,
//       result
//     })
//   })
// }

export async function workerLoop(client: KajaWorkerClient, nodeId: string) {
  while (true) {
    console.log("Worker loop is sleeping... 😴")
    await Bun.sleep(2000)

    try {
      const job = await client.getJob({})

      if (!job) {
        console.log("no job -> no work 😪")
        await Bun.sleep(2000)
        return
      }

      console.log("Working hard 😫", job)
      await Bun.sleep(3000)

      // const result = await client.runJob(job)
      // await client.submitResult({
      //   // nodeId: client.nodeId,
      //   nodeId,
      //   jobId: job.jobId,
      //   status: "error"
      //   // status: "success",
      //   // result: { text: "Hello, world!" }
      // })
      await client.submitResult({
        // nodeId: client.nodeId,
        nodeId,
        jobId: job.jobId,
        // status: "error"
        status: "success",
        result: { text: "Hello, world!" }
      })
    } catch (error: any) {
      console.error("worker error", error.message)
      await Bun.sleep(5000)
    }
  }
}

// main()

import { submitResultRequestSchema, submitResultResponseSchema } from "@app/schemas"
import { zValidator } from "@hono/zod-validator"
import type { RouteRegProps } from "#/types"
import { jobs, nodes } from "../../services/queue"

export function registerSubmitResult(app: RouteRegProps) {
  app.post("/submit-result", zValidator("json", submitResultRequestSchema), async c => {
    // const body = c.req.valid("json")

    // const job = jobs.find(j => j.jobId === body.jobId)
    // if (!job) return c.json({ error: "job not found" }, 404)

    // job.status = body.status === "success" ? "done" : "error"

    // const node = nodes.get(body.nodeId)
    // if (node) {
    //   node.status = "idle"
    //   node.currentJobId = null
    // }

    // for now just log result
    // console.log("RESULT:", body.result || body.error)

    return c.json(submitResultResponseSchema.parse({ ok: true }))
  })
}

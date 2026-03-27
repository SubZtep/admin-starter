import type { Job } from "@app/schemas"
import type { Pool } from "pg"
import { logger } from "#/core/logger"

export class QueueService {
  #db: Pool

  constructor(db: Pool) {
    this.#db = db
  }

  async createJob(job: Job) {
    const result = await this.#db.query(
      `
      INSERT INTO jobs (job_id, type, payload, status, created_at, updated_at)
      VALUES ($1, $2, $3, 'queued', NOW(), NOW())
      RETURNING *
      `,
      [job.jobId, job.type, JSON.stringify(job.payload)]
    )
    logger.info({ job: result.rows[0] }, "created job")
    return this.#rowToJob(result.rows[0])
  }

  async getNextJob(nodeId: string) {
    const { rows } = await this.#db.query(
      `
      UPDATE jobs
      SET status = 'assigned',
          assigned_to = $1,
          updated_at = NOW(),
          started_at = NOW()
      WHERE job_id = (
        SELECT job_id
        FROM jobs
        WHERE status = 'queued'
        ORDER BY created_at ASC
        LIMIT 1
        FOR UPDATE SKIP LOCKED
      )
      RETURNING *
      `,
      [nodeId]
    )

    logger.info({ nodeId, job: rows[0] }, "got next job")

    return rows[0] ? this.#rowToJob(rows[0]) : null
  }

  async submitResult(jobId: string, status: "success" | "error", result?: Record<string, any>, error?: string) {
    const { rowCount } = await this.#db.query(
      `
      UPDATE jobs
      SET status = $1,
          assigned_to = NULL,
          result = $3,
          error = $4,
          updated_at = NOW(),
          completed_at = NOW()
      WHERE job_id = $2
      `,
      [status === "success" ? "done" : "error", jobId, result ? JSON.stringify(result) : null, error || null]
    )

    return rowCount && rowCount > 0
  }

  // TODO: run this periodically (cron or setInterval)
  async requeueStaleJobs(timeoutSeconds = 60) {
    await this.#db.query(
      `
      UPDATE jobs
      SET status = 'queued',
          assigned_to = NULL,
          updated_at = NOW()
      WHERE status = 'assigned'
        AND updated_at < NOW() - INTERVAL '${timeoutSeconds} seconds'
      `
    )
  }

  #rowToJob(row: any): Job {
    let payload: Record<string, any>

    if (typeof row.payload === "string") {
      try {
        payload = JSON.parse(row.payload)
      } catch {
        payload = {}
      }
    } else {
      payload = row.payload || {}
    }

    let result: Record<string, any> | undefined

    if (row.result) {
      if (typeof row.result === "string") {
        try {
          result = JSON.parse(row.result)
        } catch {
          result = undefined
        }
      } else {
        result = row.result
      }
    }

    return {
      jobId: row.job_id,
      type: row.type,
      status: row.status,
      assignedTo: row.assigned_to || undefined,
      createdAt: row.created_at,
      payload,
      ...(result && { result }),
      ...(row.error && { error: row.error })
    }
  }
}

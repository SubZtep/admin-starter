import type { Pool } from "pg"
import { logger } from "#/core/logger"

export interface Node {
  nodeId: string
  name: string
  capabilities?: {
    models: string[]
    gpu: boolean
    memoryGb: number
  }
  lastSeen: Date
  status: "idle" | "busy" | "inactive"
  currentJobId?: string
}

export class NodeService {
  readonly #db: Pool

  constructor(db: Pool) {
    this.#db = db
  }

  async registerNode(node: Omit<Node, "lastSeen" | "status">): Promise<Node> {
    const result = await this.#db.query(
      `
      INSERT INTO nodes (node_id, name, capabilities, last_seen, status)
      VALUES ($1, $2, $3, NOW(), 'idle')
      ON CONFLICT (node_id)
      DO UPDATE SET
        name = EXCLUDED.name,
        capabilities = EXCLUDED.capabilities,
        last_seen = NOW(),
        status = 'idle'
      RETURNING *
      `,
      [node.nodeId, node.name, JSON.stringify(node.capabilities || {})]
    )

    logger.info({ node: result.rows[0] }, "registered node")
    return this.#rowToNode(result.rows[0])
  }

  async heartbeat(nodeId: string, status: "idle" | "busy", currentJobId?: string): Promise<boolean> {
    const { rowCount } = await this.#db.query(
      `
      UPDATE nodes
      SET last_seen = NOW(),
          status = $2,
          current_job_id = $3
      WHERE node_id = $1
      `,
      [nodeId, status, currentJobId || null]
    )

    return rowCount !== null && rowCount > 0
  }

  async markInactiveNodes(timeoutSeconds = 300): Promise<number> {
    const { rowCount } = await this.#db.query(
      `
      UPDATE nodes
      SET status = 'inactive',
          current_job_id = NULL,
          updated_at = NOW()
      WHERE status != 'inactive'
        AND last_seen < NOW() - INTERVAL '${timeoutSeconds} seconds'
      `
    )

    if (rowCount && rowCount > 0) {
      logger.info({ count: rowCount }, "marked nodes as inactive")
    }

    return rowCount || 0
  }

  async getNode(nodeId: string): Promise<Node | null> {
    const { rows } = await this.#db.query(
      `
      SELECT * FROM nodes WHERE node_id = $1
      `,
      [nodeId]
    )

    return rows[0] ? this.#rowToNode(rows[0]) : null
  }

  async getActiveNodes(): Promise<Node[]> {
    const { rows } = await this.#db.query(
      `
      SELECT * FROM nodes WHERE status != 'inactive' ORDER BY last_seen DESC
      `
    )

    return rows.map(row => this.#rowToNode(row))
  }

  #rowToNode(row: any): Node {
    let capabilities: Node["capabilities"]

    if (row.capabilities) {
      // Handle both JSONB object and string representations
      if (typeof row.capabilities === "string") {
        try {
          capabilities = JSON.parse(row.capabilities)
        } catch {
          capabilities = undefined
        }
      } else if (typeof row.capabilities === "object") {
        // PostgreSQL JSONB returns as object directly
        const caps = row.capabilities
        // Check if it's not an empty object
        if (Object.keys(caps).length > 0) {
          capabilities = {
            models: caps.models || [],
            gpu: caps.gpu || false,
            memoryGb: caps.memoryGb || 0
          }
        }
      }
    }

    return {
      nodeId: row.node_id,
      name: row.name,
      capabilities,
      lastSeen: new Date(row.last_seen),
      status: row.status,
      currentJobId: row.current_job_id
    }
  }
}

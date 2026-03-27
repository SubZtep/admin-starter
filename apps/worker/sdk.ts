import { join } from "node:path"
import type {
  CreateJobRequest,
  GetJobRequest,
  HeartbeatRequest,
  RegisterNodeRequest,
  SubmitResultRequest
} from "@app/schemas/kaja/worker"

export interface KajaWorkerClientOptions {
  baseURL?: string
  nodeId?: string
}

export class KajaWorkerClient {
  readonly baseURL: string
  private readonly nodeId: string

  constructor(options?: KajaWorkerClientOptions) {
    this.baseURL = options?.baseURL ?? process.env.KAJA_API_URL ?? "https://kaja.io"
    this.nodeId = options?.nodeId ?? crypto.randomUUID()
  }

  async createJob(payload: CreateJobRequest) {
    return await this.#apiRequest("/kaja/create-job", payload)
  }

  async registerNode(payload?: RegisterNodeRequest) {
    return await this.#apiRequest("/kaja/register-node", payload)
  }

  async getJob(payload: GetJobRequest) {
    return await this.#apiRequest("/kaja/get-job", payload)
  }

  async submitResult(payload: SubmitResultRequest) {
    console.log("SUBMITTING RESULT", payload)
    return await this.#apiRequest("/kaja/submit-result", payload)
  }

  async heartbeat(payload: HeartbeatRequest) {
    const res = await this.#apiRequest("/kaja/heartbeat", payload)
    if (!res.ok) {
      throw new Error(`Error sending heartbeat, payload: ${JSON.stringify(payload)}`)
    }
    return true
  }

  async #apiRequest(path: string, payload?: Record<string, any>, options?: RequestInit) {
    const response = await fetch(join(this.baseURL, path), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload ? JSON.stringify(payload) : undefined,
      ...options
    })

    const data = await response.json()
    console.log("RESPONSE", data)

    // if (!response.ok) {
    //   throw new Error(`HTTP error! status: ${response.status}, path: ${path}, payload: ${JSON.stringify(payload)}`)
    // }
    // return response.json()
    return data
  }
}

import { join } from "node:path"
import type {
  CreateJobRequest,
  CreateJobResponse,
  GetJobResponse,
  HeartbeatRequest,
  HeartbeatResponse,
  RegisterNodeRequest,
  RegisterNodeResponse,
  SubmitResultRequest
} from "@kaja/schemas"
import { getAccessToken } from "./token"

export interface KajaClientOptions {
  baseURL?: string
  nodeId?: string
}

export class KajaClient {
  readonly baseURL: string
  nodeId?: string

  constructor(options?: KajaClientOptions) {
    this.baseURL = options?.baseURL ?? process.env.API_URL
    this.nodeId = options?.nodeId
  }

  async createJob(payload: CreateJobRequest) {
    return await this.#apiRequest<CreateJobResponse>("/kaja/create-job", payload)
  }

  /** Apply for jobs */
  async registerNode(payload: RegisterNodeRequest) {
    let res: RegisterNodeResponse | undefined
    try {
      res = await this.#apiRequest<RegisterNodeResponse>("/kaja/register-node", payload)
      this.nodeId = res.nodeId
    } catch (error: any) {
      console.error("error registering node", error.message)
      process.exit(1)
    }
    return this.nodeId
  }

  /** @returns The first available job from the queue. */
  async getJob() {
    if (!this.nodeId) {
      throw new Error("Node ID is required to get a job")
    }

    try {
      return await this.#apiRequest<GetJobResponse>("/kaja/get-job", { nodeId: this.nodeId })
    } catch (error: any) {
      console.error("error getting job", error.message)
      process.exit(1)
    }
  }

  async submitResult(payload: SubmitResultRequest) {
    return await this.#apiRequest("/kaja/submit-result", payload)
  }

  async heartbeat(payload: HeartbeatRequest) {
    let beating: boolean
    try {
      beating = (await this.#apiRequest<HeartbeatResponse>("/kaja/heartbeat", payload)).ok
    } catch (error: any) {
      console.error("Sending heartbeat", error.message)
      beating = false
    }
    return beating
  }

  async ping() {
    const res = await fetch(join(this.baseURL, "/health"))
    return res.ok
  }

  host() {
    try {
      return new URL(this.baseURL).host
    } catch {
      return "N/A 😱"
    }
  }

  async #apiRequest<T = unknown>(path: string, payload?: Record<string, any>, options?: RequestInit) {
    const { headers: initHeaders, ...rest } = options ?? {}
    const headers = new Headers(initHeaders)
    headers.set("Content-Type", "application/json")
    const token = await getAccessToken()
    if (token) {
      headers.set("Authorization", `Bearer ${token}`)
    }
    const response = await fetch(join(this.baseURL, path), {
      method: "POST",
      headers,
      body: payload ? JSON.stringify(payload) : undefined,
      ...rest
    })

    if (!response.ok) {
      throw new Error(`${response.statusText} around ${path} 🤮`)
    }

    return (await response.json()) as T
  }
}

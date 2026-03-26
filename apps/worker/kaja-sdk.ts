export interface KajaWorkerClientOptions {
  baseURL?: string
  nodeId?: string
}

export class KajaWorkerClient {
  private readonly baseURL: string
  private readonly nodeId: string

  constructor(options: KajaWorkerClientOptions) {
    this.baseURL = options.baseURL ?? "https://kaja.io"

    this.nodeId = options.nodeId ?? crypto.randomUUID()
  }

  async getJob() {
    const response = await fetch(`${this.apiUrl}/kaja/get-job?nodeId=${this.nodeId}`)
  }

  async submitResult(result: any) {
    await fetch(`${this.apiUrl}/kaja/submit-result`, {
      method: "POST",
      body: JSON.stringify({ nodeId: this.nodeId, result })
    })
  }

  async heartbeat() {
    await fetch(`${this.apiUrl}/kaja/heartbeat`, {
      method: "POST",
      body: JSON.stringify({ nodeId: this.nodeId })
    })
  }
}

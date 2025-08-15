interface AbacatePayConfig {
  apiKey: string
  baseUrl: string
  devMode: boolean
}

interface CreateBillingRequest {
  amount: number
  description: string
  customer?: {
    email?: string
    name?: string
    phone?: string
  }
  methods?: string[]
  frequency?: "ONE_TIME" | "MONTHLY" | "YEARLY"
  metadata?: Record<string, any>
}

interface AbacatePayResponse<T> {
  data: T | null
  error: string | null
}

interface BillingData {
  id: string
  url: string
  amount: number
  status: "PENDING" | "PAID" | "CANCELLED" | "EXPIRED"
  devMode: boolean
  methods: string[]
  frequency: string
  nextBilling: string | null
  customer: {
    id: string
    metadata: Record<string, any>
  }
  createdAt: string
  updatedAt: string
}

class AbacatePayService {
  private config: AbacatePayConfig

  constructor() {
    this.config = {
      apiKey: process.env.ABACATE_PAY_API_KEY || "",
      baseUrl: "https://api.abacatepay.com",
      devMode: process.env.NODE_ENV !== "production",
    }

    if (!this.config.apiKey) {
      throw new Error("ABACATE_PAY_API_KEY environment variable is required")
    }
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<AbacatePayResponse<T>> {
    try {
      const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
          "Content-Type": "application/json",
          ...options.headers,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          data: null,
          error: data.message || `HTTP ${response.status}: ${response.statusText}`,
        }
      }

      return data
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }
    }
  }

  async createBilling(request: CreateBillingRequest): Promise<AbacatePayResponse<BillingData>> {
    return this.makeRequest<BillingData>("/billing/create", {
      method: "POST",
      body: JSON.stringify({
        ...request,
        devMode: this.config.devMode,
      }),
    })
  }

  async getBilling(billingId: string): Promise<AbacatePayResponse<BillingData>> {
    return this.makeRequest<BillingData>(`/billing/get?id=${billingId}`)
  }

  async cancelBilling(billingId: string): Promise<AbacatePayResponse<{ success: boolean }>> {
    return this.makeRequest<{ success: boolean }>("/billing/cancel", {
      method: "POST",
      body: JSON.stringify({ id: billingId }),
    })
  }

  // Webhook signature verification
  verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
    // Implementation would depend on Abacate Pay's webhook signature method
    // This is a placeholder - check their documentation for the exact method
    return true
  }
}

export const abacatePayService = new AbacatePayService()
export type { CreateBillingRequest, BillingData, AbacatePayResponse }

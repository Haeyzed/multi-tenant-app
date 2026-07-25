import { resolveTenantApiBaseUrl, TENANT_TOKEN_KEY } from "@/lib/tenant-api-url"

export type ApiEnvelope<T> = {
  status: boolean
  message: string
  data: T
  meta?: Record<string, unknown> | null
  errors?: Record<string, string[]> | null
}

class TenantApiClient {
  private token: string | null = null

  constructor() {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem(TENANT_TOKEN_KEY)
    }
  }

  public setToken(token: string | null) {
    this.token = token
    if (typeof window === "undefined") {
      return
    }
    if (token) {
      localStorage.setItem(TENANT_TOKEN_KEY, token)
    } else {
      localStorage.removeItem(TENANT_TOKEN_KEY)
    }
  }

  public getToken(): string | null {
    if (this.token) {
      return this.token
    }
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem(TENANT_TOKEN_KEY)
    }
    return this.token
  }

  public get<T>(path: string, params?: Record<string, unknown>): Promise<T> {
    return this.request<T>("GET", path, undefined, params)
  }

  public post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>("POST", path, body)
  }

  public put<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>("PUT", path, body)
  }

  public patch<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>("PATCH", path, body)
  }

  public delete<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>("DELETE", path, body)
  }

  private async request<T>(
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
    path: string,
    body?: unknown,
    params?: Record<string, unknown>
  ): Promise<T> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "application/json",
    }

    const token = this.getToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    let url = `${resolveTenantApiBaseUrl()}${path}`
    if (params) {
      const filteredParams = Object.fromEntries(
        Object.entries(params).filter(
          ([, value]) => value !== undefined && value !== null
        )
      )
      const query = new URLSearchParams(
        filteredParams as Record<string, string>
      ).toString()
      if (query) {
        url += `?${query}`
      }
    }

    const response = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })

    const responseData = await response.json().catch(() => null)

    if (!response.ok) {
      throw new ApiError(
        responseData?.message ||
          `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        responseData?.errors ?? undefined
      )
    }

    return responseData as T
  }
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors?: Record<string, string[]>
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export const tenantApiClient = new TenantApiClient()

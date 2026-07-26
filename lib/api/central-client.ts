const TOKEN_KEY = "central_token"

export type ApiEnvelope<T> = {
  status: boolean
  message: string
  data: T
  meta?: Record<string, unknown> | null
  errors?: Record<string, string[]> | null
}

export type ApiRequestOptions = {
  signal?: AbortSignal
}

class CentralApiClient {
  private readonly baseURL: string
  private token: string | null = null

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_CENTRAL_API_URL || ""
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem(TOKEN_KEY)
    }
  }

  public setToken(token: string | null) {
    this.token = token
    if (typeof window === "undefined") {
      return
    }
    if (token) {
      localStorage.setItem(TOKEN_KEY, token)
    } else {
      localStorage.removeItem(TOKEN_KEY)
    }
  }

  public getToken(): string | null {
    if (this.token) {
      return this.token
    }
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem(TOKEN_KEY)
    }
    return this.token
  }

  public get<T>(
    path: string,
    params?: Record<string, unknown>,
    options?: ApiRequestOptions
  ): Promise<T> {
    return this.request<T>("GET", path, undefined, params, options)
  }

  public post<T>(
    path: string,
    body?: unknown,
    options?: ApiRequestOptions
  ): Promise<T> {
    return this.request<T>("POST", path, body, undefined, options)
  }

  public put<T>(
    path: string,
    body?: unknown,
    options?: ApiRequestOptions
  ): Promise<T> {
    return this.request<T>("PUT", path, body, undefined, options)
  }

  public patch<T>(
    path: string,
    body?: unknown,
    options?: ApiRequestOptions
  ): Promise<T> {
    return this.request<T>("PATCH", path, body, undefined, options)
  }

  public delete<T>(
    path: string,
    body?: unknown,
    options?: ApiRequestOptions
  ): Promise<T> {
    return this.request<T>("DELETE", path, body, undefined, options)
  }

  public upload<T>(
    path: string,
    formData: FormData,
    options?: ApiRequestOptions
  ): Promise<T> {
    return this.uploadRequest<T>(path, formData, options)
  }

  private async uploadRequest<T>(
    path: string,
    formData: FormData,
    options?: ApiRequestOptions
  ): Promise<T> {
    const headers: HeadersInit = {
      Accept: "application/json",
    }

    const token = this.getToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(`${this.baseURL}${path}`, {
      method: "POST",
      headers,
      body: formData,
      signal: options?.signal,
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

  private async request<T>(
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
    path: string,
    body?: unknown,
    params?: Record<string, unknown>,
    options?: ApiRequestOptions
  ): Promise<T> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "application/json",
    }

    const token = this.getToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    let url = `${this.baseURL}${path}`
    if (params) {
      const filteredParams = Object.fromEntries(
        Object.entries(params).filter(
          ([, value]) => value !== undefined && value !== null && value !== ""
        )
      )
      const query = new URLSearchParams()
      for (const [key, value] of Object.entries(filteredParams)) {
        if (Array.isArray(value)) {
          for (const item of value) {
            query.append(key, String(item))
          }
        } else {
          query.set(key, String(value))
        }
      }
      const queryString = query.toString()
      if (queryString) {
        url += `?${queryString}`
      }
    }

    const response = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: options?.signal,
    })

    if (options?.signal?.aborted) {
      throw new DOMException("The operation was aborted.", "AbortError")
    }

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

export const centralApiClient = new CentralApiClient()

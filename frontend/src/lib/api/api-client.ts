class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errors?: Record<string, string[]>,
  ) {
    super(message)
    this.name = "APIError"
  }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

if (typeof window !== "undefined" && API_BASE_URL.includes(window.location.host)) {
  console.error("[v0] ERROR: API_BASE_URL is pointing to the preview server!")
  console.error("[v0] Please set NEXT_PUBLIC_API_URL to your backend API URL")
}

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  console.log("[v0] API Request:", options?.method || "GET", url)

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    })

    console.log("[v0] API Response:", response.status, response.statusText)

    if (response.status === 204) {
      return null as T
    }

    const contentType = response.headers.get("content-type")
    console.log("[v0] Response Content-Type:", contentType)

    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text()
      console.error("[v0] Non-JSON Response:", text.substring(0, 200))

      if (text.includes("<!DOCTYPE") || text.includes("<html")) {
        throw new APIError(
          `O servidor retornou HTML em vez de JSON. Verifique se a URL da API está correta: ${API_BASE_URL}`,
          response.status,
        )
      }

      throw new APIError(
        `Resposta inválida do servidor (esperado JSON, recebido ${contentType || "unknown"})`,
        response.status,
      )
    }

    const data = await response.json()

    if (!response.ok) {
      const errorMessage = data.message || `Erro na requisição (${response.status})`
      console.error("[v0] API Error Response:", errorMessage, data)
      throw new APIError(errorMessage, response.status, data.errors)
    }

    return data
  } catch (error) {
    if (error instanceof APIError) {
      throw error
    }

    if (error instanceof SyntaxError && error.message.includes("JSON")) {
      console.error("[v0] JSON Parse Error:", error)
      throw new APIError(
        `Erro ao processar resposta do servidor. Verifique se o backend está retornando JSON válido.`,
        500,
      )
    }

    if (error instanceof TypeError && error.message.includes("fetch")) {
      console.error("[v0] Network Error: Cannot connect to API at", url)
      console.error("[v0] Make sure your backend is running at:", API_BASE_URL)
      throw new APIError(
        `Não foi possível conectar ao servidor em ${API_BASE_URL}. Verifique se o backend está rodando.`,
        0,
      )
    }

    console.error("[v0] Unexpected Error:", error)
    throw new APIError("Erro inesperado ao conectar com o servidor", 500)
  }
}

function apiGet<T>(endpoint: string) {
  return fetchAPI<T>(endpoint, { method: "GET" })
}

function apiPost<T>(endpoint: string, data: unknown) {
  return fetchAPI<T>(endpoint, { method: "POST", body: JSON.stringify(data) })
}

function apiPut<T>(endpoint: string, data: unknown) {
  return fetchAPI<T>(endpoint, { method: "PUT", body: JSON.stringify(data) })
}

function apiDelete<T>(endpoint: string) {
  return fetchAPI<T>(endpoint, { method: "DELETE" })
}

export const apiClient = {
  get: apiGet,
  post: apiPost,
  put: apiPut,
  delete: apiDelete,
}

export { APIError }

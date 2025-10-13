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

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    })

    if (response.status === 204) {
      return null as T
    }

    const data = await response.json()

    if (!response.ok) {
      throw new APIError(data.message || "Erro na requisição", response.status, data.errors)
    }

    return data
  } catch (error) {
    if (error instanceof APIError) {
      throw error
    }
    throw new APIError("Erro ao conectar com o servidor", 500)
  }
}

export const apiClient = {
  get: <T>(endpoint: string) => fetchAPI<T>(endpoint, { method: "GET" }),
  post: <T>(endpoint: string, data: unknown) => fetchAPI<T>(endpoint, { method: "POST", body: JSON.stringify(data) }),
  put: <T>(endpoint: string, data: unknown) => fetchAPI<T>(endpoint, { method: "PUT", body: JSON.stringify(data) }),
  delete: <T>(endpoint: string) => fetchAPI<T>(endpoint, { method: "DELETE" }),
}

export { APIError }

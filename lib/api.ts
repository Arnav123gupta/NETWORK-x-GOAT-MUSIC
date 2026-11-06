import type { PairingStatusResponse } from '@/lib/types'
export * from '@/lib/types'

const backendUrl = process.env.BACKEND_API_URL ?? (process.env.NODE_ENV === 'development' ? 'http://localhost:8787/api' : undefined)
const backendApiKey = process.env.BACKEND_API_KEY

export function backendConfigured() { return Boolean(backendUrl) }
export function backendConfigurationError() {
  if (!backendUrl) return 'BACKEND_API_URL is not configured.'
  if (process.env.NODE_ENV === 'production' && !backendApiKey) return 'BACKEND_API_KEY is not configured on the Next.js server.'
  return undefined
}

export class BackendFetchError extends Error {
  constructor(public readonly status: number, message: string) { super(message); this.name = 'BackendFetchError' }
}
export function backendErrorStatus(error: unknown) { return error instanceof BackendFetchError ? error.status : 503 }

export async function backendFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const configurationError = backendConfigurationError()
  if (configurationError) throw new BackendFetchError(503, configurationError)
  const headers = new Headers(init?.headers)
  if (!headers.has('content-type')) headers.set('content-type', 'application/json')
  if (backendApiKey) headers.set('authorization', `Bearer ${backendApiKey}`)
  const response = await fetch(`${backendUrl!.replace(/\/$/, '')}${path}`, { ...init, headers, cache: 'no-store' })
  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new BackendFetchError(response.status, detail || `Music backend returned ${response.status}.`)
  }
  return response.json() as Promise<T>
}

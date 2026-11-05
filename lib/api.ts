import type { PairingStatusResponse } from '@/lib/types'
export * from '@/lib/types'

const backendUrl = process.env.BACKEND_API_URL ?? (process.env.NODE_ENV === 'development' ? 'http://localhost:8787/api' : undefined)

export function backendConfigured() { return Boolean(backendUrl) }

export async function backendFetch<T>(path: string, init?: RequestInit): Promise<T> {
  if (!backendUrl) throw new Error('Music backend is not configured.')
  const response = await fetch(`${backendUrl.replace(/\/$/, '')}${path}`, { ...init, cache: 'no-store', headers: { 'content-type': 'application/json', ...init?.headers } })
  if (!response.ok) throw new Error(`Music backend returned ${response.status}.`)
  return response.json() as Promise<T>
}

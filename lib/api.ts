export type ApiError = { error: string; code?: string }

export type HealthResponse = {
  configured: boolean
  status: 'ok' | 'unconfigured' | 'unavailable'
  service: string
  checkedAt: string
  message?: string
}

export type ServerInfo = {
  id: string
  name: string
  region: string
  load: number
  status: 'online' | 'offline' | 'maintenance'
}

export type ServersResponse = { servers: ServerInfo[]; source: 'persistent-backend' }
export type PairingRequest = { phoneNumber: string; serverId: string }
export type PairingRequestResponse = { requestId: string; status: 'pending' | 'rejected'; message: string }
export type PairingStatusResponse = { requestId: string; status: 'pending' | 'paired' | 'failed'; message?: string }

const backendUrl = process.env.MUSIC_BACKEND_API_URL

export function backendConfigured() { return Boolean(backendUrl) }

export async function backendFetch<T>(path: string, init?: RequestInit): Promise<T> {
  if (!backendUrl) throw new Error('Music backend is not configured.')
  const response = await fetch(`${backendUrl.replace(/\/$/, '')}${path}`, { ...init, cache: 'no-store', headers: { 'content-type': 'application/json', ...init?.headers } })
  if (!response.ok) throw new Error(`Music backend returned ${response.status}.`)
  return response.json() as Promise<T>
}

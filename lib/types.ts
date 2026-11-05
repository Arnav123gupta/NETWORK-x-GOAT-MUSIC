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
  load?: number
  status: 'online' | 'offline' | 'maintenance' | 'unknown'
}

export type ServersResponse = { servers: ServerInfo[]; source?: string }
export type BotStatusResponse = { bot: { status: 'online' | 'offline' | 'unknown'; whatsapp: 'connected' | 'disconnected' | 'unknown'; message?: string } }
export type DashboardStatsResponse = { stats: { uptime: string | null; totalRequests: number | null; activeSessions: number | null; lastConnection: string | null } }
export type CommandInfo = { name: string; description: string; available: boolean }
export type CommandsResponse = { commands: CommandInfo[] }
export type PairingRequest = { phoneNumber: string; serverId: string }
export type PairingRequestResponse = { requestId: string; status: 'pending' | 'paired' | 'failed' | 'rejected'; message: string }
export type PairingStatusResponse = { requestId: string; status: 'pending' | 'paired' | 'failed' | 'rejected'; message?: string }
export type MusicSearchResponse = { results: Array<{ title: string; artist: string; duration?: string; url?: string }> }

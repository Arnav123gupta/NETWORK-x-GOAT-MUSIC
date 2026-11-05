export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected' | 'reconnecting' | 'unconfigured'

export type ServerRecord = {
  id: string
  name: string
  region: string
  load: number | null
  status: 'online' | 'offline' | 'maintenance'
}

export type PairingRequestRecord = {
  requestId: string
  phoneNumber: string
  serverId: string
  status: 'pending' | 'paired' | 'failed'
  message: string
  createdAt: string
  updatedAt: string
}

export type BotStatus = {
  status: ConnectionStatus
  service: string
  phoneNumber?: string
  lastError?: string
  checkedAt: string
}

import type { BotStatus } from '../types/index.js'

export interface WhatsAppAdapter {
  initialize(sessionDirectory: string, onStatus: (status: BotStatus) => void): Promise<void>
  requestPairing(phoneNumber: string): Promise<void>
  getStatus(): BotStatus
  shutdown(): Promise<void>
}

export interface MusicProvider {
  search(query: string): Promise<Array<{ title: string; artist: string; duration: string; url?: string }>>
  health(): Promise<{ status: 'online' | 'offline'; provider: string; message?: string }>
}

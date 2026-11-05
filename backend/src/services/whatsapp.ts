import { mkdirSync } from 'node:fs'
import { config } from '../config.js'
import type { BotStatus, ConnectionStatus } from '../types/index.js'

export interface SessionPersistence {
  getSessionDirectory(): string
}

class FileSessionPersistence implements SessionPersistence {
  constructor(private readonly directory: string) { mkdirSync(directory, { recursive: true }) }
  getSessionDirectory() { return this.directory }
}

export class WhatsAppService {
  private status: ConnectionStatus = 'unconfigured'
  private lastError: string | undefined
  private readonly persistence = new FileSessionPersistence(config.WHATSAPP_SESSION_DIR)

  async initialize() {
    this.status = 'unconfigured'
    return this.getStatus()
  }

  async requestPairing(_phoneNumber: string) {
    if (this.status === 'unconfigured') throw new Error('WhatsApp integration is not configured.')
    throw new Error('Pairing is unavailable until an authorized WhatsApp adapter is configured.')
  }

  async shutdown() { this.status = 'disconnected' }

  getStatus(): BotStatus {
    return { status: this.status, service: 'whatsapp', lastError: this.lastError, checkedAt: new Date().toISOString() }
  }

  getSessionDirectory() { return this.persistence.getSessionDirectory() }
}

export const whatsappService = new WhatsAppService()

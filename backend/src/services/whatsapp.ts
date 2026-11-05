import { mkdirSync } from 'node:fs'
import { config } from '../config.js'
import type { BotStatus, ConnectionStatus } from '../types/index.js'
import type { WhatsAppAdapter } from './providers.js'
import { WhatsAppCloudApiAdapter } from './whatsappCloudApi.js'

class UnconfiguredWhatsAppAdapter implements WhatsAppAdapter {
  private status: BotStatus = this.makeStatus('unconfigured')
  private reconnectTimer?: NodeJS.Timeout

  private makeStatus(status: ConnectionStatus, lastError?: string): BotStatus {
    return { status, service: 'whatsapp', lastError, checkedAt: new Date().toISOString() }
  }

  async initialize(sessionDirectory: string, onStatus: (status: BotStatus) => void) {
    mkdirSync(sessionDirectory, { recursive: true })
    this.status = this.makeStatus('unconfigured', 'No authorized WhatsApp provider is configured.')
    onStatus(this.status)
  }

  async requestPairing(_phoneNumber: string): Promise<void> {
    throw new Error('WhatsApp pairing is unavailable until an authorized provider adapter is configured.')
  }

  getStatus() { return this.status }

  async shutdown() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer)
    this.status = this.makeStatus('disconnected')
  }
}

export class WhatsAppService {
  private status: BotStatus = { status: 'unconfigured', service: 'whatsapp', checkedAt: new Date().toISOString() }
  private readonly adapter: WhatsAppAdapter = new WhatsAppCloudApiAdapter()

  async initialize() {
    await this.adapter.initialize(config.WHATSAPP_SESSION_DIR, (status) => { this.status = status })
    return this.status
  }

  async requestPairing(phoneNumber: string) {
    await this.adapter.requestPairing(phoneNumber)
  }

  async shutdown() { await this.adapter.shutdown(); this.status = this.adapter.getStatus() }
  async handleWebhook(_payload: unknown) { this.status = { ...this.status, status: 'connected', checkedAt: new Date().toISOString(), lastError: undefined } }
  getStatus() { return this.status }
  getSessionDirectory() { return config.WHATSAPP_SESSION_DIR }
}

export const whatsappService = new WhatsAppService()

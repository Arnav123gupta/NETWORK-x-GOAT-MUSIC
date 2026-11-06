import { config } from '../config.js'
import type { BotStatus, ConnectionStatus } from '../types/index.js'
import type { WhatsAppAdapter } from './providers.js'

export class WhatsAppCloudApiAdapter implements WhatsAppAdapter {
  private status: BotStatus = this.makeStatus('unconfigured')
  private statusListener?: (status: BotStatus) => void
  private baseUrl() { return `https://graph.facebook.com/${config.WHATSAPP_GRAPH_API_VERSION}` }
  private makeStatus(status: ConnectionStatus, lastError?: string): BotStatus { return { status, service: 'whatsapp-cloud-api', phoneNumber: config.WHATSAPP_PHONE_NUMBER_ID, lastError, checkedAt: new Date().toISOString() } }
  private configured() { return Boolean(config.WHATSAPP_ACCESS_TOKEN && config.WHATSAPP_PHONE_NUMBER_ID) }

  async initialize(_sessionDirectory: string, onStatus: (status: BotStatus) => void) {
    this.statusListener = onStatus
    if (!this.configured()) { this.status = this.makeStatus('unconfigured', 'Configure WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID in Meta WhatsApp Manager.'); onStatus(this.status); return }
    this.status = this.makeStatus('connecting'); onStatus(this.status)
    try {
      const response = await fetch(`${this.baseUrl()}/${config.WHATSAPP_PHONE_NUMBER_ID}?fields=id,display_phone_number,verified_name`, { headers: { Authorization: `Bearer ${config.WHATSAPP_ACCESS_TOKEN}` }, signal: AbortSignal.timeout(8000) })
      if (!response.ok) throw new Error(`Meta Cloud API returned HTTP ${response.status}.`)
      const phone = await response.json() as { display_phone_number?: string }
      this.status = { ...this.makeStatus('connected'), phoneNumber: phone.display_phone_number ?? config.WHATSAPP_PHONE_NUMBER_ID }
    } catch (error) { this.status = this.makeStatus('disconnected', error instanceof Error ? error.message : 'Meta Cloud API connection failed.') }
    onStatus(this.status)
  }

  async requestPairing(_phoneNumber: string): Promise<void> { throw new Error('Meta WhatsApp Cloud API does not support QR or phone-number pairing. Register and verify the business phone number in WhatsApp Manager first.') }
  getStatus() { return this.status }
  async shutdown() { this.status = this.makeStatus('disconnected'); this.statusListener?.(this.status) }
}

import { randomUUID } from 'node:crypto'
import { getPairingRequest, savePairingRequest } from '../database/db.js'
import { whatsappService } from './whatsapp.js'
import type { PairingRequestRecord } from '../types/index.js'

export async function createPairingRequest(phoneNumber: string, serverId: string) {
  const now = new Date().toISOString()
  const request: PairingRequestRecord = { requestId: randomUUID(), phoneNumber, serverId, status: 'pending', message: 'Pairing request queued for the authorized WhatsApp service.', createdAt: now, updatedAt: now }
  savePairingRequest(request)
  try {
    await whatsappService.requestPairing(phoneNumber)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Pairing service unavailable.'
    request.status = 'failed'
    request.message = message
    request.updatedAt = new Date().toISOString()
    savePairingRequest(request)
  }
  return request
}

export function getPairingStatus(requestId: string) { return getPairingRequest(requestId) }

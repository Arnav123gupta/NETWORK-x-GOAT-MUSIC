import { Router } from 'express'
import { z } from 'zod'
import { getPairingStatus } from '../services/pairing.js'

const internationalPhone = z.string().transform((value) => value.replace(/\D/g, '')).refine((value) => /^[1-9]\d{7,14}$/.test(value), 'Use an international phone number.')
export const requestSchema = z.object({ phoneNumber: internationalPhone, serverId: z.string().min(1) })
export const pairingRouter = Router()

pairingRouter.post('/request', (_request, response) => {
  return response.status(409).json({
    error: 'Personal QR/phone pairing is not supported by the configured WhatsApp Cloud API adapter. Register and verify a business phone number in Meta WhatsApp Manager instead.',
    code: 'PAIRING_UNSUPPORTED',
    setup: 'Configure WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_WEBHOOK_VERIFY_TOKEN, and WHATSAPP_APP_SECRET on the backend.'
  })
})

pairingRouter.get('/status/:requestId', (request, response) => {
  const pairing = getPairingStatus(request.params.requestId)
  if (!pairing) return response.status(404).json({ error: 'Pairing request not found', code: 'NOT_FOUND' })
  return response.json(pairing)
})

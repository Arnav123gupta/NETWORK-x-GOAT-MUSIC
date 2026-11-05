import { Router } from 'express'
import { z } from 'zod'
import { createPairingRequest, getPairingStatus } from '../services/pairing.js'

export const requestSchema = z.object({ phoneNumber: z.string().regex(/^\+[1-9]\d{7,14}$/, 'Use an international phone number.'), serverId: z.string().min(1) })
export const pairingRouter = Router()
pairingRouter.post('/request', async (request, response, next) => {
  try {
    const input = requestSchema.parse(request.body)
    const pairing = await createPairingRequest(input.phoneNumber, input.serverId)
    response.status(pairing.status === 'failed' ? 503 : 202).json(pairing)
  } catch (error) { next(error) }
})
pairingRouter.get('/status/:requestId', (request, response) => {
  const pairing = getPairingStatus(request.params.requestId)
  if (!pairing) return response.status(404).json({ error: 'Pairing request not found', code: 'NOT_FOUND' })
  return response.json(pairing)
})
